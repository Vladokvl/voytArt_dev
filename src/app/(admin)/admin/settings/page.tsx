import { requireAdmin } from "~/lib/admin-guard";
import { db } from "~/lib/db";
import { getCachedSiteSettings, getCachedTranslations } from "~/lib/site-settings";
import { siteUrl } from "~/lib/site-url";
import SettingsForm from "./_SettingsForm";
import type { VersionItem } from "./_VersionsModal";

export const metadata = {
  title: "Керування сайтом | VoytArt Admin",
};

export default async function SettingsPage() {
  await requireAdmin();

  const [settings, translations, rawVersions] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTranslations(),
    db.translationVersion.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const versions: VersionItem[] = rawVersions.map((v) => ({
    id: v.id,
    name: v.name,
    isActive: v.isActive,
    createdAt: v.createdAt.toISOString(),
    dataEn: v.dataEn,
    dataUk: v.dataUk,
  }));

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.4rem 0" }}>
          Керування сайтом
        </h1>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
          Налаштування режиму «Скоро відкриття», генерація preview-посилань та редагування перекладів з історією версій.
        </p>
      </div>

      <SettingsForm
        initialComingSoonMode={settings.comingSoonMode}
        initialTranslations={translations}
        initialVersions={versions}
        siteUrl={siteUrl}
      />
    </div>
  );
}
