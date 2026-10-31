"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, X } from "lucide-react";
import { useCarrinho } from "@/lib/carrinho";
import { kz, soDigitos } from "@/lib/formato";
import { PAGAMENTO_IMEDIATO_ATIVO } from "@/lib/marca";
import { clienteGuardado, criarEncomenda, guardarLocal, lembrarCliente } from "@/lib/encomendas";
import type { Entrega } from "@/lib/tipos";
import Foto from "./Foto";
import WaIcone from "./WaIcone";

export default function Finalizar({ entregas, gratisAcima = 0 }: { entregas: Entrega[]; gratisAcima?: number }) {
  const { itens, subtotal, limpar } = useCarrinho();
  const router = useRouter();
  const [f, setF] = useState({ nome: "", telefone: "", email: "", localizacao: "", endereco: "", referencia: "", modalidade: entregas[0]?.nome ?? "", notas: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [escolha, setEscolha] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const g = clienteGuardado();
    setF((x) => ({ ...x, nome: g.nome ?? "", telefone: g.telefone ?? "", email: g.email ?? "", localizacao: g.localizacao ?? "", endereco: g.endereco ?? "", referencia: g.referencia ?? "" }));
    setMontado(true);
  }, []);

  const ent = entregas.find((e) => e.nome === f.modalidade);
  const gratis = gratisAcima > 0 && subtotal >= gratisAcima;
  const taxa = gratis ? 0 : ent?.taxa ?? 0;
  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setErros((e) => ({ ...e, [k]: "" })); };

  const validar = () => {
    const e: Record<string, string> = {};
    if (f.nome.trim().length < 2) e.nome = "Indica o teu nome.";
    if (soDigitos(f.telefone).length < 9) e.telefone = "Indica um número com 9 dígitos.";
    if (f.localizacao.trim().length < 2) e.localizacao = "Indica o município ou bairro.";
    if (f.endereco.trim().length < 4) e.endereco = "Indica a rua, o número ou o condomínio.";
    if (entregas.length && !ent) e.modalidade = "Escolhe a forma de entrega.";
    setErros(e);
    if (Object.keys(e).length) {
      document.getElementById(`campo-${Object.keys(e)[0]}`)?.focus();
      return false;
    }
    return true;
  };

  const concluirWhatsApp = async () => {
    setAEnviar(true);
    setErroGeral("");
    const r = await criarEncomenda({
      cliente: { nome: f.nome.trim(), telefone: f.telefone, email: f.email.trim() },
      entrega: { localizacao: f.localizacao.trim(), endereco: f.endereco.trim(), referencia: f.referencia.trim(), modalidade: f.modalidade },
      metodo: "whatsapp",
      notas: f.notas.trim(),
      itens: itens.map((i) => ({ produto_id: i.produtoId, quantidade: i.quantidade, opcoes: i.opcoes })),
    });
    if (!r.ok) {
      setErroGeral(r.erro);
      setAEnviar(false);
      return;
    }
    const tel = soDigitos(f.telefone);
    lembrarCliente({ nome: f.nome, telefone: f.telefone, email: f.email, localizacao: f.localizacao, endereco: f.endereco, referencia: f.referencia });
    guardarLocal(r.dados.codigo, tel);
    limpar();
    router.push(`/encomenda/${r.dados.codigo}?t=${tel}&nova=1`);
  };

  if (montado && itens.length === 0 && !aEnviar) {
    return (
      <div className="caixa py-28 text-center">
        <h1 className="titulo text-[36px]">O teu carrinho está vazio.</h1>
        <Link href="/loja" className="btn-choco mt-8">Ver a coleção</Link>
      </div>
    );
  }

  // Função (não componente) para os inputs não perderem o foco ao escrever.
  const campo = (id: keyof typeof f, rotulo: string, children: React.ReactNode, opcional = false) => (
    <div>
      <label htmlFor={`campo-${id}`} className="rotulo">{rotulo}{opcional && <span className="text-tinta/45"> (opcional)</span>}</label>
      {children}
      {erros[id] && <p className="mt-1.5 text-[13px] text-[#9b2c1d]">{erros[id]}</p>}
    </div>
  );

  return (
    <div className="caixa pb-24 pt-10 sm:pt-14">
      <h1 className="titulo text-[38px] sm:text-[52px]">Finalizar encomenda</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <form onSubmit={(e) => { e.preventDefault(); if (validar()) setEscolha(true); }} noValidate className="space-y-12">
          <section className="space-y-5">
            <h2 className="font-display text-[24px] text-choco">Os teus dados</h2>
            {campo("nome", "Nome completo", <input id="campo-nome" className="campo" value={f.nome} onChange={(e) => set("nome", e.target.value)} autoComplete="name" maxLength={80} />)}
            <div className="grid gap-5 sm:grid-cols-2">
              {campo("telefone", "Telefone (WhatsApp)", <input id="campo-telefone" className="campo" value={f.telefone} onChange={(e) => set("telefone", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="9XX XXX XXX" maxLength={20} />)}
              {campo("email", "Email", <input id="campo-email" type="email" className="campo" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" maxLength={120} />, true)}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-display text-[24px] text-choco">Entrega</h2>
            {campo("localizacao", "Município e bairro", <input id="campo-localizacao" className="campo" value={f.localizacao} onChange={(e) => set("localizacao", e.target.value)} placeholder="Ex.: Talatona, Benfica" maxLength={80} />)}
            {campo("endereco", "Endereço", <input id="campo-endereco" className="campo" value={f.endereco} onChange={(e) => set("endereco", e.target.value)} autoComplete="street-address" placeholder="Rua, número da casa ou condomínio e apartamento" maxLength={160} />)}
            {campo("referencia", "Ponto de referência", <input id="campo-referencia" className="campo" value={f.referencia} onChange={(e) => set("referencia", e.target.value)} placeholder="Ex.: ao lado da farmácia" maxLength={120} />, true)}
            {entregas.length > 0 && (
              <fieldset>
                <legend className="rotulo">Forma de entrega</legend>
                <div id="campo-modalidade" tabIndex={-1} className="divide-y divide-choco/15 border border-choco/20 bg-white">
                  {entregas.map((e) => (
                    <label key={e.nome} className="flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-avela-pale/60">
                      <input type="radio" name="modalidade" className="mt-1 h-4 w-4 accent-[#4F2C1D]" checked={f.modalidade === e.nome} onChange={() => set("modalidade", e.nome)} />
                      <span className="flex-1">
                        <span className="block text-[15px]">{e.nome}</span>
                        <span className="block text-[13px] text-tinta/60">{e.descricao}</span>
                      </span>
                      <span className="text-[14px] tabular-nums">{e.taxa > 0 ? (gratis ? <><s className="mr-1.5 text-tinta/40">{kz(e.taxa)}</s>Grátis</> : kz(e.taxa)) : "A combinar"}</span>
                    </label>
                  ))}
                </div>
                {erros.modalidade && <p className="mt-1.5 text-[13px] text-[#9b2c1d]">{erros.modalidade}</p>}
              </fieldset>
            )}
            {campo("notas", "Observações", <textarea id="campo-notas" rows={3} className="campo resize-none" value={f.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Ex.: é para oferta, horário preferido de entrega" maxLength={500} />, true)}
          </section>

          <div className="lg:hidden">{resumo()}</div>
          <button type="submit" className="btn-choco w-full">Finalizar encomenda</button>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-28">{resumo()}</div>
        </aside>
      </div>

      {escolha && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="titulo-pagamento">
          <button type="button" aria-label="Fechar" onClick={() => !aEnviar && setEscolha(false)} className="absolute inset-0 animate-fade bg-tinta/45" />
          <div className="relative w-full max-w-lg animate-sobe bg-marfim-claro p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">
            <button type="button" onClick={() => !aEnviar && setEscolha(false)} aria-label="Fechar" className="absolute right-3 top-3 grid h-11 w-11 place-items-center text-choco"><X size={20} strokeWidth={1.5} /></button>
            <h2 id="titulo-pagamento" className="font-display text-[28px] text-choco">Como preferes pagar?</h2>
            <p className="mt-1 text-[14px] text-tinta/65">Total a pagar: <b className="font-medium text-tinta">{kz(subtotal + taxa)}</b></p>

            <div className="mt-6 space-y-3">
              <div className={`border p-5 ${PAGAMENTO_IMEDIATO_ATIVO ? "border-choco/25" : "border-choco/10 bg-avela-pale/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[16px]">Pagar agora</p>
                    <p className="mt-1 text-[13px] text-tinta/60">Por referência ou Multicaixa Express, com confirmação imediata.</p>
                  </div>
                  {!PAGAMENTO_IMEDIATO_ATIVO && <span className="flex shrink-0 items-center gap-1 text-[12px] text-tinta/55"><Clock size={13} /> Em breve</span>}
                </div>
              </div>

              <div className="border border-choco p-5">
                <p className="text-[16px]">Concluir pelo WhatsApp</p>
                <p className="mt-1 text-[13px] text-tinta/65">Registamos a encomenda e preparamos a mensagem para o WhatsApp da Carvieal, com o resumo já escrito. Depois é só enviar o comprovativo de pagamento na conversa.</p>
                <button type="button" onClick={concluirWhatsApp} disabled={aEnviar} className="btn-wa mt-4 w-full">
                  <WaIcone /> {aEnviar ? "A registar a encomenda…" : "Concluir pelo WhatsApp"}
                </button>
              </div>
            </div>
            {erroGeral && <p role="alert" className="mt-4 text-[14px] text-[#9b2c1d]">{erroGeral}</p>}
          </div>
        </div>
      )}
    </div>
  );

  function resumo() {
    return (
      <div className="border border-choco/15 bg-marfim p-5 sm:p-7">
        <h2 className="font-display text-[22px] text-choco">Resumo</h2>
        <ul className="mt-5 space-y-4">
          {itens.map((i) => (
            <li key={i.chave} className="flex gap-4">
              <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-avela-pale">
                <Foto src={i.imagem} alt={i.nome} sizes="64px" />
              </div>
              <div className="min-w-0 flex-1 text-[14px]">
                <p className="leading-snug">{i.nome}</p>
                <p className="text-[13px] text-tinta/55">
                  {[...Object.entries(i.opcoes).map(([k, v]) => `${k}: ${v}`), `Qtd. ${i.quantidade}`].join(", ")}
                </p>
              </div>
              <span className="text-[14px] tabular-nums">{kz(i.preco * i.quantidade)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-choco/15 pt-5 text-[14px]">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{kz(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Entrega</dt><dd className="tabular-nums">{ent ? (taxa > 0 ? kz(taxa) : gratis && ent.taxa > 0 ? "Grátis" : "A combinar") : "—"}</dd></div>
          <div className="flex items-baseline justify-between border-t border-choco/15 pt-3"><dt className="text-[15px]">Total</dt><dd className="font-display text-[26px] text-choco">{kz(subtotal + taxa)}</dd></div>
        </dl>
      </div>
    );
  }
}
