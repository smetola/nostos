export default function Loading() {
  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Header skeleton */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "var(--space-12)",
            paddingTop: "var(--space-8)",
          }}
        >
          <div
            className="skeleton skeleton-title"
            style={{ width: "200px", margin: "0 auto var(--space-3)" }}
          />
          <div
            className="skeleton skeleton-text"
            style={{ width: "350px", maxWidth: "90%", margin: "0 auto" }}
          />
        </div>

        {/* Category grid skeleton */}
        <div
          style={{ marginBottom: "var(--space-12)" }}
        >
          <div
            className="skeleton skeleton-text"
            style={{ width: "160px", marginBottom: "var(--space-5)" }}
          />
          <div className="category-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        </div>

        {/* Posts skeleton */}
        <div
          className="skeleton skeleton-text"
          style={{ width: "180px", marginBottom: "var(--space-5)" }}
        />
        <div className="timeline-layout">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "140px", borderRadius: "var(--radius-lg)" }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
