/**
 * Código de color de la ley: cada magnitud de la fórmula tiene un color fijo
 * que se reutiliza en la fórmula, el glosario, las ilustraciones y los
 * términos con definición. Las clases se escriben completas (no compuestas
 * con plantillas) para que Tailwind pueda detectarlas.
 */
export type Tone = "mass" | "distance" | "constant";

export const TONE_TEXT: Record<Tone, string> = {
  mass: "text-mass",
  distance: "text-distance",
  constant: "text-constant",
};

export const TONE_DECORATION: Record<Tone, string> = {
  mass: "decoration-mass/50",
  distance: "decoration-distance/50",
  constant: "decoration-constant/50",
};

export const TONE_CHIP: Record<Tone, string> = {
  mass: "bg-mass/15",
  distance: "bg-distance/15",
  constant: "bg-constant/15",
};

export const TONE_DOT: Record<Tone, string> = {
  mass: "bg-mass",
  distance: "bg-distance",
  constant: "bg-constant",
};
