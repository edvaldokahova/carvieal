"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

export default function Entrar() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [aEnviar, setAEnviar] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (senha.length < 8) return setMsg("A senha precisa de pelo menos 8 caracteres.");
    setAEnviar(true);
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      setAEnviar(false);
      if (error) return setMsg("Email ou senha incorrectos.");
      router.replace("/admin");
    } else {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: senha });
      setAEnviar(false);
      if (error) return setMsg(error.message.includes("registered") ? "Este email já tem conta. Use «Entrar»." : error.message);
      if (data.session) router.replace("/admin");
      else setMsg("Conta criada. Abra o email que lhe enviámos para confirmar e depois entre aqui.");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-marfim px-5">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto h-7 w-auto" />
        <h1 className="mt-10 text-center font-display text-[30px] text-choco">{modo === "entrar" ? "Entrar no painel" : "Primeiro acesso"}</h1>
        {modo === "criar" && <p className="mt-2 text-center text-[14px] text-tinta/60">Use o email que a gerência registou para si em Equipa.</p>}
        <form onSubmit={enviar} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="rotulo">Email</label>
            <input id="email" type="email" className="campo" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="senha" className="rotulo">{modo === "entrar" ? "Senha" : "Escolha uma senha"}</label>
            <input id="senha" type="password" className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete={modo === "entrar" ? "current-password" : "new-password"} required />
          </div>
          {msg && <p role="alert" className="text-[14px] text-choco">{msg}</p>}
          <button disabled={aEnviar} className="btn-choco w-full">{aEnviar ? "Um momento…" : modo === "entrar" ? "Entrar" : "Criar a minha senha"}</button>
        </form>
        <button onClick={() => { setModo(modo === "entrar" ? "criar" : "entrar"); setMsg(""); }} className="mt-6 w-full text-center text-[14px] text-tinta/65 hover:text-choco">
          {modo === "entrar" ? "É funcionária e ainda não tem senha? Criar acesso" : "Já tem senha? Entrar"}
        </button>
      </div>
    </div>
  );
}
