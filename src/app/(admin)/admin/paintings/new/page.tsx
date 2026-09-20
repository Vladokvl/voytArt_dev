import { db } from "~/lib/db";
import PaintingForm from "../_PaintingForm";

export default async function NewPaintingPage() {
  const [authors, collections] = await Promise.all([
    db.author.findMany({ orderBy: { lastName: "asc" } }),
    db.collection.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, authorId: true } }),
  ]);
  return <PaintingForm authors={authors} collections={collections} />;
}
