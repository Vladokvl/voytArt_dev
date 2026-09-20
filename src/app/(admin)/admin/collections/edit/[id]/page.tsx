import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import CollectionForm from "../../_CollectionForm";

export default async function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const collection = await db.collection.findUnique({ where: { id } });
  if (!collection) return notFound();

  const authors = await db.author.findMany({ orderBy: { lastName: "asc" } });

  return <CollectionForm collection={collection} authors={authors} />;
}
