# Família Truck BBQ

O sistema visual parte da fotografia de cozinha à noite da referência. O vídeo e as imagens mostram o produto de perto. O marfim e a brasa deixam claras as transições e as ações.

## Tokens e tipografia

| Papel | Valor |
| --- | --- |
| Fundo | `--color-bg`, `#100e0c` |
| Superfície | `--color-surface`, `#1b1814` |
| Texto | `--color-text`, `#f8f1e8` |
| Faixa clara | `--color-paper`, `#f5ebdf` |
| Laranja de ação | `--color-primary`, `#fa851e` |
| Texto sobre laranja ou marfim | `--color-ink`, `#21160e` |

Allura identifica a marca. Inter dá forma ao título do Hero e serve também o texto corrido, os preços e os controlos. Georgia estabelece a hierarquia editorial das restantes secções.

## Composição e componentes

- `.container` alinha navegação, catálogo e rodapé. A largura máxima é 1232 px. `--edge` e `--space-section` ajustam margens e intervalos à largura disponível.
- `.button` é a base reutilizável. `.button--primary` indica a ação principal e `.button--outline` indica uma ação secundária. Os controlos têm pelo menos 44 px de altura e um anel de foco visível.
- A faixa de serviços usa marfim, círculos escuros e separadores. O catálogo usa cartões de fotografia com proporção 5:4. A faixa de navegação e contacto usa laranja com texto escuro.
- O Hero centra o hambúrguer entre o texto à esquerda e o cartão de produto à direita em desktop. Em telemóvel, a imagem fica acima do texto e o cartão abaixo das ações. A navegação móvel usa um menu expansível.
- A entrada do Hero e a fotografia da grelha usam movimento breve. O vídeo responde à posição de scroll e pode ser visto como fotograma estático com movimento reduzido ou poupança de dados.

A fotografia editorial da grelha foi gerada com ImageGen e preparada em WebP em `public/images/grill-editorial.webp`. O pedido visual foi um hambúrguer a sair de uma grelha de ferro numa espátula, com brioche tostado, vapor e luz âmbar numa cozinha escura, sem marcas ou texto.
