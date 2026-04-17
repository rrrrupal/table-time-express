import { useState } from "react";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidExpiry,
  isValidCvv,
  isValidCardholderName,
  CardBrand,
} from "@/lib/cardValidation";

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  brand: CardBrand;
}

interface CardDetailsFormProps {
  value: CardDetails;
  onChange: (details: CardDetails) => void;
  errors: Partial<Record<keyof CardDetails, string>>;
}

const brandColors: Record<CardBrand, string> = {
  visa: "text-blue-600",
  mastercard: "text-orange-600",
  amex: "text-cyan-600",
  discover: "text-amber-600",
  unknown: "text-muted-foreground",
};

const CardDetailsForm = ({ value, onChange, errors }: CardDetailsFormProps) => {
  const update = (patch: Partial<CardDetails>) => onChange({ ...value, ...patch });

  const numberValid = value.number && isValidCardNumber(value.number);
  const expiryValid = value.expiry && isValidExpiry(value.expiry);
  const cvvValid = value.cvv && isValidCvv(value.cvv, value.brand);
  const nameValid = value.name && isValidCardholderName(value.name);

  return (
    <div className="space-y-3 bg-secondary/30 rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Lock size={12} />
        <span>Your card details are encrypted and secure</span>
      </div>

      {/* Card number */}
      <div>
        <label className="block font-body font-semibold text-foreground text-xs mb-1.5">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={value.number}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              update({ number: formatted, brand: detectCardBrand(formatted) });
            }}
            placeholder="1234 5678 9012 3456"
            className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-background border font-body text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary tracking-wider ${
              errors.number ? "border-destructive" : "border-border"
            }`}
          />
          <CreditCard
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${brandColors[value.brand]}`}
          />
          {numberValid && (
            <CheckCircle2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
            />
          )}
        </div>
        {errors.number && (
          <p className="text-destructive text-xs font-body mt-1">{errors.number}</p>
        )}
        {value.brand !== "unknown" && !errors.number && (
          <p className={`text-xs font-body mt-1 capitalize ${brandColors[value.brand]}`}>
            {value.brand} detected
          </p>
        )}
      </div>

      {/* Cardholder name */}
      <div>
        <label className="block font-body font-semibold text-foreground text-xs mb-1.5">
          Cardholder Name
        </label>
        <div className="relative">
          <input
            type="text"
            autoComplete="cc-name"
            value={value.name}
            onChange={(e) => update({ name: e.target.value.toUpperCase() })}
            placeholder="JOHN DOE"
            className={`w-full px-3 pr-10 py-2.5 rounded-lg bg-background border font-body text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-destructive" : "border-border"
            }`}
          />
          {nameValid && (
            <CheckCircle2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
            />
          )}
        </div>
        {errors.name && (
          <p className="text-destructive text-xs font-body mt-1">{errors.name}</p>
        )}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-body font-semibold text-foreground text-xs mb-1.5">
            Expiry (MM/YY)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={value.expiry}
              onChange={(e) => update({ expiry: formatExpiry(e.target.value) })}
              placeholder="12/28"
              className={`w-full px-3 pr-9 py-2.5 rounded-lg bg-background border font-body text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.expiry ? "border-destructive" : "border-border"
              }`}
            />
            {expiryValid && (
              <CheckCircle2
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary"
              />
            )}
          </div>
          {errors.expiry && (
            <p className="text-destructive text-xs font-body mt-1">{errors.expiry}</p>
          )}
        </div>
        <div>
          <label className="block font-body font-semibold text-foreground text-xs mb-1.5">
            CVV
          </label>
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={value.cvv}
              maxLength={value.brand === "amex" ? 4 : 3}
              onChange={(e) =>
                update({ cvv: e.target.value.replace(/\D/g, "") })
              }
              placeholder={value.brand === "amex" ? "1234" : "123"}
              className={`w-full px-3 pr-9 py-2.5 rounded-lg bg-background border font-body text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.cvv ? "border-destructive" : "border-border"
              }`}
            />
            {cvvValid && (
              <CheckCircle2
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary"
              />
            )}
          </div>
          {errors.cvv && (
            <p className="text-destructive text-xs font-body mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
