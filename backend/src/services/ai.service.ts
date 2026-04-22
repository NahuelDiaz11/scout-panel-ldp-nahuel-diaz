export const generateScoutReport = async (players: any[]) => {
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const playersInfo = players.map((p, index) => `
            Jugador ${index + 1}: ${p.firstName} ${p.lastName}
            Posición: ${p.position}
            Goles (última temporada): ${p.stats[0]?.goals || 0}
            Asistencias (última temporada): ${p.stats[0]?.assists || 0}
            Minutos Jugados: ${p.stats[0]?.minutesPlayed || 0}
        `).join("\n");

        const prompt = `
            Actúa como un Director Deportivo y Ojeador Jefe (Scout) de un club de fútbol profesional. 
            Tu objetivo es analizar los perfiles y estadísticas de estos ${players.length} jugadores y entregar un veredicto técnico, táctico y objetivo.
            Usa un tono profesional, analítico y directo.

            Datos de los jugadores:
            ${playersInfo}

            Por favor, redacta un análisis estructurado:
            1. Breve resumen de las fortalezas de cada jugador.
            2. Veredicto final comparativo: en qué contexto táctico conviene fichar a cada uno y cuál parece tener mejor rendimiento general. Al final de tu análisis no incluyas nombre del que lo envia.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error en el servicio de IA:", error);
        throw new Error("No se pudo generar el reporte de IA en este momento.");
    }
};