import { db } from "~/lib/db";
import CollectionNewForm from "./_newForm";

export default async function CollectionNewPage() {
  const authors = await db.author.findMany({ orderBy: { lastName: "asc" } });
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
        Нова колекція
      </h1>
      <CollectionNewForm authors={authors} />
    </div>
  );
}
