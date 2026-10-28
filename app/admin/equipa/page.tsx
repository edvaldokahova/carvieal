"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FUNCOES, PERMISSOES, guardarFuncionario, listarEquipa, removerFuncionario, type Funcionario } from "@/lib/admin";
import { useAcesso } from "@/components/admin/AdminShell";
import { Titulo, caixaAdm } from "@/components/admin/ui";

const MAX = 5;
type Linha = Partial<Funcionario> & { _novo?: boolean };

export default function Equipa() {
  const a = useAcesso();
  const [lista, setLista] = useState<Linha[] | null>(null);
  const [msg, setMsg] = useState("");
  const carregar = () => listarEquipa().then(setLista);
  useEffect(() => { carregar(); }, []);

  if (!a.gerente) return <p className="text-[15px]">Só a gerência pode gerir a equipa.</p>;

  const mudar = (i: number, c: Partial<Funcionario>) => setLista((l) => (l ?? []).map((x, k) => (k === i ? { ...x, ...c } : x)));
  const togglePerm = (i: number, p: string) => {
    const atual = lista?.[i]?.permissoes ?? [];
    mudar(i, { permissoes: atual.includes(p) ? atual.filter((x) => x !== p) : [...atual, p] });
  };

  const guardar = async (f: Linha) => {
    if (!f.nome?.trim() || !/^\S+@\S+\.\S+$/.test(f.email ?? "")) return setMsg("Erro: indique o nome e um email válido.");
    if (!f.permissoes?.length) return setMsg("Erro: escolha pelo menos uma permissão.");
    const erro = await guardarFuncionario(f._novo ? null : f.id!, { nome: f.nome.trim(), email: f.email!, funcao: f.funcao ?? "", permissoes: f.permissoes, ativo: f.ativo ?? true });
    setMsg(erro ? `Erro: ${erro}` : f._novo ? `${f.nome} adicionada. Ela entra em /admin/entrar → «Criar acesso», com o email ${f.email}.` : "Alterações guardadas.");
    if (!erro) carregar();
  };

  const remover = async (f: Linha) => {
    if (f._novo) return setLista((l) => (l ?? []).filter((x) => x !== f));
    if (!window.confirm(`Remover ${f.nome} da equipa? Deixa de conseguir entrar no painel.`)) return;
    const erro = await removerFuncionario(f.id!);
    setMsg(erro ? `Erro: ${erro}` : "Removida da equipa.");
    if (!erro) carregar();
  };

  const cheia = (lista?.length ?? 0) >= MAX;

  return (
    <div className="max-w-4xl">
      <Titulo acao={<button disabled={cheia} onClick={() => setLista((l) => [...(l ?? []), { _novo: true, nome: "", email: "", funcao: FUNCOES[0].nome, permissoes: FUNCOES[0].permissoes, ativo: true }])} className="btn-choco !min-h-[44px] !px-5 text-[14px]"><Plus size={16} /> Adicionar funcionária</button>}>Equipa</Titulo>
      <p className="-mt-4 mb-6 text-[14px] text-tinta/60">
        Até {MAX} pessoas ({lista?.length ?? 0} de {MAX}). Cada uma só vê as secções que escolher. Depois de adicionar, a pessoa abre <b className="font-medium">/admin/entrar</b>, toca em «Criar acesso» e escolhe a senha com o mesmo email.
      </p>
      {msg && <p className="mb-4 text-[14px] text-choco">{msg}</p>}
      <div className="space-y-4">
        {(lista ?? []).map((f, i) => (
          <div key={f.id ?? `novo-${i}`} className={`${caixaAdm} p-5`}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="campo !py-2.5 text-[14px]" value={f.nome ?? ""} onChange={(e) => mudar(i, { nome: e.target.value })} placeholder="Nome" aria-label="Nome" />
              <input className="campo !py-2.5 text-[14px]" type="email" value={f.email ?? ""} onChange={(e) => mudar(i, { email: e.target.value })} placeholder="Email para entrar no painel" aria-label="Email" disabled={!f._novo && !!f.user_id} />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[13px] text-tinta/60">Função</p>
              <div className="flex flex-wrap gap-2">
                {FUNCOES.map((fn) => (
                  <button key={fn.nome} type="button" onClick={() => mudar(i, { funcao: fn.nome, permissoes: fn.permissoes })} className={`rounded-full border px-3.5 py-1.5 text-[13px] ${f.funcao === fn.nome ? "border-choco bg-choco text-marfim-claro" : "border-choco/20 hover:border-choco"}`}>{fn.nome}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {PERMISSOES.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-start gap-2.5 text-[14px]">
                  <input type="checkbox" checked={f.permissoes?.includes(p.id) ?? false} onChange={() => { togglePerm(i, p.id); mudar(i, { funcao: "Personalizada" }); }} className="mt-0.5 h-4 w-4 accent-[#4F2C1D]" />
                  <span>{p.nome}<span className="block text-[12px] text-tinta/50">{p.descricao}</span></span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-choco/10 pt-4 text-[13px]">
              <span className={f.user_id ? "text-[#2F5A1E]" : "text-tinta/55"}>{f._novo ? "Por guardar" : f.user_id ? "Acesso activo" : "Ainda não criou a senha"}</span>
              {!f._novo && <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={f.ativo ?? true} onChange={(e) => mudar(i, { ativo: e.target.checked })} className="h-4 w-4 accent-[#4F2C1D]" /> Pode entrar</label>}
              <div className="ml-auto flex gap-2">
                <button onClick={() => remover(f)} aria-label="Remover" className="p-2 text-tinta/45 hover:text-[#9b2c1d]"><Trash2 size={16} /></button>
                <button onClick={() => guardar(f)} className="btn-choco !min-h-[38px] !px-4 text-[13px]">Guardar</button>
              </div>
            </div>
          </div>
        ))}
        {lista && lista.length === 0 && <p className="text-[14px] text-tinta/55">Ainda não adicionou ninguém.</p>}
      </div>
    </div>
  );
}
