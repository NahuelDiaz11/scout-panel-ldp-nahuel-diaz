import { usePositions, useNationalities } from "../../hooks/usePlayers";
import type { PlayersFilters } from "../../hooks/usePlayers";

interface Props {
  filters: PlayersFilters;
  onChange: (filters: PlayersFilters) => void;
}

const inputStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text)",
  padding: "8px 12px",
  fontSize: 13,
  width: "100%",
  outline: "none",
};

export function PlayerFilters({ filters, onChange }: Props) {
  const { data: positionsData } = usePositions();
  const { data: nationalitiesData } = useNationalities();

  const positions = positionsData?.data || [];
  const nationalities = nationalitiesData?.data || [];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 100px 100px",
      gap: 12,
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 16,
      marginBottom: 24,
    }}>
      <input
        placeholder="Buscar jugador..."
        value={filters.name || ""}
        onChange={e => onChange({ ...filters, name: e.target.value, page: 1 })}
        style={inputStyle}
      />

      <select
        value={filters.position || ""}
        onChange={e => onChange({ ...filters, position: e.target.value, page: 1 })}
        style={inputStyle}
      >
        <option value="">Posición</option>
        {positions.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <select
        value={filters.nationality || ""}
        onChange={e => onChange({ ...filters, nationality: e.target.value, page: 1 })}
        style={inputStyle}
      >
        <option value="">Nacionalidad</option>
        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <input
        type="number"
        placeholder="Edad min"
        value={filters.ageMin || ""}
        onChange={e => onChange({ ...filters, ageMin: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        style={inputStyle}
        min={15} max={50}
      />

      <input
        type="number"
        placeholder="Edad max"
        value={filters.ageMax || ""}
        onChange={e => onChange({ ...filters, ageMax: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        style={inputStyle}
        min={15} max={50}
      />
    </div>
  );
}