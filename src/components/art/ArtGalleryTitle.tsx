"use client";

import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";

type Author = {
  firstName: string;
  firstNameUk?: string | null;
};

export default function ArtGalleryTitle({
  selectedAuthor,
  className,
}: {
  selectedAuthor: Author | null;
  className?: string;
}) {
  const { t, locale } = useTranslation();

  if (selectedAuthor) {
    const name = getLocalized(selectedAuthor, "firstName", locale);
    return <h2 className={className}>{t("art.authorWorks", { name })}</h2>;
  }

  return <h2 className={className}>{t("art.ourPaintings")}</h2>;
}
