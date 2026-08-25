import "server-only";
import { auth } from "~/auth";

/**
 * Guard для всіх адмінських Server Actions.
 * Middleware захищає лише навігацію на /admin/*, але Server Actions є
 * публічними HTTP-endpoints і можуть бути викликані напряму без сесії.
 * Викликайте цю функцію на початку кожної адмінської дії.
 */
export async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}