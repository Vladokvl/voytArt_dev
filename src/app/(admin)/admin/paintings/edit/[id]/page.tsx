import { db } from "~/lib/db";
import { notFound } from "next/navigation";
import PaintingForm from "../../_PaintingForm";

export default async function EditPaintingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const [painting, authors, collections] = await Promise.all([
    db.painting.findUnique({ where: { id }, include: { author: true, media: true } }),
    db.author.findMany({ orderBy: { lastName: "asc" } }),
    db.collection.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, authorId: true } }),
  ]);
  if (!painting) return notFound();

  return <PaintingForm painting={painting} authors={authors} collections={collections} />;
}