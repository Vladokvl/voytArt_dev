// Константа для тестування якості.
// Можливі значення:
// - "DYNAMIC" (за замовчуванням): автоматично вибирає 720p (standard) або 1080p (hd) залежно від інтернету та екрану.
// - "FORCE_1080": завжди завантажує важкі кадри 1080p (hd).
// - "FORCE_720": завжди завантажує легкі кадри 720p (standard).
export const FORCE_QUALITY: "DYNAMIC" | "FORCE_1080" | "FORCE_720" = "DYNAMIC";

export type QualityTier = "hd" | "standard";

/**
 * Визначає якісний рівень для десктопних кадрів:
 * - "standard": для збереження трафіку (saveData), повільного інтернету (2G/3G/downlink < 5Mbps) або стандартних DPR 1 моніторів (<= 1440px)
 * - "hd": для високошвидкісного інтернету на великих Retina/HiDPI дисплеях
 */
export function getDesktopQualityTier(): QualityTier {
  if (typeof window === "undefined") return "hd";

  // Перевірка константи тестування
  if (FORCE_QUALITY === "FORCE_1080") return "hd";
  if (FORCE_QUALITY === "FORCE_720") return "standard";

  const nav = navigator as Navigator & {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
      downlink?: number;
    };
  };

  const conn = nav.connection;

  // 1. Явний режим економії трафіку
  if (conn?.saveData) return "standard";

  // 2. Повільна мережа (2G/3G)
  const effectiveType = conn?.effectiveType;
  if (
    effectiveType === "2g" ||
    effectiveType === "slow-2g" ||
    effectiveType === "3g"
  ) {
    return "standard";
  }

  // 3. Низька пропускна здатність (< 5 Mbps)
  const downlink = conn?.downlink;
  if (typeof downlink === "number" && downlink > 0 && downlink < 5) {
    return "standard";
  }

  // 4. Звичайний DPR 1 на стандартному екрані (<= 1440px)
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1 && window.innerWidth <= 1440) {
    return "standard";
  }

  return "hd";
}
