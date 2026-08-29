import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          background: "#080808",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "480px" }}>
          <span style={{ fontSize: "5rem", fontWeight: 900, color: "#d7ff01" }}>404</span>
          <h1 style={{ fontSize: "1.75rem", margin: "1rem 0" }}>Сторінку не знайдено</h1>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
          <Link
            href="/uk"
            style={{
              padding: "0.85rem 2rem",
              borderRadius: "999px",
              background: "#d7ff01",
              color: "#000000",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            На головну
          </Link>
        </div>
      </body>
    </html>
  );
}
