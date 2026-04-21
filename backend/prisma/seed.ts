import "dotenv/config";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Teams ──────────────────────────────────────────────
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { id: 1 },
      update: { logoUrl: "https://tmssl.akamaized.net//images/wappen/head/189.png" },
      create: { id: 1, name: "CA Boca Juniors", country: "Argentina", logoUrl: "https://tmssl.akamaized.net//images/wappen/head/189.png" }
    }),
    prisma.team.upsert({
      where: { id: 2 },
      update: { logoUrl: "https://tmssl.akamaized.net//images/wappen/head/209.png" },
      create: { id: 2, name: "CA River Plate", country: "Argentina", logoUrl: "https://tmssl.akamaized.net//images/wappen/head/209.png" }
    }),
  ]);

  // ── Seasons ────────────────────────────────────────────
  const [s2024, s2025, s2026] = await Promise.all([
    prisma.season.upsert({ where: { name: "2024" }, update: {}, create: { name: "2024" } }),
    prisma.season.upsert({ where: { name: "2025" }, update: {}, create: { name: "2025" } }),
    prisma.season.upsert({ where: { name: "2026" }, update: {}, create: { name: "2026" } }),
  ]);


  // ── Players
  const playersData = [
    // --- BOCA JUNIORS (IDs 1-11) ---
    { id: 1, firstName: "Leandro", lastName: "Brey", dob: "2002-09-21", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "GK", height: "1.91m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/982633-1739888426.jpg?lm=1", marketValue: 2000000 },
    { id: 2, firstName: "Marcelo", lastName: "Weigandt", dob: "2000-01-11", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "RB", height: "1.75m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/491690-1740775551.jpg?lm=1", marketValue: 2500000 },
    { id: 3, firstName: "Lautaro", lastName: "Di Lollo", dob: "2004-03-10", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CB", height: "1.89m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/1019744-1739889666.jpg?lm=1", marketValue: 1000000 },
    { id: 4, firstName: "Ayrton", lastName: "Costa", dob: "1999-07-12", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CB", height: "1.80m", preferredFoot: "Izquierdo", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/842910-1739889633.jpg?lm=1", marketValue: 2000000 },
    { id: 5, firstName: "Lautaro", lastName: "Blanco", dob: "1999-02-19", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "LB", height: "1.76m", preferredFoot: "Izquierdo", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/831161-1739896785.jpg?lm=1", marketValue: 4500000 },
    { id: 6, firstName: "Santiago", lastName: "Ascacíbar", dob: "1997-02-25", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CDM", height: "1.68m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/423436-1739827128.jpg?lm=1", marketValue: 5500000 },
    { id: 7, firstName: "Ander", lastName: "Herrera", dob: "1989-08-14", nationality: "España", flagUrl: "https://img.sofascore.com/api/v1/country/ES/flag", position: "CM", height: "1.82m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/99343-1709675915.png?lm=1", marketValue: 2000000 },
    { id: 8, firstName: "Milton", lastName: "Delgado", dob: "2005-06-16", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CM", height: "1.74m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/1236677-1739899248.jpg?lm=1", marketValue: 800000 },
    { id: 9, firstName: "Tomás", lastName: "Belmonte", dob: "1998-05-27", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CAM", height: "1.78m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/483446-1739897240.jpg?lm=1", marketValue: 4000000 },
    { id: 10, firstName: "Milton", lastName: "Giménez", dob: "1996-08-12", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CF", height: "1.84m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/730779-1739899590.jpg?lm=1", marketValue: 3500000 },
    { id: 11, firstName: "Exequiel", lastName: "Zeballos", dob: "2002-04-24", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "LW", height: "1.74m", preferredFoot: "Derecho", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/661132-1739899419.jpg?lm=1", marketValue: 6500000 },

    // --- RIVER PLATE (IDs 12-22) ---
    { id: 12, firstName: "Santiago", lastName: "Beltrán", dob: "2004-10-21", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "GK", height: "1.89m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1138089-1762437740.png?lm=1", marketValue: 500000 },
    { id: 13, firstName: "Gonzalo", lastName: "Montiel", dob: "1997-01-01", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "RB", height: "1.75m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/402733-1762437910.png?lm=1", marketValue: 8000000 },
    { id: 14, firstName: "Lucas", lastName: "Martínez Quarta", dob: "1996-05-10", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CB", height: "1.83m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/373373-1762437997.png?lm=1", marketValue: 10000000 },
    { id: 15, firstName: "Lautaro", lastName: "Rivero", dob: "2003-11-01", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CB", height: "1.85m", preferredFoot: "Izquierdo", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1261395-1762437856.png?lm=1", marketValue: 1200000 },
    { id: 16, firstName: "Marcos", lastName: "Acuña", dob: "1991-10-28", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "LB", height: "1.72m", preferredFoot: "Izquierdo", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/60410-1762438025.png?lm=1", marketValue: 4000000 },
    { id: 17, firstName: "Aníbal", lastName: "Moreno", dob: "1999-05-13", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CDM", height: "1.78m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/642758-1746577695.jpg?lm=1", marketValue: 8500000 },
    { id: 18, firstName: "Giuliano", lastName: "Galoppo", dob: "1999-06-18", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CM", height: "1.79m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/567249-1762438415.png?lm=1", marketValue: 6000000 },
    { id: 19, firstName: "Tomás", lastName: "Galván", dob: "2000-04-11", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CAM", height: "1.74m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/893850-1727449987.jpg?lm=1", marketValue: 2500000 },
    { id: 20, firstName: "Joaquín", lastName: "Freitas", dob: "2005-02-14", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "RW", height: "1.77m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1324003-1771857419.jpg?lm=1", marketValue: 1500000 },
    { id: 21, firstName: "Facundo", lastName: "Colidio", dob: "2000-01-04", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "LW", height: "1.79m", preferredFoot: "Derecho", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/491705-1693315193.png?lm=1", marketValue: 5000000 },
    { id: 22, firstName: "Maximiliano", lastName: "Salas", dob: "1997-12-01", nationality: "Argentina", flagUrl: "https://img.sofascore.com/api/v1/country/AR/flag", position: "CF", height: "1.75m", preferredFoot: "Izquierdo", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/442231-1762438527.png?lm=1", marketValue: 3000000 },
  ];

  for (const p of playersData) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dob),
        nationality: p.nationality,
        flagUrl: p.flagUrl,
        position: p.position,
        photoUrl: p.photo,
        height: p.height,
        preferredFoot: p.preferredFoot,
        marketValue: p.marketValue,
        teamId: p.teamId,
      },
      create: {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dob),
        nationality: p.nationality,
        flagUrl: p.flagUrl,
        position: p.position,
        photoUrl: p.photo,
        height: p.height,
        preferredFoot: p.preferredFoot,
        marketValue: p.marketValue,
        teamId: p.teamId,
      },
    });
  }

  // Función para generar Heatmaps
  function heatmapByPosition(position: string): number[][] {
    const grids: Record<string, number[][]> = {
      CF: [
        [10, 25, 95, 25, 10],
        [5, 15, 60, 15, 5],
        [2, 8, 20, 8, 2],
        [0, 2, 5, 2, 0],
        [0, 0, 0, 0, 0],
      ],

      SS: [
        [5, 15, 50, 15, 5],
        [15, 40, 85, 40, 15],
        [10, 25, 60, 25, 10],
        [2, 5, 15, 5, 2],
        [0, 0, 0, 0, 0],
      ],

      LW: [
        [90, 40, 10, 2, 1],
        [75, 30, 5, 0, 0],
        [40, 15, 2, 0, 0],
        [15, 5, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],

      RW: [
        [1, 2, 10, 40, 90],
        [0, 0, 5, 30, 75],
        [0, 0, 2, 15, 40],
        [0, 0, 0, 5, 15],
        [0, 0, 0, 0, 0],
      ],

      CAM: [
        [5, 10, 25, 10, 5],
        [20, 55, 90, 55, 20],
        [15, 45, 75, 45, 15],
        [5, 10, 20, 10, 5],
        [1, 2, 5, 2, 1],
      ],

      CM: [
        [5, 10, 20, 10, 5],
        [10, 30, 55, 30, 10],
        [15, 50, 85, 50, 15],
        [10, 30, 55, 30, 10],
        [5, 10, 20, 10, 5],
      ],

      CDM: [
        [0, 1, 5, 1, 0],
        [5, 10, 25, 10, 5],
        [15, 40, 70, 40, 15],
        [30, 65, 95, 65, 30],
        [20, 45, 80, 45, 20],
      ],

      LB: [
        [40, 10, 2, 0, 0],
        [65, 15, 0, 0, 0],
        [80, 25, 2, 0, 0],
        [95, 35, 5, 0, 0],
        [70, 20, 0, 0, 0],
      ],

      RB: [
        [0, 0, 2, 10, 40],
        [0, 0, 0, 15, 65],
        [0, 0, 2, 25, 80],
        [0, 0, 5, 35, 95],
        [0, 0, 0, 20, 70],
      ],

      CB: [
        [0, 2, 5, 2, 0],
        [1, 5, 15, 5, 1],
        [10, 30, 55, 30, 10],
        [35, 60, 95, 60, 35],
        [25, 50, 85, 50, 25],
      ],

      GK: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [5, 10, 35, 10, 5],
        [15, 40, 98, 40, 15],
      ],
    };

    return grids[position] ?? grids["CM"];
  }

  // ── Stats (Generamos para los 22) ────────────────────────
  const statsData2024 = playersData.map(p => ({
    playerId: p.id,
    seasonId: s2024.id,
    matchesPlayed: 25 + Math.floor(Math.random() * 12),
    minutesPlayed: 2000 + Math.floor(Math.random() * 800),
    goals: ["CF", "RW", "LW"].includes(p.position) ? 8 + Math.floor(Math.random() * 10) : p.position === "CAM" ? 5 : 1,
    assists: ["CAM", "RW", "LW"].includes(p.position) ? 6 + Math.floor(Math.random() * 6) : 2,
    yellowCards: ["CB", "CDM"].includes(p.position) ? 5 + Math.floor(Math.random() * 5) : 2,
    redCards: 0,
    shotsOnTarget: ["CF", "RW", "LW"].includes(p.position) ? 30 + Math.floor(Math.random() * 20) : 5,
    successfulPasses: p.position === "CM" ? 1500 : 800,
    passAccuracy: p.position === "CM" ? 88.5 : 78.0,
    aerialDuelsWon: ["CB", "CF"].includes(p.position) ? 50 : 15,
    aerialDuelsTotal: ["CB", "CF"].includes(p.position) ? 80 : 30,
    defensiveDuelsWon: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 90 : 20,
    defensiveDuelsTotal: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 150 : 40,
    xG: ["CF", "RW", "LW"].includes(p.position) ? 9.5 : 1.2,
    xA: ["CAM", "RW", "LW"].includes(p.position) ? 5.5 : 1.0,
    recoveries: ["CB", "CDM"].includes(p.position) ? 150 : 40,
    heatmapGrid: heatmapByPosition(p.position)
  }));

  // ── Stats 2025 ────────────────────────────────────────────
  const statsData2025 = playersData.map(p => ({
    playerId: p.id,
    seasonId: s2025.id,
    matchesPlayed: 28 + Math.floor(Math.random() * 10),
    minutesPlayed: 2200 + Math.floor(Math.random() * 700),
    goals: ["CF", "RW", "LW"].includes(p.position) ? 10 + Math.floor(Math.random() * 12) : p.position === "CAM" ? 6 : 1,
    assists: ["CAM", "RW", "LW"].includes(p.position) ? 7 + Math.floor(Math.random() * 7) : 2,
    yellowCards: ["CB", "CDM"].includes(p.position) ? 4 + Math.floor(Math.random() * 4) : 2,
    redCards: Math.random() > 0.9 ? 1 : 0,
    shotsOnTarget: ["CF", "RW", "LW"].includes(p.position) ? 35 + Math.floor(Math.random() * 20) : 6,
    successfulPasses: p.position === "CM" ? 1650 : 850,
    passAccuracy: p.position === "CM" ? 89.2 : 79.5,
    aerialDuelsWon: ["CB", "CF"].includes(p.position) ? 55 : 18,
    aerialDuelsTotal: ["CB", "CF"].includes(p.position) ? 85 : 32,
    defensiveDuelsWon: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 95 : 22,
    defensiveDuelsTotal: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 155 : 42,
    xG: ["CF", "RW", "LW"].includes(p.position) ? 10.8 : 1.4,
    xA: ["CAM", "RW", "LW"].includes(p.position) ? 6.2 : 1.1,
    recoveries: ["CB", "CDM"].includes(p.position) ? 165 : 45,
    heatmapGrid: heatmapByPosition(p.position),
  }));

  // ── Stats 2026 (temporada en curso, menos partidos) ────────
  const statsData2026 = playersData.map(p => ({
    playerId: p.id,
    seasonId: s2026.id,
    matchesPlayed: 8 + Math.floor(Math.random() * 5),
    minutesPlayed: 600 + Math.floor(Math.random() * 300),
    goals: ["CF", "RW", "LW"].includes(p.position) ? 3 + Math.floor(Math.random() * 4) : p.position === "CAM" ? 2 : 0,
    assists: ["CAM", "RW", "LW"].includes(p.position) ? 2 + Math.floor(Math.random() * 3) : 1,
    yellowCards: Math.floor(Math.random() * 3),
    redCards: 0,
    shotsOnTarget: ["CF", "RW", "LW"].includes(p.position) ? 10 + Math.floor(Math.random() * 8) : 2,
    successfulPasses: p.position === "CM" ? 420 : 210,
    passAccuracy: p.position === "CM" ? 88.8 : 78.5,
    aerialDuelsWon: ["CB", "CF"].includes(p.position) ? 14 : 4,
    aerialDuelsTotal: ["CB", "CF"].includes(p.position) ? 22 : 8,
    defensiveDuelsWon: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 24 : 6,
    defensiveDuelsTotal: ["CB", "CDM", "LB", "RB"].includes(p.position) ? 38 : 10,
    xG: ["CF", "RW", "LW"].includes(p.position) ? 2.8 : 0.4,
    xA: ["CAM", "RW", "LW"].includes(p.position) ? 1.6 : 0.3,
    recoveries: ["CB", "CDM"].includes(p.position) ? 42 : 11,
    heatmapGrid: heatmapByPosition(p.position),
  }));

  for (const s of [...statsData2024, ...statsData2025, ...statsData2026]) {
    await prisma.playerStats.upsert({
      where: { playerId_seasonId: { playerId: s.playerId, seasonId: s.seasonId } },
      update: s,
      create: s,
    });
  }

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());