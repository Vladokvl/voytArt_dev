"use client";

import dynamic from "next/dynamic";

/**
 * Динамічний імпорт ImageCropModal (разом із важким react-easy-crop та
 * @imgly/background-removal), щоб ці бібліотеки не потрапляли в основний
 * бандл адмін-сторінок, а завантажувались лише при відкритті кропу.
 *
 * API повністю збігається з ImageCropModal (default export з тими ж props).
 */
const LazyImageCropModal = dynamic(() => import("./ImageCropModal"), {
  ssr: false,
  loading: () => null,
});

export default LazyImageCropModal;