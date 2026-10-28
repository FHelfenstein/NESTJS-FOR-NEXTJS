export function parseCorsWhitelist(raw: string): string[] {
  return raw
    .split(/\s+/g) // pego qualquer espaço e vira um array
    .map(url => url.replace(/\/+$/, '')) // aqui pego qualquer barra na URL e removo
    .filter(Boolean); // remove strings vazias
}
