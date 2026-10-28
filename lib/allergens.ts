/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011). */
export const ALLERGENS = [
  { code: "gluten", label: "Gluten", short: "GLU" },
  { code: "crustaceos", label: "Crustáceos", short: "CRU" },
  { code: "huevo", label: "Huevo", short: "HUE" },
  { code: "pescado", label: "Pescado", short: "PES" },
  { code: "cacahuetes", label: "Cacahuetes", short: "CAC" },
  { code: "soja", label: "Soja", short: "SOJ" },
  { code: "lacteos", label: "Lácteos", short: "LAC" },
  { code: "frutos-cascara", label: "Frutos de cáscara", short: "FRU" },
  { code: "apio", label: "Apio", short: "API" },
  { code: "mostaza", label: "Mostaza", short: "MOS" },
  { code: "sesamo", label: "Sésamo", short: "SES" },
  { code: "sulfitos", label: "Sulfitos", short: "SUL" },
  { code: "altramuces", label: "Altramuces", short: "ALT" },
  { code: "moluscos", label: "Moluscos", short: "MOL" },
] as const;

export type AllergenCode = (typeof ALLERGENS)[number]["code"];

export const ALLERGEN_CODES = ALLERGENS.map((a) => a.code) as [AllergenCode, ...AllergenCode[]];

const byCode = new Map<string, (typeof ALLERGENS)[number]>(ALLERGENS.map((a) => [a.code, a]));

export const getAllergen = (code: string) => byCode.get(code);
