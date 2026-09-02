CREATE TABLE public.impact_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mental_wellbeing_improved boolean NOT NULL,
  body_confidence_improved boolean NOT NULL,
  physical_goals_improved boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.impact_responses TO authenticated;
GRANT ALL ON public.impact_responses TO service_role;

ALTER TABLE public.impact_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit their own impact response"
  ON public.impact_responses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own impact responses"
  ON public.impact_responses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
