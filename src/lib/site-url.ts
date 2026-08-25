export const siteUrl = process.env.NEXT_PUBLIC_APP_URL
  ? (process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_APP_URL
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
  : "https://testing.zhovtok.work";
