// «Detalhes do produto»: texto (parágrafos separados por linha em branco)
// + «Características» (uma por linha, no formato «Nome: valor»).
export default function DetalhesProduto({ descricao, caracteristicas }: { descricao: string; caracteristicas: string }) {
  const paragrafos = descricao.split(/\n\s*\n|\n/).map((t) => t.trim()).filter(Boolean);
  const linhas = caracteristicas.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-3">
      {paragrafos.map((t, i) => <p key={i}>{t}</p>)}
      {linhas.length > 0 && (
        <>
          <p className="pt-2 font-medium text-tinta">Características:</p>
          <ul className="space-y-1.5">
            {linhas.map((l, i) => {
              const k = l.indexOf(":");
              return (
                <li key={i}>
                  {k > 0 ? <><span className="text-tinta">{l.slice(0, k + 1)}</span>{l.slice(k + 1)}</> : l}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
