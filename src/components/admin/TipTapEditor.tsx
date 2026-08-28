"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import formStyles from "~/app/(admin)/admin/_formStyles.module.scss";

export default function TipTapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      // Prevent cursor jumping if content is exactly the same, but allow external resets
      // Note: we usually don't want to blindly setContent on every render.
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="skeleton-editor" style={{ minHeight: "200px", background: "#f1f5f9", borderRadius: "8px" }} />;
  }

  return (
    <div className={formStyles.editorWrapper}>
      <div className={formStyles.toolbar}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={editor.isActive("bold") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={editor.isActive("italic") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={editor.isActive("bulletList") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
        >
          ≡ Список
        </button>
      </div>
      <EditorContent editor={editor} className={formStyles.editorContent} />
    </div>
  );
}
