export default function ShopLoading() {
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "6rem 1.5rem 4rem",
        minHeight: "80vh",
      }}
    >
      {/* Title skeleton */}
      <div
        style={{
          width: "220px",
          height: "40px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.07)",
          marginBottom: "2rem",
          animation: "pulse 1.5s infinite ease-in-out",
        }}
      />

      {/* Categories skeleton bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "3rem",
          overflowX: "hidden",
        }}
      >
        {[100, 80, 120, 90, 110].map((width, idx) => (
          <div
            key={idx}
            style={{
              width: `${width}px`,
              height: "36px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.05)",
              animation: "pulse 1.5s infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                background: "rgba(255, 255, 255, 0.06)",
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            />
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div
                style={{
                  width: "70%",
                  height: "18px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.06)",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
              <div
                style={{
                  width: "40%",
                  height: "16px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.04)",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
