import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const OrdersPage = () => {
  const { user } = useAuth();

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
            {orders.map((order) => (
              <motion.div
                key={order.id}
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
                  <span className={`text-xs font-body font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between font-body text-sm">
                      <span className="text-foreground">{item.quantity}× {item.menu_item_name}</span>
                      <span className="text-muted-foreground">${(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex justify-between font-display font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${Number(order.total_amount).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
