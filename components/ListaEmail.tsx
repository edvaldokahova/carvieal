"use client";
import { useState } from "react";
import { entrarLista } from "@/lib/avaliacoes";

export default function ListaEmail() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setAEnviar(true);
    const r = await entrarLista(email.trim());
    setAEnviar(false);
    if (r) setErro(r); else setOk(true);
  };
  if (ok) return <p className="text-[13px] uppercase tracking-[.12em] text-tinta">Obrigada! Já estás na lista.</p>;
  return (
    <form onSubmit={enviar}>
      <div className="flex border border-tinta">
        <label htmlFor="lista-email" className="sr-only">Email</label>
        <input id="lista-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O TEU EMAIL" autoComplete="email"
          className="h-[52px] min-w-0 flex-1 bg-white px-4 text-[14px] tracking-[.08em] outline-none placeholder:text-tinta/45" />
        <button disabled={aEnviar} className="bg-tinta px-6 text-[12px] font-medium uppercase tracking-[.16em] text-white transition-colors hover:bg-choco disabled:opacity-50 sm:px-10">
          {aEnviar ? "…" : "Subscrever"}
        </button>
      </div>
      {erro && <p role="alert" className="mt-2 text-[13px] text-choco">{erro}</p>}
    </form>
  );
}
