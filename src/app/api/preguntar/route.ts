import axios from "axios";
import { LLM_QUESTIONS } from "@/lib/questions";

// Modelo gratuito de Groq (compatible con la API de OpenAI). Se puede cambiar con la
// variable de entorno GROQ_MODEL sin tocar código.
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT =
  "Eres el asistente de una aplicación que acaba de enseñar la ley de gravitación " +
  "universal de Newton y el problema de los tres cuerpos a una persona sin formación " +
  "en física. Responde en español, en un máximo de 4 frases, de forma cercana y sin " +
  "fórmulas ni tecnicismos innecesarios.";

/** Recibe una de las preguntas fijas de la pantalla final y devuelve la respuesta del
 * modelo. Solo se aceptan esas preguntas: la clave es del servidor y no debe poder
 * usarse como un proxy abierto a un modelo de pago con preguntas arbitrarias. */
export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Falta configurar GROQ_API_KEY en el servidor." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const question = body?.question;

  if (typeof question !== "string" || !LLM_QUESTIONS.includes(question as never)) {
    return Response.json({ error: "Esa pregunta no está disponible." }, { status: 400 });
  }

  try {
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

    return Response.json({ answer });
  } catch (error) {
    console.error("Error al preguntar al modelo:", error);
    return Response.json({ error: "No se ha podido obtener respuesta." }, { status: 502 });
  }
}
