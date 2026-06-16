-- Allow admin users to view all customer profiles in the profiles table
CREATE POLICY "profiles_select_all_for_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
