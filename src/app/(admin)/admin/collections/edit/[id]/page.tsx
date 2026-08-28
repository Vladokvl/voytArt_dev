import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import CollectionEditForm from "./_editForm";

export default async function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const collection = await db.collection.findUnique({ where: { id } });
  if (!collection) return notFound();

  const authors = await db.author.findMany({ orderBy: { lastName: "asc" } });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>
        Редагувати колекцію
      </h1>
      <CollectionEditForm collection={collection} authors={authors} />
    </div>
  );
}
