// Formatação manual (igual no servidor e no navegador).
export function kz(v: number) {
  return String(Math.round(v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " Kz";
}

export function soDigitos(t: string) {
  return (t || "").replace(/\D/g, "");
}

/** Número para o wa.me: acrescenta 244 a números angolanos de 9 dígitos. */
export function telefoneWa(t: string) {
  const d = soDigitos(t);
  return d.length === 9 ? "244" + d : d;
}

export function waLink(numero: string, texto?: string) {
  return `https://wa.me/${telefoneWa(numero)}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

export function slugify(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function dataHora(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`;
}
