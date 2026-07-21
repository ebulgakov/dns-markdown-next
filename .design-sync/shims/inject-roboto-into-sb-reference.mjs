// Re-run after every `.design-sync/sb-reference` rebuild (sb-reference is
// gitignored/regenerated, so this injection does not survive on its own).
// Ships the same real Roboto/Roboto Mono @font-face + CSS variable that
// cfg.extraFonts adds to the ds bundle into the reference storybook build,
// so the compare oracle judges text against the real brand font instead of
// a coincidental fallback match on both sides. See NOTES.md "Roboto font
// shipped via cfg.extraFonts".
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const sbRef = join(repoRoot, ".design-sync", "sb-reference");
const iframePath = join(sbRef, "iframe.html");
const fontsDir = join(here, "fonts");
const destFontsDir = join(sbRef, "assets", "roboto-fonts");

if (!existsSync(iframePath)) {
  console.error(`! ${iframePath} not found — build sb-reference first`);
  process.exit(1);
}

mkdirSync(destFontsDir, { recursive: true });
for (const f of readdirSync(fontsDir)) {
  if (f.endsWith(".woff2")) cpSync(join(fontsDir, f), join(destFontsDir, f));
}

const rewrite = (css) => css.replace(/url\("([^"]+)"\)/g, 'url("assets/roboto-fonts/$1")');
const robotoCss = rewrite(readFileSync(join(fontsDir, "roboto.css"), "utf8"));
const monoCss = rewrite(readFileSync(join(fontsDir, "roboto-mono.css"), "utf8"));

const styleBlock =
  `<style id="ds-sync-roboto-oracle-fix">\n${robotoCss}\n${monoCss}\n` +
  `:root{--font-roboto-sans:"Roboto","Roboto Fallback";--font-roboto-mono:"Roboto Mono","Roboto Mono Fallback";}\n</style>\n`;

let html = readFileSync(iframePath, "utf8");
html = html.replace(/<style id="ds-sync-roboto-oracle-fix">[\s\S]*?<\/style>\n/, "");
html = html.replace("</head>", styleBlock + "</head>");
writeFileSync(iframePath, html);
console.error("injected Roboto @font-face + variable into sb-reference/iframe.html");
