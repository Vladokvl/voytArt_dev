import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import AuthorForm from "../../_AuthorForm";

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await db.author.findUnique({ where: { id: Number(id) } });
  if (!author) notFound();
  return <AuthorForm author={author} />;
}
