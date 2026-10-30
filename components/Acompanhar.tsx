"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lerLocal } from "@/lib/encomendas";
import { dataHora, soDigitos, waLink } from "@/lib/formato";
import { marca } from "@/lib/marca";

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
    if (c.length < 4) return setErro("Introduz o código da encomenda (ex.: CV-3F9A21).");
    if (soDigitos(tel).length < 9) return setErro("Introduz o número de telefone utilizado na compra.");
    router.push(`/encomenda/CV-${c}?t=${soDigitos(tel)}`);
  };

  return (
    <div className="caixa grid gap-14 pb-24 pt-10 sm:pt-16 md:grid-cols-2">
      <div className="max-w-md">
        <h1 className="titulo text-[40px] sm:text-[52px]">Acompanhar encomenda</h1>
        <p className="mt-4 font-display text-[22px] leading-snug text-choco">A tua encomenda, sempre ao teu alcance.</p>
        <p className="mt-3 text-[15px] text-tinta/70">Introduz o código da encomenda e o número de telefone utilizado na compra para consultares o estado da tua encomenda.</p>
        <form onSubmit={ir} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="codigo" className="rotulo">Código da encomenda</label>
            <input id="codigo" className="campo uppercase placeholder:normal-case" value={codigo} onChange={(e) => { setCodigo(e.target.value); setErro(""); }} placeholder="Ex.: CV-3F9A21" autoCapitalize="characters" />
          </div>
          <div>
            <label htmlFor="tel" className="rotulo">Número de telefone</label>
            <input id="tel" className="campo" value={tel} onChange={(e) => { setTel(e.target.value); setErro(""); }} inputMode="tel" placeholder="Ex.: 9XX XXX XXX" />
          </div>
          {erro && <p role="alert" className="text-[14px] text-[#9b2c1d]">{erro}</p>}
          <button className="btn-choco w-full uppercase tracking-[.14em] text-[13px]">Consultar encomenda</button>
        </form>
        <div className="mt-10 border-t border-choco/15 pt-6">
          <p className="text-[15px] font-medium text-tinta">Não tens o código da tua encomenda?</p>
          <p className="mt-2 text-[14px] leading-relaxed text-tinta/70">
            Verifica as mensagens de confirmação que recebeste ou{" "}
            <a href={waLink(marca.whatsapp, "Olá, Carvieal! Não tenho o código da minha encomenda.")} target="_blank" rel="noopener noreferrer" className="link text-choco">contacta-nos através do WhatsApp</a>. Teremos todo o gosto em ajudar.
          </p>
        </div>
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
