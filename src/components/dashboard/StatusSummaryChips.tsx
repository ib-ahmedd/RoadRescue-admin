interface StatusSummaryChipsProps<T extends string> {
  statuses: readonly T[];
  counts: Record<T, number>;
  colors: Record<T, string>;
}

export default function StatusSummaryChips<T extends string>({
  statuses,
  counts,
  colors,
}: StatusSummaryChipsProps<T>) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {statuses.map((status) => (
        <div
          key={status}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--bg-800)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
            padding: "0.5rem 1rem",
            fontSize: "0.82rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: colors[status],
              display: "inline-block",
            }}
          />
          <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{status}</span>
          <span style={{ color: "var(--text-secondary)" }}>({counts[status]})</span>
        </div>
      ))}
    </div>
  );
}
