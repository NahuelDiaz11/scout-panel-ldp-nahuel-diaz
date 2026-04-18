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
    prisma.team.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "CA Boca Juniors", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Boca_jrs_badge.svg/200px-Boca_jrs_badge.svg.png" } }),
    prisma.team.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "CA River Plate", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/River_plate_logo.svg/200px-River_plate_logo.svg.png" } }),
    prisma.team.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: "Racing Club", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Racing_Club_logo.svg/200px-Racing_Club_logo.svg.png" } }),
    prisma.team.upsert({ where: { id: 4 }, update: {}, create: { id: 4, name: "CA Independiente", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/200px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png" } }),
    prisma.team.upsert({ where: { id: 5 }, update: {}, create: { id: 5, name: "San Lorenzo", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/San_lorenzo_logo.svg/200px-San_lorenzo_logo.svg.png" } }),
    prisma.team.upsert({ where: { id: 6 }, update: {}, create: { id: 6, name: "Talleres de Córdoba", country: "Argentina", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Escudo_del_Club_Atl%C3%A9tico_Talleres.svg/200px-Escudo_del_Club_Atl%C3%A9tico_Talleres.svg.png" } }),
  ]);

  // ── Seasons ────────────────────────────────────────────
  const [s2024, s2025, s2026] = await Promise.all([
    prisma.season.upsert({ where: { name: "2024" }, update: {}, create: { name: "2024" } }),
    prisma.season.upsert({ where: { name: "2025" }, update: {}, create: { name: "2025" } }),
    prisma.season.upsert({ where: { name: "2026" }, update: {}, create: { name: "2026" } }),
  ]);

  // ── Players ────────────────────────────────────────────
  const playersData = [
    { firstName: "Miguel Ángel", lastName: "Merentiel Serrano", dob: "1994-06-14", nationality: "Uruguay", position: "SS", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/448981-1697022829.jpg" },
    { firstName: "Facundo", lastName: "Colidio", dob: "2000-01-05", nationality: "Argentina", position: "CF", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/387791-1694421557.jpg" },
    { firstName: "Edinson", lastName: "Cavani", dob: "1987-02-14", nationality: "Uruguay", position: "CF", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/60523-1674048781.jpg" },
    { firstName: "Lucas", lastName: "Alario", dob: "1992-08-08", nationality: "Argentina", position: "CF", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/232432-1686644141.jpg" },
    { firstName: "Rodrigo", lastName: "De Paul", dob: "1994-05-24", nationality: "Argentina", position: "CM", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/225325-1695286803.jpg" },
    { firstName: "Valentín", lastName: "Castellanos", dob: "1998-10-17", nationality: "Argentina", position: "CF", teamId: 4, photo: "https://img.a.transfermarkt.technology/portrait/header/348047-1661944078.jpg" },
    { firstName: "Óscar", lastName: "Romero", dob: "1992-07-04", nationality: "Paraguay", position: "CAM", teamId: 3, photo: "https://img.a.transfermarkt.technology/portrait/header/183568-1631012345.jpg" },
    { firstName: "Germán", lastName: "Cano", dob: "1988-07-03", nationality: "Brasil", position: "CF", teamId: 5, photo: "https://img.a.transfermarkt.technology/portrait/header/57200-1655290123.jpg" },
    { firstName: "Ezequiel", lastName: "Barco", dob: "1999-01-29", nationality: "Argentina", position: "CAM", teamId: 5, photo: "https://img.a.transfermarkt.technology/portrait/header/404598-1632091234.jpg" },
    { firstName: "Cristian", lastName: "Pavón", dob: "1996-01-21", nationality: "Argentina", position: "RW", teamId: 6, photo: "https://img.a.transfermarkt.technology/portrait/header/319795-1660123456.jpg" },
    { firstName: "Carlos", lastName: "Alcaraz", dob: "2002-05-06", nationality: "Argentina", position: "CM", teamId: 3, photo: "https://img.a.transfermarkt.technology/portrait/header/635105-1695123456.jpg" },
    { firstName: "Nicolás", lastName: "Tagliafico", dob: "1992-08-31", nationality: "Argentina", position: "LB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/246847-1695678901.jpg" },
    { firstName: "Marcos", lastName: "Rojo", dob: "1990-03-20", nationality: "Argentina", position: "CB", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/165786-1660234567.jpg" },
    { firstName: "Paulo", lastName: "Díaz", dob: "1997-01-02", nationality: "Chile", position: "CB", teamId: 2, photo: "https://img.a.transfermarkt.technology/portrait/header/363817-1689234567.jpg" },
    { firstName: "Sergio", lastName: "Romero", dob: "1987-03-22", nationality: "Argentina", position: "GK", teamId: 1, photo: "https://img.a.transfermarkt.technology/portrait/header/58728-1660345678.jpg" },
  ];

  const players = [];
  for (const p of playersData) {
    const player = await prisma.player.upsert({
      where: { id: playersData.indexOf(p) + 1 },
      update: {},
      create: {
        id: playersData.indexOf(p) + 1,
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: new Date(p.dob),
        nationality: p.nationality,
        position: p.position,
        photoUrl: p.photo,
        teamId: p.teamId,
      },
    });
    players.push(player);
  }

  // ── Stats ── (generamos stats realistas por jugador/temporada)
  const statsData = [
    // Merentiel (id=1) - delantero goleador
    { playerId: 1, seasonId: s2024.id, matchesPlayed: 38, minutesPlayed: 2800, goals: 18, assists: 7, yellowCards: 4, redCards: 0, shotsOnTarget: 52, successfulPasses: 620, passAccuracy: 74.5, aerialDuelsWon: 45, aerialDuelsTotal: 110, defensiveDuelsWon: 22, defensiveDuelsTotal: 48, xG: 15.2, xA: 5.8, recoveries: 38 },
    { playerId: 1, seasonId: s2025.id, matchesPlayed: 42, minutesPlayed: 3100, goals: 22, assists: 9, yellowCards: 5, redCards: 1, shotsOnTarget: 61, successfulPasses: 710, passAccuracy: 76.3, aerialDuelsWon: 51, aerialDuelsTotal: 120, defensiveDuelsWon: 25, defensiveDuelsTotal: 52, xG: 18.4, xA: 7.2, recoveries: 42 },
    { playerId: 1, seasonId: s2026.id, matchesPlayed: 10, minutesPlayed: 754, goals: 4, assists: 2, yellowCards: 1, redCards: 0, shotsOnTarget: 14, successfulPasses: 84, passAccuracy: 76.4, aerialDuelsWon: 22, aerialDuelsTotal: 73, defensiveDuelsWon: 19, defensiveDuelsTotal: 32, xG: 3.0, xA: 1.6, recoveries: 15 },
    // Colidio (id=2) - delantero joven
    { playerId: 2, seasonId: s2024.id, matchesPlayed: 30, minutesPlayed: 2100, goals: 9, assists: 5, yellowCards: 3, redCards: 0, shotsOnTarget: 38, successfulPasses: 780, passAccuracy: 71.2, aerialDuelsWon: 18, aerialDuelsTotal: 62, defensiveDuelsWon: 35, defensiveDuelsTotal: 90, xG: 8.1, xA: 4.2, recoveries: 68 },
    { playerId: 2, seasonId: s2025.id, matchesPlayed: 36, minutesPlayed: 2600, goals: 14, assists: 8, yellowCards: 4, redCards: 0, shotsOnTarget: 49, successfulPasses: 890, passAccuracy: 73.1, aerialDuelsWon: 22, aerialDuelsTotal: 70, defensiveDuelsWon: 42, defensiveDuelsTotal: 105, xG: 11.3, xA: 6.1, recoveries: 85 },
    { playerId: 2, seasonId: s2026.id, matchesPlayed: 9, minutesPlayed: 534, goals: 2, assists: 1, yellowCards: 1, redCards: 0, shotsOnTarget: 12, successfulPasses: 96, passAccuracy: 73.3, aerialDuelsWon: 25, aerialDuelsTotal: 86, defensiveDuelsWon: 46, defensiveDuelsTotal: 97, xG: 1.8, xA: 0.8, recoveries: 91 },
    // Cavani (id=3)
    { playerId: 3, seasonId: s2024.id, matchesPlayed: 28, minutesPlayed: 1800, goals: 12, assists: 3, yellowCards: 2, redCards: 0, shotsOnTarget: 40, successfulPasses: 480, passAccuracy: 68.0, aerialDuelsWon: 60, aerialDuelsTotal: 130, defensiveDuelsWon: 15, defensiveDuelsTotal: 35, xG: 10.5, xA: 2.5, recoveries: 20 },
    { playerId: 3, seasonId: s2025.id, matchesPlayed: 22, minutesPlayed: 1400, goals: 8, assists: 2, yellowCards: 1, redCards: 0, shotsOnTarget: 28, successfulPasses: 360, passAccuracy: 66.5, aerialDuelsWon: 48, aerialDuelsTotal: 105, defensiveDuelsWon: 10, defensiveDuelsTotal: 28, xG: 7.2, xA: 1.8, recoveries: 14 },
    // De Paul (id=5)
    { playerId: 5, seasonId: s2024.id, matchesPlayed: 40, minutesPlayed: 3400, goals: 6, assists: 14, yellowCards: 8, redCards: 0, shotsOnTarget: 30, successfulPasses: 1850, passAccuracy: 88.2, aerialDuelsWon: 28, aerialDuelsTotal: 72, defensiveDuelsWon: 95, defensiveDuelsTotal: 180, xG: 4.8, xA: 11.2, recoveries: 180 },
    { playerId: 5, seasonId: s2025.id, matchesPlayed: 38, minutesPlayed: 3200, goals: 5, assists: 12, yellowCards: 7, redCards: 1, shotsOnTarget: 25, successfulPasses: 1720, passAccuracy: 87.5, aerialDuelsWon: 24, aerialDuelsTotal: 65, defensiveDuelsWon: 88, defensiveDuelsTotal: 170, xG: 4.1, xA: 10.5, recoveries: 165 },
  ];

  for (const s of statsData) {
    await prisma.playerStats.upsert({
      where: { playerId_seasonId: { playerId: s.playerId, seasonId: s.seasonId } },
      update: s,
      create: s,
    });
  }

  console.log(" Seed completado");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());