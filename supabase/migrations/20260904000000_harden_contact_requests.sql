ALTER TABLE public.contact_requests
  ADD CONSTRAINT contact_requests_status_check
    CHECK (status IN ('nouveau', 'en cours', 'traité', 'archivé')) NOT VALID,
  ADD CONSTRAINT contact_requests_name_length_check
    CHECK (char_length(name) BETWEEN 2 AND 100) NOT VALID,
  ADD CONSTRAINT contact_requests_email_length_check
    CHECK (char_length(email) BETWEEN 3 AND 254) NOT VALID,
  ADD CONSTRAINT contact_requests_message_length_check
    CHECK (char_length(message) BETWEEN 20 AND 3000) NOT VALID;

CREATE INDEX IF NOT EXISTS contact_requests_status_created_at_idx
  ON public.contact_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx
  ON public.contact_requests (created_at DESC);
