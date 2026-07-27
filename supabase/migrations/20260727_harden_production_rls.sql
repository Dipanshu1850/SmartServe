-- Production RLS hardening. Apply after 20260726_create_orders.sql.
-- This intentionally requires customers to be authenticated before ordering.

-- Profiles: private to their owner; a customer cannot self-assign a role.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles." ON public.profiles;

CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile details."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.prevent_self_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.id AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Users cannot change their own role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_self_role_change ON public.profiles;
CREATE TRIGGER prevent_self_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_change();

-- Orders: customers see/create only their own; restaurant roles may read and
-- advance all orders. Role changes must be performed by a trusted server/admin.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

DROP POLICY IF EXISTS "Orders are readable by restaurant clients." ON public.orders;
DROP POLICY IF EXISTS "Orders can be created by restaurant clients." ON public.orders;
DROP POLICY IF EXISTS "Orders can be updated by restaurant clients." ON public.orders;

CREATE POLICY "Customers can read their own orders and staff can read all."
  ON public.orders FOR SELECT
  USING (
    customer_id = auth.uid()
    OR public.current_user_role() IN ('staff', 'manager', 'owner')
  );

CREATE POLICY "Customers can create their own orders."
  ON public.orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Restaurant staff can update orders."
  ON public.orders FOR UPDATE
  USING (public.current_user_role() IN ('staff', 'manager', 'owner'))
  WITH CHECK (public.current_user_role() IN ('staff', 'manager', 'owner'));
