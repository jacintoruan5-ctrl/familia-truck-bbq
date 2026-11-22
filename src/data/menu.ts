export const categories = [
  { id: 'burgers', name: 'Hambúrgueres', description: 'Pão tostado e queijo' },
  { id: 'fries', name: 'Batatas', description: 'Douradas e crocantes' },
  { id: 'pizza', name: 'Pizzas', description: 'Diretas do forno' },
  { id: 'drinks', name: 'Bebidas', description: 'Bem frescas' },
  { id: 'chicken', name: 'Frango', description: 'Panado e crocante' },
  { id: 'desserts', name: 'Sobremesas', description: 'Para acabar em doce' },
] as const;

export type Category = typeof categories[number]['id'];

interface Product {
  id: Category;
  name: string;
  description: string;
  imageAlt: string;
  price?: number;
}

export const products: readonly Product[] = [
  { id: 'burgers', name: 'The Lab Burger', description: 'Carne grelhada, cheddar, alface, tomate e molho da casa.', imageAlt: 'Hambúrguer com brioche de sésamo, cheddar, tomate e alface', price: 549 },
  { id: 'pizza', name: 'Veggie Supreme Pizza', description: 'Legumes, mozzarella e ervas italianas.', imageAlt: 'Pizza de legumes com mozzarella e manjericão', price: 899 },
  { id: 'chicken', name: 'Crispy Chicken Strips', description: 'Tiras de frango crocantes com molho para mergulhar.', imageAlt: 'Tiras de frango panadas e douradas', price: 599 },
  { id: 'fries', name: 'Peri Peri Fries', description: 'Batatas douradas com tempero peri peri.', imageAlt: 'Batatas fritas com tempero peri peri num tabuleiro de papel', price: 299 },
  { id: 'drinks', name: 'Cola com gelo', description: 'Servida bem fria.', imageAlt: 'Copo de cola com gelo' },
  { id: 'desserts', name: 'Brownie de chocolate', description: 'Brownie com gelado de baunilha e molho de chocolate.', imageAlt: 'Brownie de chocolate com gelado de baunilha' },
];

export const featured = products[0];
export const offerCode = 'WELCOME20';
export const formatPrice = (cents: number) => new Intl.NumberFormat('pt-PT', {
  style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol',
}).format(cents / 100);
