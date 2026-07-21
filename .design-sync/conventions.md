## Wrapping and setup

Most components render standalone with no wrapper required — styling comes
entirely from the shipped `styles.css` closure (Tailwind v4 utility classes
+ CSS custom-property tokens, no ThemeProvider needed for colors/spacing).

**`UserProvider`** is the one wrapper that matters. `Catalog`, `ProductCard`,
`CatalogHeader`, and `JumpToSectionContainer` read favorites/hidden-section
state from React context (`app/contexts/user-context.tsx`) and silently no-op
their favorite/section toggles without it. Wrap any composition using those
components:

```tsx
<UserProvider
  value={{
    hiddenSections: [],
    favoriteSections: [],
    favorites: [],
    city: "Москва",
    onToggleHiddenSection: title => {},
    onToggleFavoriteSection: title => {},
    onAddFavorite: async goods => {},
    onRemoveFavorite: async link => {}
  }}
>
  {/* Catalog, ProductCard, CatalogHeader, JumpToSectionContainer go here */}
</UserProvider>
```

Without a real `onAddFavorite`/`onToggleFavoriteSection`, favoriting is a
visual no-op — that's fine for a static design, but wire real handlers if
the design needs interactive favoriting to work.

**Dark mode**: toggle by adding/removing the `.dark` class on an ancestor
element (`<html class="dark">` or any wrapping `<div className="dark">`) —
it's a plain Tailwind class variant, not a provider.

## Styling idiom — Tailwind v4 utilities + shadcn semantic tokens

This DS uses Tailwind utility classes exclusively — no CSS modules, no
styled-components, no inline style objects for layout/color. The color
vocabulary is shadcn's semantic token set (light/dark pair per token, defined
as CSS custom properties, consumed via Tailwind utilities):

| Utility | Use for |
|---|---|
| `bg-background` / `text-foreground` | page/app background and default text |
| `bg-card` / `text-card-foreground` | card surfaces (most components sit on this) |
| `bg-primary` / `text-primary-foreground` | primary actions (buttons, links, brand accents) |
| `bg-secondary` / `text-secondary-foreground` | secondary emphasis |
| `bg-accent` / `text-accent` / `text-accent-foreground` | highlighted/hover state |
| `text-muted-foreground` | de-emphasized/secondary text |
| `bg-destructive` | destructive actions/errors |
| `border-border` | default borders |
| `text-favorite` / `fill-favorite` | the favorites star (yellow, `#ffc529`) |
| `text-success` | success/positive state (e.g. price-drop indicators) |

Never invent new color class names (no `bg-brand`, `text-highlight`, etc.) —
this is the complete semantic palette; compose spacing/typography with
standard Tailwind utilities (`p-4`, `gap-2`, `text-sm`, `font-medium`, …)
around it. One app-specific non-color token: `var(--nav-bar-height)` (56px) —
used by a few components (`Catalog`, `JumpToSection`) for sticky-header
offset math; reference it the same way if building sticky layouts alongside
them.

Typography: `font-sans` (the default) is real Roboto, `font-mono` is real
Roboto Mono — both ship in this bundle's `fonts/`. Don't use `font-serif`
(declared as a fallback stack only; no component in this DS uses it and no
real serif font ships).

## Where the truth lives

Read `styles.css` (and its `@import` closure, including `_ds_bundle.css`)
before styling anything — it's the actual compiled Tailwind output, so any
token or utility class named above can be confirmed there directly. Each
component's `.prompt.md` documents its specific props and story variants;
its `.d.ts` is the authoritative prop-type contract.

## Example

```tsx
<div className="bg-background flex flex-col gap-4 p-4">
  <Title variant="h2">Каталог</Title>
  <UserProvider value={{ hiddenSections: [], favoriteSections: [], favorites: [], city: "Москва" }}>
    <ProductCard item={goods} shownFavorites shownCompares />
  </UserProvider>
  <Button variant="default">Показать ещё</Button>
</div>
```
