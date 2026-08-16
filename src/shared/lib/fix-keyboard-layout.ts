export const invertTranslation = (text: string) => {
  const enToRu: { [key: string]: string } = {
    q: "й",
    w: "ц",
    e: "у",
    r: "к",
    t: "е",
    y: "н",
    u: "г",
    i: "ш",
    o: "щ",
    p: "з",
    "[": "х",
    "]": "ъ",
    a: "ф",
    s: "ы",
    d: "в",
    f: "а",
    g: "п",
    h: "р",
    j: "о",
    k: "л",
    l: "д",
    ";": "ж",
    "'": "э",
    z: "я",
    x: "ч",
    c: "с",
    v: "м",
    b: "и",
    n: "т",
    m: "ь",
    ",": "б",
    ".": "ю",
    "/": ".",
    "`": "ё"
  };

  const fullReplacer: { [key: string]: string } = { ...enToRu };
  Object.entries(enToRu).forEach(([eng, ru]) => {
    fullReplacer[ru] = eng;
  });

  return text
    .split("")
    .map(char => {
      const lower = char.toLowerCase();
      const replacement = fullReplacer[lower];
      return replacement || char;
    })
    .join("");
};
