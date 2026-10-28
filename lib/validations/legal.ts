/* NIF / NIE / CIF españoles. Sin dependencias: se usa también en el navegador para avisar al escribir. */

const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

/** " b-1234567 4 " → "B12345674" */
export const normalizeTaxId = (raw: string) => raw.toUpperCase().replace(/[\s.\-/]/g, "");

/** Valida el formato y el dígito/letra de control de un NIF (DNI), NIE o CIF. */
export function isValidSpanishTaxId(raw: string): boolean {
  const v = normalizeTaxId(raw);

  // DNI: 8 cifras + letra
  if (/^\d{8}[A-Z]$/.test(v)) return DNI_LETTERS[Number(v.slice(0, 8)) % 23] === v[8];

  // NIE: X/Y/Z + 7 cifras + letra (X=0, Y=1, Z=2)
  if (/^[XYZ]\d{7}[A-Z]$/.test(v)) return DNI_LETTERS[Number(`${"XYZ".indexOf(v[0])}${v.slice(1, 8)}`) % 23] === v[8];

  // NIF especiales (K, L, M) + 7 cifras + letra
  if (/^[KLM]\d{7}[A-Z]$/.test(v)) return DNI_LETTERS[Number(v.slice(1, 8)) % 23] === v[8];

  // CIF (sociedades): letra + 7 cifras + control (cifra o letra según el tipo)
  if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(v)) {
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      let digit = Number(v[i + 1]);
      if (i % 2 === 0) {
        digit *= 2;
        digit = Math.floor(digit / 10) + (digit % 10);
      }
      sum += digit;
    }
    const control = (10 - (sum % 10)) % 10;
    const letter = "JABCDEFGHI"[control];
    const given = v[8];
    if ("PQRSNW".includes(v[0])) return given === letter;
    if ("ABEH".includes(v[0])) return given === String(control);
    return given === String(control) || given === letter;
  }
  return false;
}

/** Tipo legible del identificador, para la ayuda del formulario. */
export function taxIdKind(raw: string): "DNI" | "NIE" | "CIF" | null {
  const v = normalizeTaxId(raw);
  if (!isValidSpanishTaxId(v)) return null;
  if (/^\d/.test(v) || /^[KLM]/.test(v)) return "DNI";
  if (/^[XYZ]/.test(v)) return "NIE";
  return "CIF";
}
