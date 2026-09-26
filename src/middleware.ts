import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";
import { isRouteLocale, getLocaleFromPathname, stripLocaleFromPathname, DEFAULT_ROUTE_LOCALE } from "~/lib/locale-path";

const { auth } = NextAuth(authConfig);

/** Детектує бажану локаль: cookie → Accept-Language → дефолт */
function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (isRouteLocale(cookie)) return cookie;

  const acceptLanguage = req.headers.get("accept-language") ?? "";
  if (/(^|[,\s])uk(\b|-)/i.test(acceptLanguage)) return "uk";

  return DEFAULT_ROUTE_LOCALE;
}

export default auth(function middleware(req) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // ─── 0. Обробка Preview-доступу (?preview=true або ?preview=false) ─────────
  const previewParam = nextUrl.searchParams.get("preview")?.toLowerCase();
  const hasExitPreview = nextUrl.searchParams.has("exit_preview");

  if (previewParam === "false" || previewParam === "exit" || hasExitPreview) {
    const targetLocale = getLocaleFromPathname(pathname) ?? detectLocale(req);
    const homeUrl = new URL(`/${targetLocale}`, nextUrl);
    const res = NextResponse.redirect(homeUrl);
    res.cookies.delete("voytart_preview");
    return res;
  }

  if (previewParam === "true" || previewParam === "voytart" || previewParam === "1") {
    let targetUrl: URL;
    const existingLocale = getLocaleFromPathname(pathname);
    if (existingLocale) {
      targetUrl = new URL(nextUrl.toString());
      targetUrl.searchParams.delete("preview");
    } else {
      const targetLocale = detectLocale(req);
      const restPath = stripLocaleFromPathname(pathname) === "/" ? "" : stripLocaleFromPathname(pathname);
      targetUrl = new URL(`/${targetLocale}${restPath}`, nextUrl);
      nextUrl.searchParams.forEach((val, key) => {
        if (key !== "preview") targetUrl.searchParams.set(key, val);
      });
    }

    const res = NextResponse.redirect(targetUrl);
    res.cookies.set("voytart_preview", "true", { path: "/", sameSite: "lax" });
    return res;
  }

  // ─── 1. Адмінка: сесійний захист (поза локаллю), як і раніше ──────────────
  if (pathname.startsWith("/admin")) {
    const isLoggedIn = !!req.auth?.user;
    const isLoginPage = pathname === "/admin/login";

    if (isAdminRouteProtected(pathname) && !isLoginPage && !isLoggedIn) {
      const loginUrl = new URL("/admin/login", nextUrl);
      // Зберігаємо callbackUrl, щоб повернути користувача після логіну
      loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const safeCallback =
        callbackUrl && callbackUrl.startsWith("/admin") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/admin";
      return NextResponse.redirect(new URL(safeCallback, nextUrl));
    }

    return NextResponse.next();
  }

  // ─── 2. Внутрішні ресурси / API / статика — пропускаємо без змін ─────────
  const isInternalAsset =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/generated") ||
    nextUrl.searchParams.has("rsc") ||
    /\.[^/]+$/.test(pathname); // favicon.svg, *.png, robots.txt тощо

  if (isInternalAsset) return NextResponse.next();

  // ─── 3. Легасі-сумісність: ?lang=ua|en на шляху без префікса ─────────────
  const legacyLang = nextUrl.searchParams.get("lang")?.toLowerCase();

  // Шлях уже локалізований → тільки нормалізуємо легасі ?lang=... якщо є
  const existingLocale = getLocaleFromPathname(pathname);
  if (existingLocale && legacyLang) {
    const params = new URLSearchParams(nextUrl.searchParams);
    params.delete("lang");
    const qs = params.toString();
    return NextResponse.redirect(
      new URL(`${pathname}${qs ? `?${qs}` : ""}`, nextUrl)
    );
  }
  if (existingLocale) return NextResponse.next();

  // ─── 4. Публічний шлях без префікса → редирект на /{locale}/... ───────────
  const locale =
    legacyLang === "ua" || legacyLang === "uk"
      ? "uk"
      : legacyLang === "en"
        ? "en"
        : detectLocale(req);

  const params = new URLSearchParams(nextUrl.searchParams);
  params.delete("lang");
  const qs = params.toString();

  const restPath =
    stripLocaleFromPathname(pathname) === "/"
      ? ""
      : stripLocaleFromPathname(pathname);

  return NextResponse.redirect(
    new URL(`/${locale}${restPath}${qs ? `?${qs}` : ""}`, nextUrl)
  );
});

function isAdminRouteProtected(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

// /admin — для auth-захисту; решта публічних шляхів — для locale-редиректів.
// Виключено api/_next/статичні файли (все одно пропускаються вище, тут для продуктивності).
export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)",
  ],
};