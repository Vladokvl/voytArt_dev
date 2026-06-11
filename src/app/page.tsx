import { headers } from "next/headers";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";

// Dynamic imports — завантажуємо тільки потрібний компонент
const HeroDesktop = dynamic(
  () => import("@/components/home/Hero/HeroDesktop"),
);
const HeroMobile = dynamic(() => import("@/components/home/Hero/HeroMobile"));

// Server component — визначаємо тип пристрою за User-Agent на сервері.
// Це уникає завантаження зайвого JS на клієнті.
export default async function Home() {
  const headersList = await headers();
  const ua = headersList.get("user-agent") ?? "";

  // Телефони та планшети → мобайл версія
  // Змінюй regex якщо треба додати або прибрати пристрої
  const isMobile = /Mobi|Android|iPhone|iPad|Tablet/i.test(ua);

  return (
    <main className={styles.main}>
      {isMobile ? <HeroMobile /> : <HeroDesktop />}
    </main>
  );
}

