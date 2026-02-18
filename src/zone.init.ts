/**
 * Carga zone.js antes que cualquier código Angular en el servidor.
 * Debe ser el primer import en server.ts para evitar NG0908.
 * Polyfill de requestAnimationFrame para Node ANTES de zone.js para que la zona se estabilice.
 */
const g = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {}));
if (typeof (g as any).requestAnimationFrame === 'undefined') {
  (g as any).requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback as () => void, 0);
  (g as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}

import 'zone.js';
