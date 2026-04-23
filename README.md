# Scout Panel — LDP

> Aplicación fullstack de scouting
> Stack: React · Node.js · PostgreSQL · Docker · Zustand · React Query · Prisma

---

## Tabla de contenidos

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Cumplimiento de requisitos](#2-cumplimiento-de-requisitos)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Modelado de datos](#4-modelado-de-datos)
5. [Decisiones técnicas](#5-decisiones-técnicas)
6. [Diseño de la API](#6-diseño-de-la-api)
7. [Cómo ejecutar el proyecto](#7-cómo-ejecutar-el-proyecto)
8. [Tests](#8-tests)
9. [Features bonus implementadas](#9-features-bonus-implementadas)

---

## 1. Descripción del proyecto

Scout Panel es una aplicación web fullstack pensada para que scouts de fútbol puedan buscar, analizar y comparar jugadores utilizando datos estadísticos y gráficos interactivos.

La app permite:
- Buscar y filtrar jugadores por nombre, posición, nacionalidad y rango de edad
- Ver el perfil detallado de cada jugador con estadísticas, percentiles y mapa de calor
- Comparar 2 o 3 jugadores simultáneamente con radar chart, tabla de estadísticas, bar chart por temporada y heatmaps de posición
- Filtrar las comparaciones por temporada (2024, 2025, 2026)
- Obtener un análisis generado por IA que resume la comparación entre los jugadores seleccionados
- Guardar jugadores en una shortlist personal persistida por usuario

La identidad visual sigue el sistema de diseño de LDP: fondo oscuro (`#0F0F0F`), verde primario (`#00E094`) y tipografía Nunito Sans.

---

## 2. Cumplimiento de requisitos

| Requisito | Estado | Detalle |
|---|---|---|
| Listado de jugadores con búsqueda y filtros | ✅ | Nombre, posición, nacionalidad, rango de edad. Búsqueda con debounce, resultados paginados |
| Comparador con gráficos | ✅ | Radar chart, tabla con highlights, bar chart por temporada, heatmaps |
| Modelado de base de datos | ✅ | 6 entidades con relaciones e índices bien definidos |
| Seed de datos realistas | ✅ | 22 jugadores reales (Boca Juniors y River Plate), 3 temporadas, stats por posición |
| Unit tests — backend | ✅ | 19 tests con Jest + supertest cubriendo servicios y endpoints |
| Unit tests — frontend | ✅ | Vitest + Testing Library cubriendo PlayerCard, PlayerFilters y useCompareStore |
| Docker — DB con docker-compose | ✅ | `docker-compose up -d` levanta postgres:16 con healthcheck |
| README con instrucciones y decisiones | ✅ | Este documento |
| Shortlist persistida (bonus) | ✅ | Persistida por usuario autenticado |
| Auth con JWT (bonus) | ✅ | Registro, login, bcrypt, rutas protegidas |
| Responsive / mobile (bonus) | ✅ | Filtros colapsables, grilla adaptable |
| Análisis de IA en el comparador (extra) | ✅ | Resumen generado por Claude con contexto de las estadísticas de cada jugador |

---

## 3. Arquitectura del sistema

```
scout-panel/
├── frontend/          # React + TypeScript (Vite)
│   └── src/
│       ├── components/   # UI, players, layout
│       ├── pages/        # PlayersPage, ComparePage, PlayerProfilePage
│       ├── hooks/        # Hooks de React Query
│       ├── store/        # Stores de Zustand
│       ├── config/       # Configuración centralizada de métricas
│       ├── types/        # Interfaces TypeScript compartidas
│       └── __tests__/    # Suite de tests con Vitest
│
├── backend/           # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/       # Routers de Express
│       ├── controllers/  # Capa HTTP — sin lógica de negocio
│       ├── services/     # Lógica de negocio + queries a la DB
│       ├── middleware/   # Error handler, auth JWT, validación Zod
│       ├── schemas/      # Esquemas de validación Zod
│       ├── db/           # Cliente Prisma (pg adapter para Prisma v7)
│       └── __tests__/    # Suite de tests con Jest
│
├── prisma/
│   ├── schema.prisma     # Modelo de datos
│   ├── seed.ts           # Datos de seed realistas
│   └── migrations/       # Migraciones autogeneradas
│
└── docker-compose.yml    # Servicio PostgreSQL 16
```

**Flujo de una request:**

```
Navegador → React Query → Axios → Express Router
         → Controller (solo HTTP)
         → Service (lógica de negocio + Prisma)
         → PostgreSQL
```

La capa de controladores solo maneja concerns HTTP (parsear parámetros, enviar respuestas). Toda la lógica de negocio, queries y lanzamiento de errores vive en la capa de servicios. Esta separación hace que los tests unitarios sean directos: se puede testear el servicio con Prisma mockeado sin levantar Express.

---

## 4. Modelado de datos

### Relaciones entre entidades

| Relación | Cardinalidad | Descripción |
|----------|-------------|-------------|
| Team → Player | 1 : * | Un equipo tiene muchos jugadores. Jugador puede no tener equipo |
| Player → PlayerStats | 1 : * | Un jugador acumula estadísticas en múltiples temporadas |
| Season → PlayerStats | 1 : * | Una temporada contiene estadísticas de muchos jugadores |
| User → ShortlistPlayer | 1 : * | Un usuario puede shortlistear múltiples jugadores |
| Player → ShortlistPlayer | * : 1 | Un jugador puede aparecer en múltiples shortlists |

### Entidades y decisiones de diseño

**`Player`**  
Entidad central. Almacena datos biográficos. Se guarda `dateOfBirth` en lugar de `age` — la edad es derivada y cambia con el tiempo, la fecha de nacimiento es inmutable. Tiene `teamId` opcional para permitir jugadores sin club actual. Indexado en `nationality`, `position` y `teamId` para soportar las queries de filtros eficientemente.

**`Team`**  
Separado de Player para evitar duplicación de datos. Un cambio de equipo solo requiere actualizar `player.teamId`, no copiar datos del equipo.

**`Season`**  
Normalizada como entidad propia. Las stats están vinculadas a una temporada, no embebidas en el jugador. Esto permite comparación histórica entre temporadas, filtrado por temporada en el comparador, y agregar temporadas futuras sin cambios de esquema.

**`PlayerStats`**  
La entidad más rica. Vinculada a `Player` y `Season` con una restricción `@@unique([playerId, seasonId])` — un registro de stats por jugador por temporada. Incluye todos los campos requeridos más métricas extendidas: `xG`, `xA`, `aerialDuelsWon`, `recoveries`, `passAccuracy`, `heatmapGrid` (JSON con matriz 5×5).

**`User` + `ShortlistPlayer`**  
Entidad de autenticación con password hasheado. La shortlist es una tabla intermedia con `@@unique([userId, playerId])` para evitar duplicados.

### Índices y por qué

```prisma
@@index([nationality])   // filtro por nacionalidad
@@index([position])      // filtro por posición
@@index([teamId])        // join con equipo
@@index([playerId])      // búsqueda de stats por jugador
```

---

## 5. Decisiones técnicas

### Prisma v7 con pg adapter

Prisma v7 eliminó el motor de conexión integrado, requiriendo un adaptador explícito. Se usó `@prisma/adapter-pg` con una conexión `pg.Pool`:

```typescript
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

Centralizado en `src/db/prisma.ts` e importado desde todos lados — sin inicialización repetida, sin múltiples conexiones al pool.

**Por qué Prisma sobre SQL crudo o Knex:** Queries con type-safety, tipos TypeScript autogenerados desde el schema, y migraciones legibles. Para un producto donde el schema evoluciona, el sistema de migraciones de Prisma es mucho más seguro que SQL escrito a mano.

### Zustand para estado global

Usado para el store del comparador y el estado de auth. Zustand sobre Redux porque no tiene boilerplate, la mutación de estado es directa con `set()`, los selectores son funciones simples y el bundle size es mínimo.

### React Query para estado del servidor

Separa el estado del servidor (datos fetcheados) del estado del cliente (estado de UI). Beneficios usados: invalidación automática de caché al cambiar el `queryKey`, estados de loading/error integrados, `staleTime: 5min` para evitar requests redundantes, y `refetch()` expuesto para los botones de reintentar.

### Zod para validación

Validación de input en el boundary de la API. Todos los query params son parseados y tipados antes de llegar al controller:

```typescript
export const playersQuerySchema = z.object({
  name: z.string().optional(),
  ageMin: z.coerce.number().min(15).max(50).optional(),
  page: z.coerce.number().min(1).default(1),
});
```

`z.coerce.number()` convierte automáticamente los query strings a números — sin `parseInt` disperso por el código.

### Configuración centralizada de métricas

Todas las definiciones de estadísticas viven en `src/config/metrics.ts`. El radar chart, la tabla comparativa, los círculos del perfil y la tabla de stats importan desde esta única fuente. Agregar o renombrar una métrica requiere un solo cambio.

### Cálculo de percentiles en el backend

Los percentiles se calculan server-side comparando al jugador contra todos los jugadores de su posición:

```typescript
function calcPercentile(key, higherIsBetter = true) {
  const values = peers.map(p => Number(p[key]) ?? 0);
  const playerValue = Number(latestStats[key]) ?? 0;
  const below = values.filter(v =>
    higherIsBetter ? v <= playerValue : v >= playerValue
  ).length;
  return Math.round((below / values.length) * 100);
}
```

Esto da contexto relativo significativo (percentil 82 en goles entre delanteros) en lugar de números crudos.

### Análisis de IA en el comparador

Se integró la API de Anthropic para generar un resumen en lenguaje natural de la comparación. El prompt recibe las estadísticas de ambos jugadores y solicita un informe de scouting estructurado con fortalezas, casos de uso tácticos y un veredicto final.

---

## 6. Diseño de la API

### URL base
```
http://localhost:3001/api
```

### Formato de respuesta

Todos los endpoints devuelven un envelope consistente:
```json
{
  "data": "<payload>",
  "error": null,
  "meta": { "total": 22, "page": 1, "limit": 12, "totalPages": 2 }
}
```

En caso de error:
```json
{
  "data": null,
  "error": "Jugador no encontrado"
}
```

### Endpoints

```
GET    /players                          Listado con filtros y paginación
GET    /players/compare?ids=1,2,3        Comparar 2-3 jugadores (opcional ?seasonId)
GET    /players/positions                Posiciones únicas para dropdown de filtros
GET    /players/nationalities            Nacionalidades únicas para dropdown de filtros
GET    /players/:id                      Perfil del jugador
GET    /players/:id/stats                Stats + percentiles por posición

GET    /seasons                          Todas las temporadas

POST   /auth/register                    Registro de usuario
POST   /auth/login                       Login, devuelve JWT

GET    /shortlist                        Ver shortlist del usuario (requiere JWT)
POST   /shortlist/:playerId              Agregar a shortlist (requiere JWT)
DELETE /shortlist/:playerId              Quitar de shortlist (requiere JWT)

POST   /compare/scout-report             Genera reporte técnico con IA 
```

### Orden de rutas

En `players.routes.ts` las rutas específicas se declaran antes que las parametrizadas para evitar que Express interprete "compare" o "positions" como un ID:

```typescript
router.get("/compare", ...)
router.get("/positions", ...)
router.get("/nationalities", ...)
router.get("/:id/stats", ...)
router.get("/:id", ...)       
```

### Manejo de errores

El sistema fue diseñado asumiendo que los fallos (de red, de base de datos o de APIs de terceros) son inevitables. Por lo tanto, se implementó una estrategia de mitigación en ambas capas para garantizar que la aplicación nunca se "rompa" silenciosamente ni deje al usuario bloqueado.

### Capa Backend (Node.js + Express)
* **Middleware Global de Errores (`errorHandler`):** Todas las excepciones, tanto síncronas como asíncronas (capturadas vía bloques `try/catch` en los controladores), derivan a un único middleware centralizado. Esto evita fugas de memoria y respuestas colgadas.
* **Respuestas Estandarizadas:** El frontend siempre sabe qué estructura esperar, incluso cuando algo falla. No hay errores HTML por defecto de Express ni *stack traces* expuestos al cliente (protección de seguridad).
  ```json
  // Estructura de error estandarizada
  {
    "success": false,
    "error": "El jugador solicitado no existe o fue eliminado.",
    "statusCode": 404
  }

---

## 7. Cómo ejecutar el proyecto

El proyecto está completamente contenerizado para garantizar que se ejecute de manera idéntica en cualquier entorno y para facilitar su evaluación sin necesidad de instalar dependencias locales (Zero-Config).

### Requisitos Previos

* [Docker](https://www.docker.com/) y Docker Compose instalados.
* Una clave de API gratuita de [Google AI Studio](https://aistudio.google.com/) (Necesaria para habilitar el motor de comparación IA).

### Pasos para levantar la aplicación

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/NahuelDiaz11/scout-panel-ldp-nahuel-diaz/
cd scout-panel
```

### 2. Configurar el Backend (Node.js + Prisma)

Accedé a la carpeta del servidor y configurá tus credenciales:

```bash
cd backend
cp .env.example .env
```

Editá el archivo `backend/.env` y completá las siguientes variables:

- **PORT**: Puerto de ejecución (por defecto 3001).
- **DATABASE_URL**: Tu cadena de conexión a PostgreSQL (Docker o local).
- **GEMINI_API_KEY**: Tu clave de API generada en Google AI Studio.
- **JWT_SECRET**: Una clave segura para la firma de tokens.

### Configurar el Frontend (React + Vite)

Es necesario indicarle al cliente dónde se encuentra la API:

```bash
cd ../frontend
cp .env.example .env # En caso de que tengas el archivo example, sino crealo
```

Asegurate de que el archivo `frontend/.env` contenga la URL del backend local:

```env
VITE_API_URL=http://localhost:3001/api
```

**3. Orquestar los contenedores:**

Este comando construirá las imágenes, levantará la base de datos PostgreSQL, ejecutará las migraciones/seeders automáticamente y desplegará tanto el frontend como el backend en una red aislada.

```bash
docker compose up --build
```

> **Tip:** Podés agregar la bandera `-d` al final si preferís que corra en segundo plano.

### Accesos

Una vez que la consola indique que los servicios están listos, podés acceder a:

| Servicio | URL |
|---|---|
| Frontend (App) | http://localhost:5173 |
| Backend (Health Check) | http://localhost:3001/api/health |

---

## 8. Estrategia de Testing

El enfoque de pruebas abarca diferentes niveles de la pirámide de testing (Unitarias, Integración y E2E) para garantizar la robustez del código, la integridad de la API y una experiencia de usuario sin fallos.

### Frontend (Vitest / React Testing Library & Cypress)
* **Unit & Component Testing:** Pruebas aisladas sobre componentes clave de la interfaz para garantizar su comportamiento predictivo:
  * `PlayerCard.test`: Valida el correcto renderizado de las propiedades del jugador (datos, imágenes) y verifica que las interacciones del usuario (clics en "Comparar" o "Guardar") disparen las acciones de estado correspondientes.
  * `PlayerFilters.test`: Asegura que los cambios en los inputs (nombre, posición) actualicen correctamente el estado interno y emitan los eventos de búsqueda sin demoras o comportamientos inesperados.
* **Cypress (E2E Testing):** Simulación del comportamiento real del usuario en el navegador, cubriendo flujos críticos transversales como la navegación completa, el filtrado en vivo y la validación lógica del límite máximo de jugadores en el comparador.

### Backend (Jest + Supertest)
* **Unit Testing (`players.service.test`):** Aislamiento de la capa de servicios para probar la lógica de negocio pura. Se valida que las funciones de obtención de datos interactúen correctamente con el ORM, aplicando los filtros, el cálculo de paginación (`offset`/`limit`) y el ordenamiento sin necesidad de levantar el servidor HTTP.
* **Integration Testing (`players.routes.test`):** Pruebas sobre la capa de controladores y el enrutador para validar el "contrato" de la API. Se verifica que los endpoints manejen adecuadamente los *query parameters*, respondan con la estructura JSON esperada y devuelvan los códigos de estado HTTP correctos (ej. `200 OK` para éxito, `400 Bad Request` ante parámetros inválidos).

### Ejecución de Pruebas

```bash
# Frontend: Correr tests de componentes (Unitarios)
cd frontend
npm run test

# Frontend: Correr tests E2E interactivos (Cypress)
cd frontend
npm run cypress:open 

# Backend: Correr tests de rutas y servicios
cd backend
npm run test
```

---

## 9. Features Bonus Implementadas

El proyecto no solo cumple con los requisitos base, sino que aborda el 100% de los bonus propuestos en el challenge, sumando además herramientas de análisis avanzadas.

### Auth Básica (JWT)
Implementación de un flujo de autenticación seguro:
* Endpoints `POST /auth/register` y `POST /auth/login`.
* Hasheo de contraseñas mediante `bcrypt` para no almacenar texto plano en la base de datos.
* Generación de **JSON Web Tokens (JWT)** devueltos al cliente y enviados mediante el header `Authorization: Bearer <token>`.
* Middleware de protección en el backend que valida el token y adjunta la sesión del usuario al objeto `req`.

### Shortlist Persistida
Los usuarios autenticados pueden guardar sus jugadores favoritos mediante un *bookmark* en las tarjetas de jugador. Esta lista se persiste en la base de datos (tabla `shortlist_players`), manteniendo la relación referencial con el usuario logueado, lo que permite retomar el scouting en diferentes sesiones.

### Veredicto Scout con IA (Extra)
Integración con **Google Gemini (GenAI)** en la página del comparador. Tras seleccionar los jugadores, el backend procesa las estadísticas y construye un prompt estructurado para la IA. La API devuelve un análisis táctico asíncrono, destacando fortalezas y recomendando el contexto ideal para fichar a cada jugador.

### Data Visualization Avanzada (Extra)
* **Heatmaps Posicionales:** Renderizado de un grid de actividad almacenado como JSON (`heatmapGrid`). Se dibuja sobre un canvas de campo de fútbol utilizando gradientes de temperatura, reflejando patrones de movimiento realistas según la posición del jugador.
* **Cálculo de Percentiles en Backend:** El endpoint de estadísticas computa rankings en tiempo real, comparando al jugador contra el universo de su misma posición. Estos se exponen en la UI mediante gráficos circulares radiales.
* **Filtros Temporales:** Aplicación de filtros por `seasonId` que recalculan de forma dinámica los gráficos de radar, barras y mapas de calor.

### Performance & Escalabilidad
Implementación de **Paginación Server-Side (Offset/Limit)** en los listados y creación de **Índices (B-Tree)** en la base de datos para las columnas de búsqueda crítica (nombre, posición), asegurando tiempos de respuesta mínimos incluso con grandes volúmenes de datos.

### UX & Manejo de Errores
* **Error Boundaries & Fallbacks:** Uso de componentes `<ErrorState />` que evitan el *crash* de la aplicación ante fallos de red o de servidor (500/404), ofreciendo botones de recuperación (`refetch`).
* **Loading States:** Integración de *Skeletons* y transiciones suaves durante el fetching de datos (mediante React Query) para evitar el parpadeo de la UI (Layout Shifts).

### Diseño Responsive (Mobile First)
Layout fluido apoyado en CSS Grid y Flexbox. La grilla de jugadores se adapta dinámicamente al *viewport*, los filtros laterales colapsan detrás de un *toggle* en dispositivos móviles, y las vistas complejas (como el comparador) apilan sus elementos verticalmente en pantallas estrechas sin perder legibilidad.

## Deploy & Live Demo

La aplicación se encuentra desplegada utilizando una arquitectura de microservicios para garantizar escalabilidad y persistencia:

- **Frontend:** Desplegado en [Vercel](https://vercel.com/) (Vite + React).
- **Backend:** API REST desplegada en [Render](https://render.com/) (Node.js + Express).
- **Base de Datos:** PostgreSQL administrado en [Neon.tech](https://neon.tech/) (Serverless).

 **URL del Proyecto:** [https://scout-panel-ldp-nahuel-diaz-nine.vercel.app/](https://scout-panel-ldp-nahuel-diaz-nine.vercel.app/)

### Credenciales de Acceso

Podés registrar tu propio usuario para probar la persistencia, o utilizar la siguiente cuenta de prueba:

| Usuario | Contraseña |
|---------|------------|
| scout@test.com | 123456 |

---

## Resumen del stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework frontend | React | 18 |
| Build frontend | Vite | 5 |
| Lenguaje | TypeScript | 5 |
| Estado global | Zustand | 4 |
| Estado del servidor | React Query (@tanstack) | 5 |
| Cliente HTTP | Axios | 1 |
| Gráficos | Recharts | 2 |
| Framework backend | Express | 5 |
| ORM | Prisma | 7 |
| Driver DB | pg + @prisma/adapter-pg | — |
| Validación | Zod | 3 |
| Auth | bcryptjs + jsonwebtoken | — |
| Base de datos | PostgreSQL | 16 |
| Contenedor | Docker + Docker Compose | — |
| Tests backend | Jest + supertest | — |
| Tests frontend | Vitest + Testing Library | — |
| Análisis IA | Anthropic Claude API | — |

---
