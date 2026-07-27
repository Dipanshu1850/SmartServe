-- Apply this migration after the existing schema.sql. It is safe to re-run.
DO $$
BEGIN
  CREATE TYPE order_status AS ENUM ('queued', 'preparing', 'ready', 'served');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status order_status NOT NULL DEFAULT 'queued',
  minutes INTEGER NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders are readable by restaurant clients." ON public.orders;
CREATE POLICY "Orders are readable by restaurant clients."
  ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Orders can be created by restaurant clients." ON public.orders;
CREATE POLICY "Orders can be created by restaurant clients."
  ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Orders can be updated by restaurant clients." ON public.orders;
CREATE POLICY "Orders can be updated by restaurant clients."
  ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
