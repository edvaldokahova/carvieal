"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lerLocal } from "@/lib/encomendas";
import { dataHora, soDigitos } from "@/lib/formato";

export default function Acompanhar() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [tel, setTel] = useState("");
  const [erro, setErro] = useState("");
  const [minhas, setMinhas] = useState<{ codigo: string; telefone: string; em: string }[]>([]);
  useEffect(() => setMinhas(lerLocal()), []);

  const ir = (e: React.FormEvent) => {
    e.preventDefault();
    const c = codigo.trim().toUpperCase().replace(/^CV-?/, "");
    if (c.length < 4) return setErro("Indique o código da encomenda (ex.: CV-3F9A21).");
    if (soDigitos(tel).length < 9) return setErro("Indique o telefone usado na compra.");
    router.push(`/encomenda/CV-${c}?t=${soDigitos(tel)}`);
  };

  return (
    <div className="caixa grid gap-14 pb-24 pt-10 sm:pt-16 md:grid-cols-2">
      <div className="max-w-md">
        <h1 className="titulo text-[40px] sm:text-[52px]">Acompanhar encomenda</h1>
        <p className="mt-4 text-[15px] text-tinta/70">Use o código que recebeu ao encomendar e o telefone indicado na compra.</p>
        <form onSubmit={ir} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="codigo" className="rotulo">Código da encomenda</label>
            <input id="codigo" className="campo uppercase" value={codigo} onChange={(e) => { setCodigo(e.target.value); setErro(""); }} placeholder="CV-3F9A21" autoCapitalize="characters" />
          </div>
          <div>
            <label htmlFor="tel" className="rotulo">Telefone</label>
            <input id="tel" className="campo" value={tel} onChange={(e) => { setTel(e.target.value); setErro(""); }} inputMode="tel" placeholder="9XX XXX XXX" />
          </div>
          {erro && <p role="alert" className="text-[14px] text-[#9b2c1d]">{erro}</p>}
          <button className="btn-choco w-full">Ver estado</button>
        </form>
      </div>
      {minhas.length > 0 && (
        <div>
          <h2 className="font-display text-[24px] text-choco">Encomendas feitas neste telemóvel</h2>
          <ul className="mt-5 divide-y divide-choco/15 border-y border-choco/15">
            {minhas.map((m) => (
              <li key={m.codigo}>
                <Link href={`/encomenda/${m.codigo}?t=${m.telefone}`} className="flex items-center justify-between py-4 text-[15px] hover:text-choco">
                  <span>{m.codigo}</span><span className="text-[13px] text-tinta/55">{dataHora(m.em)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
