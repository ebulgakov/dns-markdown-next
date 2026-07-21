// Hand-written barrel: this repo is a Next.js app, not a published component
// package, so there is no dist/ entry for the storybook-shape converter to
// point at. This re-exports every storied component from its real source so
// package-build.mjs can bundle them exactly as shipped.
//
// This MUST be a side-effect `import` (not inline code, and MUST be the
// first statement): ES module import hoisting runs every sibling
// import/export-from in declaration order, each after its own dependency
// subtree — but only after that does an importING file's OWN inline
// top-level code run. An inline polyfill here would execute AFTER every
// `export *` target below (and everything they import) had already run,
// which is exactly what made the first attempt at this fix a no-op.
import "./shims/node-globals-polyfill";

// UserProvider is not itself a storied component (no .stories.tsx), but the
// conventions header needs it as a real bundle export — several storied
// components (Catalog, ProductCard, CatalogHeader, JumpToSectionContainer)
// read app/contexts/user-context.tsx and need this wrapper to render
// favorites/hidden-sections state correctly in a design agent's build.
export { UserProvider } from "../app/contexts/user-context";

export * from "../app/components/alerts/catalog-favorites-empty-alert";
export * from "../app/components/alerts/favorites-empty-alert";
export * from "../app/components/analytics/analytics-goods-changes-chart";
export * from "../app/components/analytics/analytics-goods-count-chart";
export * from "../app/components/analytics/analytics-reports";
export * from "../app/components/catalog/catalog-header";
export * from "../app/components/catalog/catalog";
export * from "../app/components/change-location-selector/change-location-selector";
export * from "../app/components/change-theme-selector/change-theme-selector";
export * from "../app/components/chart-prices/chart-prices";
export * from "../app/components/footer/footer";
export * from "../app/components/hot-offer/hot-offer";
export * from "../app/components/jump-to-section/jump-to-section-container";
export * from "../app/components/jump-to-section/jump-to-section-toggle";
export * from "../app/components/jump-to-section/jump-to-section";
export * from "../app/components/more-link/more-link";
export * from "../app/components/page-loader/page-loader";
export * from "../app/components/product-card/product-card-diff";
export * from "../app/components/product-card/product-card-favorite-toggle";
export * from "../app/components/product-card/product-card";
export * from "../app/components/profile-sections/profile-notifications";
export * from "../app/components/profile-sections/profile-sections";
export * from "../app/components/profile-sections/profile-update-sections";
export * from "../app/components/scroll-to-top/scroll-to-top";
export * from "../app/components/search/search";
export * from "../app/components/sort-goods/sort-goods";
export * from "../app/components/ui/alert/alert";
export * from "../app/components/ui/button/button";
export * from "../app/components/ui/card/card";
export * from "../app/components/ui/chart/chart";
export * from "../app/components/ui/checkbox/checkbox";
export * from "../app/components/ui/control-with-label/control-with-label";
export * from "../app/components/ui/dialog/dialog";
export * from "../app/components/ui/input/input";
export * from "../app/components/ui/label/label";
export * from "../app/components/ui/navigation-menu/navigation-menu";
export * from "../app/components/ui/page-title/page-title";
export * from "../app/components/ui/scroll-area/scroll-area";
export * from "../app/components/ui/select/select";
export * from "../app/components/ui/separator/separator";
export * from "../app/components/ui/tabs/tabs";
export * from "../app/components/ui/title/title";
export * from "../app/components/ui/tooltip/tooltip";
