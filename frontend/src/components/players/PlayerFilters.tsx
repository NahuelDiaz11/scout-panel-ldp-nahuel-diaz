import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePositions, useNationalities } from "../../hooks/usePlayers";
import type { PlayersFilters } from "../../hooks/usePlayers";

interface Props {
  filters: PlayersFilters;
  onChange: (filters: PlayersFilters) => void;
}

const C = {
  card: "#161616",
  surface: "#1C1C1C",
  border: "#242424",
  text: "#F2F2F2",
  muted: "#8C8C8C",
  primary: "#00E094",
};

export function PlayerFilters({ filters, onChange }: Props) {
  const { data: positionsData } = usePositions();
  const { data: nationalitiesData } = useNationalities();

  const positions = positionsData?.data || [];
  const nationalities = nationalitiesData?.data || [];

  // Estado para abrir/cerrar los filtros adicionales
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Manejador genérico para actualizar un filtro y resetear la página a 1
  const handleChange = (key: keyof PlayersFilters, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  // Para contar cuántos filtros avanzados están activos
  const activeFiltersCount = [
    filters.position,
    filters.nationality,
    filters.ageMin,
    filters.ageMax
  ].filter(Boolean).length;

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
    }}>
      <style>{`
                .ldp-input {
                    width: 100%;
                    background: ${C.surface};
                    border: 1px solid ${C.border};
                    color: ${C.text};
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-family: 'Nunito Sans', sans-serif;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .ldp-input::placeholder {
                    color: ${C.muted};
                }
                .ldp-input:focus {
                    border-color: ${C.primary};
                    box-shadow: 0 0 0 3px rgba(0, 224, 148, 0.15);
                }
                .ldp-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238C8C8C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    background-size: 16px;
                    padding-right: 40px;
                }
                .ldp-select option {
                    background: ${C.card};
                    color: ${C.text};
                }
            `}</style>

      {/* ── BARRA PRINCIPAL (Búsqueda y Botón Avanzado) ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* Input de Búsqueda con Icono */}
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <Search
            size={18}
            color={C.muted}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            className="ldp-input"
            placeholder="Buscar por nombre de jugador..."
            style={{ paddingLeft: 44 }}
            value={filters.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {filters.name && (
            <button
              onClick={() => handleChange("name", "")}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: C.muted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 4
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Botón Filtros Avanzados */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0 20px", background: showAdvanced ? "rgba(0, 224, 148, 0.1)" : C.surface,
            border: `1px solid ${showAdvanced ? C.primary : C.border}`,
            color: showAdvanced ? C.primary : C.text,
            borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <SlidersHorizontal size={18} />
          Filtros
          {activeFiltersCount > 0 && (
            <span style={{
              background: C.primary, color: "#0F0F0F", padding: "2px 6px",
              borderRadius: 12, fontSize: 12, marginLeft: 4
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Botón Limpiar Todos (Solo visible si hay algún filtro activo) */}
        {(filters.name || activeFiltersCount > 0) && (
          <button
            onClick={() => onChange({ page: 1 })}
            style={{
              display: "flex", alignItems: "center",
              padding: "0 16px", background: "transparent",
              border: "none", color: C.muted,
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.2s", textDecoration: "underline"
            }}
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* ── FILTROS AVANZADOS (Desplegable) ── */}
      {showAdvanced && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginTop: 20,
          paddingTop: 20,
          borderTop: `1px solid ${C.border}`,
          animation: "fadeIn 0.3s ease"
        }}>

          {/* Posición */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
              Posición
            </label>
            <select
              className="ldp-input ldp-select"
              value={filters.position || ""}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="">Todas</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Nacionalidad */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
              Nacionalidad
            </label>
            <select
              className="ldp-input ldp-select"
              value={filters.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
            >
              <option value="">Cualquiera</option>
              {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Edad Mínima */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
              Edad Mínima
            </label>
            <input
              type="number"
              className="ldp-input"
              placeholder="Ej: 16"
              min="15" max="50"
              value={filters.ageMin || ""}
              onChange={(e) => handleChange("ageMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Edad Máxima */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
              Edad Máxima
            </label>
            <input
              type="number"
              className="ldp-input"
              placeholder="Ej: 35"
              min="15" max="50"
              value={filters.ageMax || ""}
              onChange={(e) => handleChange("ageMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

        </div>
      )}
    </div>
  );
}