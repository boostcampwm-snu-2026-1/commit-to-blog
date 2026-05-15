import type { IntegrationMode } from "../api/types";

interface ModePillProps {
  label: string;
  mode: IntegrationMode;
}

export function ModePill({ label, mode }: ModePillProps) {
  return (
    <span className={`mode-pill mode-pill--${mode}`}>
      <strong>{label}</strong>
      <span>{mode === "live" ? "live" : "demo"}</span>
    </span>
  );
}

