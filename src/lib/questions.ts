// Las preguntas fijas que el usuario puede hacerle al modelo de lenguaje, en la
// pantalla final de la experiencia de aprendizaje. Un archivo aparte porque las usan
// tanto el botón (cliente) como el endpoint que las valida (servidor).
export const LLM_QUESTIONS = [
  "Explícame cómo funcionaría en 3D",
  "Cuéntame más sobre la historia de la ley de gravitación universal",
  "¿Dónde vemos tres cuerpos en la vida real?",
] as const;
