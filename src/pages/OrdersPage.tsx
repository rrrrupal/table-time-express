import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Package, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Order placed",
  preparing: "Being prepared",
  ready: "Ready for pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusSteps = ["pending", "preparing", "ready", "delivered"];

const OrdersPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" as const })
        .eq("id", orderId);
      if (error) throw error;
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status as string;
          toast.info(`Order status updated: ${statusLabels[newStatus] || newStatus}`);
          queryClient.invalidateQueries({ queryKey: ["orders", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground font-body">Loading orders...</div>
        ) : !orders?.length ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-body text-muted-foreground">No orders yet</p>
            <Link to="/" className="inline-block mt-4 text-primary font-body font-semibold hover:underline">
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const currentStepIndex = statusSteps.indexOf(order.status);
                const isCancelled = order.status === "cancelled";

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <Clock size={14} />
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </div>
                      <motion.span
                        key={order.status}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-xs font-body font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || ""}`}
                      >
                        {statusLabels[order.status] || order.status}
                      </motion.span>
                    </div>

                    {/* Progress tracker */}
                    {!isCancelled && (
                      <div className="flex items-center gap-1 mb-4">
                        {statusSteps.map((step, i) => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                              i <= currentStepIndex ? "bg-primary" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="space-y-1">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between font-body text-sm">
                          <span className="text-foreground">{item.quantity}× {item.menu_item_name}</span>
                          <span className="text-muted-foreground">${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between font-display font-bold text-foreground">
                      <span>Total</span>
                      <div className="flex items-center gap-3">
                        <span className="text-primary">${Number(order.total_amount).toFixed(2)}</span>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancellingId === order.id}
                            className="flex items-center gap-1 text-xs font-body font-medium text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
