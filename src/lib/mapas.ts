/** URLs de mapas. Sin API keys: Google Maps embed público y OpenStreetMap. */

export function embedGoogle(consulta: string, zoom = 15): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(consulta)}&z=${zoom}&output=embed`;
}

export function embedOsm({ lat, lng }: { lat: number; lng: number }): string {
  const bbox = [lng - 0.006, lat - 0.004, lng + 0.006, lat + 0.004].map((n) => n.toFixed(5)).join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
}

export function comoLlegar(destino: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}
