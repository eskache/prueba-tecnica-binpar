/** Un número en notación científica, p. ej. 6,674 × 10⁻¹¹. La mantisa se guarda
 * como texto para conservar tal cual la coma decimal. */
export type ScientificNumber = {
  mantissa: string;
  exponent: number;
};

/** El número escrito como se lee en pantalla, con el exponente en superíndice. */
export function ScientificNotation({ mantissa, exponent }: ScientificNumber) {
  const sign = exponent < 0 ? "−" : "";

  return (
    <>
      {mantissa} × 10
      <sup>
        {sign}
        {Math.abs(exponent)}
      </sup>
    </>
  );
}

/** El número escrito como se diría en voz alta, para lectores de pantalla. */
export function spokenScientificNumber({ mantissa, exponent }: ScientificNumber) {
  return `${mantissa} por 10 elevado a ${exponent}`;
}
