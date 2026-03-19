"use server";

import { getDb } from "@/lib/db";
import { promptEvents } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export type PromptEventType = "copy" | "fork" | "share" | "test" | "optimize";

export async function trackPromptEvent(
  promptId: string,
  event: PromptEventType,
) {
  try {
    const session = await auth();
    const db = getDb();
    await db.insert(promptEvents).values({
      promptId,
      userId: session?.user?.id ?? null,
      event,
    });
  } catch {
    // Non-blocking
  }
}
