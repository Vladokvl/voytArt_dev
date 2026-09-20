import { db } from "~/lib/db";
import CollectionForm from "../_CollectionForm";

export default async function CollectionNewPage() {
  const authors = await db.author.findMany({ orderBy: { lastName: "asc" } });
  return <CollectionForm authors={authors} />;
}
