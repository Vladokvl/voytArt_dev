"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/art/[[...artistId]]/art.module.scss";

export default function NeonToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNeon = searchParams.get("neon") === "true";

  function handleToggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (isNeon) {
      params.delete("neon");
    } else {
      params.set("neon", "true");
    }
    router.push("/art?" + params.toString(), { scroll: false });
  }

  return (
    <div className={styles.neonToggleWrapper}>
      <span className={styles.neonToggleLabel}>UV Neon Mode</span>
      <label className={styles.neonSwitchWrap} aria-label="Toggle global neon mode">
        <span className={styles.neonSwitchTrack}>
          <input
            type="checkbox"
            className={styles.neonSwitchInput}
            checked={isNeon}
            onChange={handleToggle}
          />
          <span className={styles.neonSwitchThumb} />
        </span>
      </label>
    </div>
  );
}
