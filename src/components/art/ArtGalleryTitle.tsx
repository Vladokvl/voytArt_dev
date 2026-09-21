"use client";

import { useTranslation } from "~/context/LanguageContext";
import { getLocalized, formatAuthorName } from "~/lib/i18n";

type Author = {
  firstName: string;
  lastName?: string | null;
  firstNameUk?: string | null;
  lastNameUk?: string | null;
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
    const firstName = getLocalized(selectedAuthor, "firstName", locale);
    const lastName = getLocalized(selectedAuthor, "lastName", locale);
    const name = formatAuthorName(firstName, lastName);
    return <h2 className={className}>{t("art.authorWorks", { name })}</h2>;
  }

  return <h2 className={className}>{t("art.ourPaintings")}</h2>;
}
