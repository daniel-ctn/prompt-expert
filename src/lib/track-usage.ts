"use server";

import { getDb } from "@/lib/db";
import { apiUsage } from "@/lib/db/schema";

export async function trackUsage(userId: string, endpoint: string, model: string) {
  try {
    const db = getDb();
    await db.insert(apiUsage).values({ userId, endpoint, model });
  } catch {
    // Non-blocking — don't let tracking failures break the request
  }
}
