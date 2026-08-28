import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import AuthorEditForm from "./_editForm";

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await db.author.findUnique({ where: { id: Number(id) } });
  if (!author) notFound();
  return <AuthorEditForm author={author} />;
}
