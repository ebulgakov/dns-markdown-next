/**
 * dependency-cruiser config.
 *
 * Deliberately narrow scope — this exists to cover exactly what
 * eslint-plugin-boundaries (eslint.config.mjs) cannot reach. Unlike a
 * split app/server stack, eslint-plugin-boundaries here already spans both
 * `app/**` and `src/**` and enforces every FSD layer/slice edge (see
 * eslint.config.mjs's `boundaries/dependencies` policy) — so there is no
 * app<->server-style gap to duplicate. The one thing it genuinely cannot
 * do: `boundaries/dependencies` checks layer edges, not circular imports.
 * dependency-cruiser's `no-circular` rule is the actual reason this file
 * exists; everything else here is a resolver canary, not a second copy of
 * the FSD policy.
 *
 * Orphan-module detection is deliberately NOT enabled: Next.js's file-based
 * routing (page.tsx/route.ts picked up by convention, not a static import)
 * and Storybook's story-glob discovery mean "unreferenced by a static
 * import" does not reliably mean "unused" in this repo.
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular imports aren't caught by eslint-plugin-boundaries, which only checks layer/slice edges, not cycles.",
      from: {},
      to: { circular: true }
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment:
        "Canary against a misconfigured resolver silently resolving nothing, which would make no-circular pass green while checking nothing.",
      from: {},
      to: { couldNotResolve: true }
    }
  ],
  options: {
    tsConfig: {
      fileName: "tsconfig.json"
    },
    enhancedResolveOptions: {
      // Several deps (@clerk/nextjs, @vercel/speed-insights/next, ...)
      // expose subpaths only via package.json's `exports` field; without
      // this they come back couldNotResolve.
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"]
    },
    exclude: {
      path: "(^|/)(__tests__|__mocks__|node_modules)/|\\.stories\\.tsx$|^\\.next/|^storybook-static/"
    },
    doNotFollow: {
      path: "node_modules"
    }
  }
};
