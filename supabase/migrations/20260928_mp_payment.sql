-- Migration: Adiciona suporte ao Mercado Pago na tabela orders
-- Adiciona coluna mp_preference_id para armazenar o ID da preferência MP

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT;

-- Atualiza o enum payment_status para incluir 'refunded' se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'refunded'
    AND enumtypid = (
      SELECT oid FROM pg_type WHERE typname = 'payment_status'
    )
  ) THEN
    ALTER TYPE public.payment_status ADD VALUE 'refunded';
  END IF;
END$$;

-- Cria política RLS para permitir inserção de pedidos anônimos
-- (usuários não autenticados também podem criar pedidos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'orders'
    AND policyname = 'Allow anonymous order insert'
  ) THEN
    CREATE POLICY "Allow anonymous order insert"
      ON public.orders
      FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'order_items'
    AND policyname = 'Allow anonymous order_items insert'
  ) THEN
    CREATE POLICY "Allow anonymous order_items insert"
      ON public.order_items
      FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;
