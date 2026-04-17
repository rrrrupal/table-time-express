-- Add dedicated payment fields to orders
CREATE TYPE public.payment_method AS ENUM ('card', 'cash', 'wallet');

ALTER TABLE public.orders
  ADD COLUMN payment_method public.payment_method NOT NULL DEFAULT 'cash',
  ADD COLUMN card_brand TEXT,
  ADD COLUMN card_last4 TEXT;

-- Backfill existing rows from notes (best-effort)
UPDATE public.orders
SET payment_method = CASE
  WHEN notes ILIKE '%card%' THEN 'card'::public.payment_method
  WHEN notes ILIKE '%wallet%' THEN 'wallet'::public.payment_method
  ELSE 'cash'::public.payment_method
END
WHERE notes IS NOT NULL;