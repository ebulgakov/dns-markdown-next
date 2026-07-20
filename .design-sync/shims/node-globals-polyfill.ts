// Must be the entry's first IMPORT (not inline code — ES module import
// hoisting runs every sibling `import`/`export * from` in declaration order,
// but only AFTER recursing into each one's own dependency subtree; inline
// top-level statements in the entry file itself run last of all). Some
// bundled Next.js internals (next/image, next/link) read process.env.__NEXT_*
// at module scope; Next's own client bundler shims `process` for the browser,
// raw esbuild doesn't. See NOTES.md "process is not defined".
if (typeof globalThis.process === "undefined") {
  (globalThis as { process?: unknown }).process = { env: {} };
}
// next/image reads `process.env.__NEXT_IMAGE_OPTS` (real Next webpack builds
// substitute this at compile time with a literal config object) as its
// image-config source. Without it, `defaultLoader` falls back to
// `imageConfigDefault`'s `remotePatterns: []`, which rejects EVERY remote
// src — including the app's own real `c.dns-shop.ru` domain from
// next.config.ts. Storied components' Storybook fixture data goes further
// and uses placehold.co (see HotOffer/ProductCard/Catalog mocks in
// __mocks__/goods.ts), a host that will never be in the real app's
// remotePatterns regardless. Setting `unoptimized: true` here matches how
// Storybook itself typically handles next/image (skip the loader/allowlist
// entirely) — this only relaxes an image-domain allowlist for the design-sync
// preview bundle; it never reaches the shipped app.
(globalThis.process as { env: Record<string, unknown> }).env.__NEXT_IMAGE_OPTS = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  path: "/_next/image",
  loader: "default",
  loaderFile: "",
  domains: [],
  disableStaticImages: false,
  minimumCacheTTL: 14400,
  formats: ["image/webp"],
  maximumRedirects: 3,
  dangerouslyAllowLocalIP: false,
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  contentDispositionType: "attachment",
  localPatterns: undefined,
  remotePatterns: [],
  qualities: [75],
  unoptimized: true
};
// next/image's defaultLoader → match-remote-pattern.js → the vendored
// picomatch reads a bare `__dirname` (a Node CJS module-wrapper local, not a
// real global) when validating a remote image src against
// next.config.ts's images.remotePatterns. esbuild's browser-platform CJS
// interop doesn't provide it. A global `var __dirname` satisfies any later
// bare reference via normal scope-chain-to-global fallback.
if (typeof globalThis.__dirname === "undefined") {
  (globalThis as { __dirname?: unknown }).__dirname = "";
}
if (typeof globalThis.__filename === "undefined") {
  (globalThis as { __filename?: unknown }).__filename = "";
}
export {};
