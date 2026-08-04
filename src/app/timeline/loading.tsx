export default function TimelineLoading() {
  return (
    <main className="page-wrapper">
      <div className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "var(--space-8)",
            paddingTop: "var(--space-8)",
          }}
        >
          <div
            className="skeleton skeleton-title"
            style={{ width: "150px", margin: "0 auto var(--space-3)" }}
          />
          <div
            className="skeleton skeleton-text"
            style={{ width: "300px", maxWidth: "90%", margin: "0 auto" }}
          />
        </div>

        {/* Filter chips skeleton */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                width: `${80 + i * 20}px`,
                height: "36px",
                borderRadius: "var(--radius-full)",
              }}
            />
          ))}
        </div>

        {/* Post cards skeleton */}
        <div className="timeline-layout" style={{ maxWidth: "720px", margin: "0 auto" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "150px", borderRadius: "var(--radius-lg)" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
