// ══════════════════════════════════════════════════════════════════════════════
// КОНФІГУРАЦІЯ ТА КОНСТАНТИ ДЛЯ ТЕСТУВАННЯ АДАПТИВНОСТІ
// ══════════════════════════════════════════════════════════════════════════════

/**
 * 1. КОНСТАНТА ЯКОСТІ РОЗДІЛЬНОЇ ЗДАТНОСТІ (1080p vs 720p)
 * Можливі значення:
 * - "DYNAMIC" (за замовчуванням): автоматично вибирає 720p (standard) або 1080p (hd) залежно від інтернету та екрану.
 * - "FORCE_1080": завжди завантажує повнорозмірні кадри 1080p (hd).
 * - "FORCE_720": завжди завантажує оптимізовані легкі кадри 720p (standard).
 */
export const FORCE_QUALITY: "DYNAMIC" | "FORCE_1080" | "FORCE_720" = "DYNAMIC";

/**
 * 2. КОНСТАНТА ПРОРІДЖУВАННЯ КАДРІВ (FRAME STRIDE / ЧАСТОТА КАДРІВ)
 * Можливі значення:
 * - "AUTO" (за замовчуванням): автоматично вибирає крок 2 або 3 на повільному інтернеті/Save-Data, і 1 на швидкому.
 * - 1: завантажувати кожен 1-й кадр (всі кадри 1, 2, 3, 4...) — 100% плавність.
 * - 2: завантажувати кожен 2-й кадр (1, 3, 5, 7...) — у 2 рази менше даних (-50% трафіку та HTTP-запитів).
 * - 3: завантажувати кожен 3-й кадр (1, 4, 7, 10...) — у 3 рази менше даних (-67% трафіку).
 * - 4: завантажувати кожен 4-й кадр (1, 5, 9, 13...) — у 4 рази менше даних (-75% трафіку).
 */
export const FORCE_FRAME_STRIDE: "AUTO" | 1 | 2 | 3 | 4 = "AUTO";

export type QualityTier = "hd" | "standard";

/**
 * Визначає якісний рівень роздільної здатності:
 * - "standard": 720p для економії трафіку або повільного зв'язку
 * - "hd": 1080p для великих HiDPI/Retina моніторів
 */
export function getDesktopQualityTier(): QualityTier {
  if (typeof window === "undefined") return "hd";

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

  // 1. Режим економії трафіку
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

  // 3. Низька швидкість (< 5 Mbps)
  const downlink = conn?.downlink;
  if (typeof downlink === "number" && downlink > 0 && downlink < 5) {
    return "standard";
  }

  // 4. Звичайний DPR <= 1 на екрані <= 1440px
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1 && window.innerWidth <= 1440) {
    return "standard";
  }

  return "hd";
}

/**
 * Визначає крок вибірки кадрів (1, 2, 3, 4):
 * Дозволяє програмно зменшити кількість завантажуваних файлів без втрати роздільної здатності.
 */
export function getFrameStride(): number {
  if (typeof window === "undefined") return 1;

  if (FORCE_FRAME_STRIDE !== "AUTO") {
    return FORCE_FRAME_STRIDE;
  }

  const nav = navigator as Navigator & {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
      downlink?: number;
    };
  };

  const conn = nav.connection;
  if (conn?.saveData) return 2;

  const effectiveType = conn?.effectiveType;
  if (effectiveType === "2g" || effectiveType === "slow-2g") return 3;
  if (effectiveType === "3g") return 2;

  const downlink = conn?.downlink;
  if (typeof downlink === "number" && downlink > 0 && downlink < 3) {
    return 2;
  }

  return 1;
}

/**
 * Округлює номер кадру до найближчого завантаженого згідно з кроком stride.
 * Гарантує, що запитуваний номер потрапляє в сітку (1, 1+stride, 1+2*stride...).
 */
export function snapFrameToStride(
  frame: number,
  stride: number,
  totalFrames: number,
): number {
  if (stride <= 1) return Math.min(totalFrames, Math.max(1, frame));
  const snapped = Math.round((frame - 1) / stride) * stride + 1;
  return Math.min(totalFrames, Math.max(1, snapped));
}
