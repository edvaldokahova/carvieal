"use client";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { listarLista } from "@/lib/avaliacoes";
import { caixaAdm } from "./ui";

// Emails deixados no rodapé da loja («Junte-se à lista»).
export default function ListaEmailsAdm() {
  const [lista, setLista] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [msg, setMsg] = useState("");
  useEffect(() => { listarLista().then(setLista).catch(() => {}); }, []);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(lista.map((l) => l.email).join(", ")); setMsg("Copiados. Cole no campo «Bcc» do seu email."); } catch { setMsg("Não foi possível copiar."); }
  };
  return (
    <section className={`${caixaAdm} mt-10 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium">Lista de emails ({lista.length})</h2>
          <p className="text-[13px] text-tinta/55">Clientes que pediram para receber novidades e promoções.</p>
        </div>
        {lista.length > 0 && <button onClick={copiar} className="btn-linha !min-h-[40px] !px-4 text-[13px]"><Copy size={15} /> Copiar todos</button>}
      </div>
      {msg && <p className="mt-3 text-[13px] text-choco">{msg}</p>}
      {lista.length > 0 && (
        <ul className="mt-4 max-h-72 divide-y divide-choco/10 overflow-y-auto border-t border-choco/10 text-[14px]">
          {lista.map((l) => <li key={l.id} className="py-2.5">{l.email}</li>)}
        </ul>
      )}
    </section>
  );
}
