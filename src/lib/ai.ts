import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

export type AiAnalysis = {
  summary: string;
  themes: string[];
  suggestions: string[];
  tone: "heavy" | "mixed" | "steady";
};

export type AiInsights = {
  headline: string;
  insights: string[];
  focusThisWeek: string;
};

export type AiArticle = {
  title: string;
  source: string;
  url: string;
  summary: string;
  whyRelevant: string;
};

export type AiArticles = {
  unavailable?: string;
  intro: string;
  articles: AiArticle[];
  sources?: { url: string; title: string }[];
};

type Task = "chat" | "journal" | "insights" | "readiness" | "articles" | "summary" | "moderate";

type Payload = {
  task: Task;
  messages?: { role: "user" | "assistant"; text: string }[];
  text?: string;
  context?: Record<string, unknown>;
};


async function callAi<T>(payload: Payload): Promise<T> {
  const { data, error } = await supabase.functions.invoke("gemini", { body: payload });

  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json();
        message = body?.details || body?.error || message;
      } catch {
        /* keep default message */
      }
    }
    throw new Error(message);
  }

  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as T;
}

export const aiChat = (
  messages: { role: "user" | "assistant"; text: string }[],
  context?: Record<string, unknown>,
) => callAi<{ text: string }>({ task: "chat", messages, context });

export const aiAnalyseEntry = (text: string, context?: Record<string, unknown>) =>
  callAi<AiAnalysis>({ task: "journal", text, context });

export const aiInsights = (context: Record<string, unknown>) =>
  callAi<AiInsights>({ task: "insights", context });

export const aiReadinessInsights = (context: Record<string, unknown>) =>
  callAi<AiInsights>({ task: "readiness", context });

export const aiFindArticles = (query: string, context?: Record<string, unknown>) =>
  callAi<AiArticles>({ task: "articles", text: query, context });

export type AiModeration = {
  decision: "approved" | "needs_edit" | "blocked" | "escalate";
  reason: string;
  guideline?: string;
  suggestion?: string;
};

export const aiModerate = (text: string) => callAi<AiModeration>({ task: "moderate", text });

export const aiConversationSummary = (
  messages: { role: "user" | "assistant"; text: string }[],
  context?: Record<string, unknown>,
) => callAi<AiInsights>({ task: "summary", messages, context });
