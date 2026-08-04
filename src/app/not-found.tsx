import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--space-4)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "6rem",
          marginBottom: "var(--space-4)",
          opacity: 0.6,
          animation: "breathe 4s ease-in-out infinite",
        }}
      >
        🌑
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-4xl)",
          marginBottom: "var(--space-3)",
          background: "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Página no encontrada
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "var(--text-lg)",
          maxWidth: "400px",
          marginBottom: "var(--space-8)",
          lineHeight: 1.6,
        }}
      >
        Este rincón del jardín aún no tiene camino. Quizá se haya perdido entre
        las estrellas.
      </p>
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Link href="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <Link href="/timeline" className="btn btn-ghost">
          Ver timeline
        </Link>
      </div>
    </div>
  );
}
