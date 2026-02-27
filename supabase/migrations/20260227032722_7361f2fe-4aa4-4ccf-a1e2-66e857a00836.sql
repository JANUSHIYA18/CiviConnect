
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL,
  service_category TEXT NOT NULL,
  description TEXT NOT NULL,
  request_ref TEXT NOT NULL DEFAULT ('SR-' || substr(gen_random_uuid()::text, 1, 8)),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own service requests" ON public.service_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create service requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own service requests" ON public.service_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
