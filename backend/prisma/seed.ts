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
    { id: 1, firstName: "Leandro", lastName: "Brey", dob: "2002-09-21", nationality: "Argentina", position: "GK", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/982633-1739888426.jpg?lm=1" },
    { id: 2, firstName: "Marcelo", lastName: "Weigandt", dob: "2000-01-11", nationality: "Argentina", position: "RB", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/491690-1740775551.jpg?lm=1" },
    { id: 3, firstName: "Lautaro", lastName: "Di Lollo", dob: "2004-03-10", nationality: "Argentina", position: "CB", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/1019744-1739889666.jpg?lm=1" },
    { id: 4, firstName: "Ayrton", lastName: "Costa", dob: "1999-07-12", nationality: "Argentina", position: "CB", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/842910-1739889633.jpg?lm=1" },
    { id: 5, firstName: "Lautaro", lastName: "Blanco", dob: "1999-02-19", nationality: "Argentina", position: "LB", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/831161-1739896785.jpg?lm=1" },
    { id: 6, firstName: "Santiago", lastName: "Ascacíbar", dob: "1997-02-25", nationality: "Argentina", position: "CDM", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/423436-1739827128.jpg?lm=1" },
    { id: 7, firstName: "Ander", lastName: "Herrera", dob: "1989-08-14", nationality: "España", position: "CM", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/99343-1709675915.png?lm=1" },
    { id: 8, firstName: "Milton", lastName: "Delgado", dob: "2005-06-16", nationality: "Argentina", position: "CM", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/1236677-1739899248.jpg?lm=1" },
    { id: 9, firstName: "Tomás", lastName: "Belmonte", dob: "1998-05-27", nationality: "Argentina", position: "CAM", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/483446-1739897240.jpg?lm=1" },
    { id: 10, firstName: "Milton", lastName: "Giménez", dob: "1996-08-12", nationality: "Argentina", position: "CF", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/730779-1739899590.jpg?lm=1" },
    { id: 11, firstName: "Exequiel", lastName: "Zeballos", dob: "2002-04-24", nationality: "Argentina", position: "LW", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/661132-1739899419.jpg?lm=1" },

    // --- RIVER PLATE (IDs 12-22) ---
    { id: 12, firstName: "Santiago", lastName: "Beltrán", dob: "2004-10-21", nationality: "Argentina", position: "GK", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1138089-1762437740.png?lm=1" },
    { id: 13, firstName: "Gonzalo", lastName: "Montiel", dob: "1997-01-01", nationality: "Argentina", position: "RB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/402733-1762437910.png?lm=1" },
    { id: 14, firstName: "Lucas", lastName: "Martínez Quarta", dob: "1996-05-10", nationality: "Argentina", position: "CB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/373373-1762437997.png?lm=1" },
    { id: 15, firstName: "Lautaro", lastName: "Rivero", dob: "2003-11-01", nationality: "Argentina", position: "CB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1261395-1762437856.png?lm=1" },
    { id: 16, firstName: "Marcos", lastName: "Acuña", dob: "1991-10-28", nationality: "Argentina", position: "LB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/60410-1762438025.png?lm=1" },
    { id: 17, firstName: "Aníbal", lastName: "Moreno", dob: "1999-05-13", nationality: "Argentina", position: "CDM", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/642758-1746577695.jpg?lm=1" },
    { id: 18, firstName: "Giuliano", lastName: "Galoppo", dob: "1999-06-18", nationality: "Argentina", position: "CM", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/567249-1762438415.png?lm=1" },
    { id: 19, firstName: "Tomás", lastName: "Galván", dob: "2000-04-11", nationality: "Argentina", position: "CAM", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/893850-1727449987.jpg?lm=1" },
    { id: 20, firstName: "Joaquín", lastName: "Freitas", dob: "2005-02-14", nationality: "Argentina", position: "RW", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/1324003-1771857419.jpg?lm=1" },
    { id: 21, firstName: "Facundo", lastName: "Colidio", dob: "2000-01-04", nationality: "Argentina", position: "LW", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/491705-1693315193.png?lm=1" },
    { id: 22, firstName: "Maximiliano", lastName: "Salas", dob: "1997-12-01", nationality: "Argentina", position: "CF", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/442231-1762438527.png?lm=1" },
  ];

  for (const p of playersData) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: {
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dob),
        nationality: p.nationality,
        position: p.position,
        photoUrl: p.photo,
        teamId: p.teamId,
      },
      create: {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dob),
        nationality: p.nationality,
        position: p.position,
        photoUrl: p.photo,
        teamId: p.teamId,
      },
    });
  }

  // ── Stats (Generamos para los 22) ────────────────────────
  const statsData = playersData.map(p => ({
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
    recoveries: ["CB", "CDM"].includes(p.position) ? 150 : 40
  }));

  for (const s of statsData) {
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