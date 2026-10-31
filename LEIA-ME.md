# Carvieal — loja online de joias em prata 925

Loja: catálogo, carrinho, finalização com escolha de pagamento, rastreio da encomenda e painel de gestão com equipa (até 5 pessoas).

## Pôr a funcionar (uma vez)

1. **Supabase partilhado** → SQL Editor → correr `supabase/001_carvieal.sql` (cria loja, tabelas, regras e funções).
2. Authentication → Users → *Add user* com o email da Carla (marcar *Auto Confirm*). Depois editar o email em `supabase/002_ligar_gerente.sql` e correr.
3. **Avaliações e lista de emails:** correr `supabase/004_avaliacoes.sql` (uma vez).
4. **Entrega grátis automática:** correr `supabase/005_entrega_gratis.sql` (uma vez). O valor mínimo muda-se no painel, em Definições › Formas de entrega.
5. **Embalagem especial para presente:** correr `supabase/006_estojo_presente.sql` (uma vez). Cria 2 estojos em Produtos no painel: «Estojo de presente para anel» e «Estojo de presente para brincos, colares e pulseiras» — aí mudam-se o preço, a foto e o stock. Não aparecem no catálogo; são oferecidos na página de cada peça (anéis → estojo de anel; o resto → o outro), no carrinho e em /presente. Para deixar de oferecer um, desativá-lo ou pôr o stock a 0.
4. Opcional: `supabase/003_produtos_exemplo.sql` para ver a loja com 4 peças de exemplo (apagar depois no painel).
5. **Vercel** → *Add New → Project* → importar `carvieal` → em *Environment Variables* pôr:
   - `NEXT_PUBLIC_SUPABASE_URL` (o mesmo dos outros projectos)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (a mesma chave pública dos outros projectos)
   - `NEXT_PUBLIC_SITE_URL` (opcional, o domínio final)
6. Painel: `/admin/entrar`.

## Onde mudar cada coisa

| Quero mudar… | Onde |
|---|---|
| Produtos, preços, stock, fotos, opções (tamanhos) | Painel → Produtos |
| Categorias (novas a qualquer momento) | Painel → Categorias |
| Estado das encomendas + aviso por WhatsApp | Painel → Encomendas |
| Funcionárias e o que cada uma pode ver | Painel → Equipa (só gerência) |
| Formas/taxas de entrega, foto e texto do topo, IBAN/instruções de pagamento, redes | Painel → Definições (só gerência) |
| Número de WhatsApp, nome da dona, slogan | `lib/marca.ts` |
| Activar o pagamento imediato (referência / Express) | `lib/marca.ts` → `PAGAMENTO_IMEDIATO_ATIVO` (quando a API estiver integrada) |
| Avaliações das clientes (publicar, esconder, apagar) | Painel → Avaliações |
| Emails de quem pediu novidades | Painel → Clientes (fim da página) |
| Vídeo do topo | Painel → Definições → Vídeo de fundo (link .mp4). O vídeo actual está em `public/video/hero.mp4` |
| Perguntas frequentes | `lib/faq.ts` |
| Termos e privacidade | `app/(loja)/termos`, `app/(loja)/privacidade` |

## Como funciona uma encomenda

1. A cliente finaliza → escolhe «Concluir pelo WhatsApp» → a encomenda fica **Pendente** e o stock é reservado.
2. Abre o WhatsApp da loja (930 746 575) com o código, as peças e o total; envia o comprovativo.
3. No painel: Confirmada → Em preparação → Enviada → Entregue. Cada passo tem o botão «Avisar cliente» (WhatsApp com a mensagem pronta e o link de rastreio).
4. Cancelar devolve o stock automaticamente.
5. A cliente acompanha em `/acompanhar` (código + telefone).

## Equipa

A gerência adiciona nome + email + função em Equipa. A funcionária abre `/admin/entrar` → «Criar acesso» com esse email. Permissões: Encomendas, Produtos e categorias, Clientes. Equipa e Definições são só da gerência. Tudo é verificado no Supabase (RLS), não só no ecrã.

## Fotografias

Produtos: links do ImgBB, vertical 4:5 (ex.: 1080 × 1350). As imagens da marca (topo, categorias, embalagem) estão em `public/img`.

## Avaliações

Qualquer cliente avalia uma peça (1 a 5 estrelas, nome, telefone e comentário). Se o telefone for o de uma encomenda **entregue** com essa peça, a avaliação é publicada logo com «Compra verificada». As outras ficam pendentes em Painel → Avaliações. O telefone nunca aparece no site. Cada número só avalia cada peça uma vez.
