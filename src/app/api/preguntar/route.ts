import axios from "axios";
import { LLM_QUESTIONS } from "@/lib/questions";

// Modelo gratuito de Groq (compatible con la API de OpenAI). Se puede cambiar con la
// variable de entorno GROQ_MODEL sin tocar código. "llama-3.3-70b-versatile" (el que
// había antes) dio "model not found" en producción: Groq va retirando modelos del
// catálogo gratuito con frecuencia. Este es más pequeño y, de momento, más estable.
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT =
  "Eres el asistente de una aplicación que acaba de enseñar la ley de gravitación " +
  "universal de Newton y el problema de los tres cuerpos a una persona sin formación " +
  "en física. Responde en español, en un máximo de 4 frases, de forma cercana y sin " +
  "fórmulas ni tecnicismos innecesarios.";

/** Recibe una de las preguntas fijas de la pantalla final y devuelve la respuesta del
 * modelo. Solo se aceptan esas preguntas: la clave es del servidor y no debe poder
 * usarse como un proxy abierto a un modelo de pago con preguntas arbitrarias. */
export async function POST(request: Request) {
  // Toda la función va dentro del try: un fallo fuera de él (el body no tenía uno
  // completo) deja la petición sin respuesta y, en Vercel, sin ningún registro que
  // explique por qué: imposible de diagnosticar desde fuera. Los console.log marcan
  // hasta dónde llegó a ejecutarse antes de fallar.
  try {
    console.log("[/api/preguntar] petición recibida");

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("[/api/preguntar] falta la variable GROQ_API_KEY");
      return Response.json(
        { error: "Falta configurar GROQ_API_KEY en el servidor." },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => null);
    const question = body?.question;
    console.log("[/api/preguntar] pregunta recibida:", question);

    if (typeof question !== "string" || !LLM_QUESTIONS.includes(question as never)) {
      return Response.json({ error: "Esa pregunta no está disponible." }, { status: 400 });
    }

    const groqResponse = await axios.post(
      GROQ_CHAT_URL,
      {
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        temperature: 0.5,
        max_tokens: 300,
      },
      { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 15_000 },
    );

    const answer = groqResponse.data.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("El modelo no devolvió texto");

    console.log("[/api/preguntar] respuesta del modelo obtenida");
    return Response.json({ answer });
  } catch (error) {
    // El motivo real (clave inválida, modelo retirado, límite de peticiones...) se
    // manda también en la respuesta, no solo al registro: en el plan gratuito de
    // Vercel los "Logs" son en directo y no quedan guardados, así que ver el motivo
    // ahí exige tenerlos abiertos en el momento exacto de la petición. En la respuesta
    // se ve siempre, con las herramientas de desarrollador del navegador (pestaña Red).
    let detail = "";
    if (axios.isAxiosError(error)) {
      detail = JSON.stringify(error.response?.data ?? error.message);
      console.error("[/api/preguntar] error de Groq:", error.response?.status, detail);
    } else {
      detail = error instanceof Error ? error.message : String(error);
      console.error("[/api/preguntar] error inesperado:", error);
    }
    return Response.json({ error: "No se ha podido obtener respuesta.", detail }, { status: 502 });
  }
}
