# Família Truck BBQ

Website responsivo em Next.js, TypeScript e Tailwind CSS. Requer Node.js 20.9 ou superior.

```sh
npm ci
npm run dev
```

Abre [localhost:3000](http://localhost:3000). Para verificar os tipos, usa `npm run typecheck`. Para servir a versão de produção, executa `npm run build` e depois `npm start`.

## Menu e pedidos

O catálogo está em `src/data/menu.ts`. Os quatro preços em USD e a campanha WELCOME20 vêm da referência visual. O carrinho guarda as quantidades neste navegador e calcula a oferta em modo de demonstração. Bebidas e sobremesas aparecem com preço por confirmar. Para receber pedidos reais, é preciso fornecer o catálogo e os contactos definitivos e ligar o carrinho ao canal de encomendas.

## Hero

O Hero usa 63 fotogramas individuais em WebP, extraídos do vídeo original entre 3,50 e 6,125 s. Os fotogramas em `public/videos/hero-frames/` mantêm a resolução original de 1280 × 720 em todos os ecrãs.

O GSAP ScrollTrigger fixa o Hero quando a secção cabe no ecrã e interpola o progresso do scroll. A sequência começa com o hambúrguer montado, abre ao descer e fecha ao subir. O carregamento e a descodificação têm filas separadas. Os WebP comprimidos são reutilizados ao inverter o scroll e a descodificação dá prioridade aos próximos fotogramas na direção do movimento. O hambúrguer montado aparece durante o carregamento e com movimento reduzido ou poupança de dados. Em ecrãs grandes, a área útil da animação é limitada às dimensões nativas e fundida no fundo com gradientes CSS.

O sistema visual e os componentes reutilizáveis estão descritos em `DESIGN.md`. As fontes Allura e Barlow Condensed são servidas localmente e as respectivas licenças estão em `public/fonts/`.

## Imagens

As fotografias do catálogo e da entrega em `public/images/` foram preparadas com a ferramenta imagegen integrada:

- **Catálogo:** seis fotografias para hambúrguer, pizza, frango panado, batatas, cola e brownie, com fundos escuros e luz editorial âmbar.
- **Entrega:** saco de papel kraft e caixa de hambúrguer numa bancada escura, com luz cobre e espaço livre para o texto.
