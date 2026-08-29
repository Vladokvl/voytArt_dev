export default function GalleryLoading() {
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "6rem 1.5rem 4rem",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          width: "240px",
          height: "42px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.07)",
          marginBottom: "2.5rem",
          animation: "pulse 1.5s infinite ease-in-out",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "220px",
                background: "rgba(255, 255, 255, 0.06)",
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            />
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div
                style={{
                  width: "80%",
                  height: "20px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.06)",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
              <div
                style={{
                  width: "50%",
                  height: "14px",
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
