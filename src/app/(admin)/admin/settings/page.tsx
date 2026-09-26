import { requireAdmin } from "~/lib/admin-guard";
import { db } from "~/lib/db";
import { getCachedSiteSettings, getCachedTranslations } from "~/lib/site-settings";
import { isResendConfigured } from "~/lib/email/resend";
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
          Керування режимом очікування, перекладами, поштовими сповіщеннями Resend та налаштуваннями сайту.
        </p>
      </div>

      <SettingsForm
        initialComingSoonMode={settings.comingSoonMode}
        initialTranslations={translations}
        initialVersions={versions}
        siteUrl={siteUrl}
        initialNotifyEmail={settings.notifyEmail}
        initialSenderEmail={settings.senderEmail}
        initialNotifyOnOrders={settings.notifyOnOrders}
        initialNotifyOnInquiries={settings.notifyOnInquiries}
        initialNotifyCustomerOnOrder={settings.notifyCustomerOnOrder}
        isResendConfigured={isResendConfigured()}
      />
    </div>
  );
}
