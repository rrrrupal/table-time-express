// Real-world card validation utilities

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export const detectCardBrand = (number: string): CardBrand => {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "unknown";
};

// Luhn algorithm — used by all major card networks
export const isValidCardNumber = (number: string): boolean => {
  const n = number.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(n)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = parseInt(n.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  const brand = detectCardBrand(digits);
  // Amex: 4-6-5 grouping
  if (brand === "amex") {
    return digits
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      )
      .trim();
  }
  // Default: 4-4-4-4
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const isValidExpiry = (value: string): boolean => {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  // Last day of expiry month
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry >= now;
};

export const isValidCvv = (cvv: string, brand: CardBrand): boolean => {
  const len = brand === "amex" ? 4 : 3;
  return new RegExp(`^\\d{${len}}$`).test(cvv);
};

export const isValidCardholderName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^[a-zA-Z\s'.-]+$/.test(trimmed);
};
