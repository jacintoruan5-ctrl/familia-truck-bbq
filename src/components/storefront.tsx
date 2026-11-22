'use client';

import Image from 'next/image';
import {
  ArrowRight, Check, ChevronRight, Cookie, CupSoda, createLucideIcon,
  Drumstick, Flame, MapPin, Minus, Pizza, Plus, Sandwich, ShoppingBag, TicketPercent, Truck, Utensils, X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { brandName } from '../data/brand';
import { categories, featured, formatPrice, offerCode, products, type Category } from '../data/menu';
import { Brand, CinematicHero } from './cinematic-hero';

const Fries = createLucideIcon('Fries', [
  ['path', { d: 'M4 10h4c.5 1.2 2 2 4 2s3.5-.8 4-2h4l-2 11H6L4 10Z', key: 'carton' }],
  ['path', { d: 'm5 10-1-5 3-.5 1.5 6m1.5 0V3h3v8m2 0 1.5-6 3 .8-1 4.2', key: 'potatoes' }],
]);
const categoryIcons = { burgers: Sandwich, fries: Fries, pizza: Pizza, drinks: CupSoda, chicken: Drumstick, desserts: Cookie };
// Keep the existing storage key so customers retain their carts after the rename.
const cartKey = 'burger-hub-cart';
type Cart = Partial<Record<Category, number>>;

export function Storefront() {
  const [category, setCategory] = useState<Category | 'all' | 'popular'>('popular');
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [discount, setDiscount] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const catalogHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const saved: Cart = JSON.parse(localStorage.getItem(cartKey) ?? '{}');
      const valid: Cart = {};
      for (const { id, price } of products) {
        const quantity = saved?.[id] ?? 0;
        if (price !== undefined && Number.isInteger(quantity) && quantity > 0) valid[id] = Math.min(quantity, 99);
      }
      setCart(valid);
    } catch { /* Storage is optional. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* Keep the in-memory cart. */ }
    }
  }, [cart, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function changeQuantity(id: Category, amount: number) {
    const product = products.find((item) => item.id === id);
    if (!product?.price) return;
    const current = cart[id] ?? 0;
    if (amount > 0 && current >= 99) return;
    setCart((previous) => {
      const next = { ...previous };
      const quantity = Math.min(99, (next[id] ?? 0) + amount);
      if (quantity > 0) next[id] = quantity;
      else delete next[id];
      return next;
    });
    if (amount > 0) setNotice(`${product.name} · ${current + 1} no saco`);
    if (amount < 0 && current === 1) {
      const panel = dialog.current;
      requestAnimationFrame(() => {
        if (panel?.open && !panel.contains(document.activeElement)) {
          panel.querySelector<HTMLButtonElement>('.quantity button, .cart-heading button')?.focus();
        }
      });
    }
  }

  function openCart() {
    dialog.current?.showModal();
  }

  function selectCategory(id: Category, fromPointer: boolean) {
    setCategory(category === id ? 'popular' : id);
    const heading = catalogHeading.current;
    if (fromPointer && heading && matchMedia('(max-width: 639px)').matches && heading.getBoundingClientRect().bottom > window.innerHeight * 0.65) {
      heading.scrollIntoView({ block: 'start' });
    }
  }

  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = products.reduce((total, p) => total + (p.price ?? 0) * (cart[p.id] ?? 0), 0);
  const savings = discount ? Math.round(subtotal * 0.2) : 0;
  const visible = products.filter((p) => category === 'all' || (category === 'popular' ? p.price !== undefined : p.id === category));
  const categoryName = categories.find((item) => item.id === category)?.name;

  return (
    <>
      <a className="skip-link" href="#conteudo">Saltar para o conteúdo</a>
      <main id="conteudo" tabIndex={-1}>
        <CinematicHero
          count={count}
          onOrder={() => { changeQuantity(featured.id, 1); openCart(); }}
          onOpenCart={openCart}
          onViewMenu={() => setCategory('all')}
        />

        <section className="service-strip container" aria-label={`Serviços e destaques da ${brandName}`}>
          <div className="service-inner">
            <div><span className="service-icon"><Flame size={23} aria-hidden="true" /></span><strong>Preparado na grelha</strong><p>Carne grelhada e brioche tostado.</p></div>
            <a href="#menu" onClick={() => setCategory('all')}><span className="service-icon"><Utensils size={21} aria-hidden="true" /></span><strong>Menu completo</strong><p>Hambúrgueres, acompanhamentos e sobremesas.</p></a>
            <a href="#ofertas"><span className="service-icon"><TicketPercent size={22} aria-hidden="true" /></span><strong>Oferta de boas-vindas</strong><p>Desconto no primeiro pedido de demonstração.</p></a>
            <div><span className="service-icon"><Truck size={22} aria-hidden="true" /></span><strong>Entrega ao domicílio</strong><p>Escolhe os teus pratos no menu.</p></div>
          </div>
        </section>

        <section className="menu-section" id="menu" aria-labelledby="menu-title">
          <div className="container catalog">
            <div className="section-heading">
              <h2 id="menu-title" ref={catalogHeading} aria-live="polite">{categoryName ?? (category === 'all' ? 'Menu completo' : 'Os mais pedidos')}</h2>
              <span className="section-rule" aria-hidden="true"><Utensils size={15} /></span>
            </div>
            <div className="category-grid" role="group" aria-label="Filtrar menu por categoria">
              {categories.map(({ id, name, description }) => {
                const Icon = categoryIcons[id];
                return <button type="button" key={id} className="category" aria-pressed={category === id} onClick={(event) => selectCategory(id, event.detail > 0)}>
                  <Icon size={18} strokeWidth={1.7} aria-hidden="true" /><strong>{name}</strong><small className="sr-only">{description}</small>
                </button>;
              })}
            </div>
            <div className="product-grid">
              {visible.map((product) => (
                <article className="product-card" key={product.id}>
                  <Image className="product-image" src={`/images/${product.id}.webp`} alt={product.imageAlt} width={512} height={512} sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw" />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-bottom">
                      {product.price !== undefined ? <>
                        <strong>{formatPrice(product.price)}</strong>
                        <button type="button" className="button button--primary square-button" aria-label={`Adicionar ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={20} aria-hidden="true" /></button>
                      </> : <span className="product-unavailable">Preço por confirmar</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="catalog-action">
              <button type="button" className="button button--outline" onClick={() => setCategory(category === 'all' ? 'popular' : 'all')}>
                {category === 'all' ? 'Ver mais pedidos' : 'Ver menu completo'} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-title">
          <div className="container about-inner">
            <div className="about-photo">
              <Image src="/images/grill-editorial.webp" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="about-copy">
              <h2 id="about-title">À volta da grelha.</h2>
              <p>O clássico da casa junta carne grelhada, cheddar derretido e vegetais frescos num brioche tostado. À mesa também há espaço para pizzas de legumes, frango crocante e batatas com peri peri.</p>
              <a className="button button--primary" href="#menu" onClick={() => setCategory('all')}>Explorar o menu <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="delivery-section" id="ofertas" aria-labelledby="delivery-title">
          <div className="container delivery-banner">
            <Image className="delivery-image" src="/images/delivery.webp" alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" />
            <div className="delivery-copy">
              <h2 id="delivery-title"><em>20% de desconto</em><br />no primeiro pedido.</h2>
              <p>Experimenta o código no saco de demonstração.</p>
              <button className="button button--outline coupon" onClick={() => { setDiscount(true); openCart(); }}>
                <TicketPercent size={18} /> {offerCode} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contacto">
        <div className="container footer-band">
          <a href="#menu"><span className="service-icon"><Utensils size={20} aria-hidden="true" /></span><span><strong>Menu</strong><small>Explora os pratos</small></span></a>
          <a href="#ofertas"><span className="service-icon"><TicketPercent size={21} aria-hidden="true" /></span><span><strong>Ofertas</strong><small>Vê o cupão de boas-vindas</small></span></a>
          <button type="button" onClick={openCart}><span className="service-icon"><ShoppingBag size={20} aria-hidden="true" /></span><span><strong>O teu saco</strong><small>Consulta o pedido</small></span></button>
          <div><span className="service-icon"><MapPin size={21} aria-hidden="true" /></span><span><strong>Contacto</strong><small>Contactos por confirmar</small></span></div>
        </div>
        <div className="container footer-inner">
          <Brand />
          <nav aria-label="Navegação de rodapé"><a href="#menu">Menu</a><a href="#ofertas">Ofertas</a><a href="#sobre">Sobre nós</a></nav>
        </div>
        <div className="container footer-base"><span>© {brandName}</span><span>Menu e pedidos de demonstração</span></div>
      </footer>

      <dialog className="cart" ref={dialog} aria-labelledby="cart-title" onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}>
        <div className="cart-panel">
          <div className="cart-heading"><h2 id="cart-title">O teu saco</h2><button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Fechar saco"><X size={22} /></button></div>
          <p className="cart-demo">Saco de demonstração</p>
          {count === 0 ? <div className="cart-empty"><ShoppingBag size={35} /><p>O teu saco está vazio.</p>
            {discount && <p className="cart-empty-offer"><Check size={17} /> {offerCode} pronto a usar</p>}
            <a className="button button--primary" href="#menu" onClick={() => dialog.current?.close()}>Explorar menu</a></div> : <>
            <ul className="cart-list">
              {products.filter((p) => cart[p.id]).map((p) => <li key={p.id}>
                <Image src={`/images/${p.id}.webp`} alt="" width={56} height={56} />
                <div><strong>{p.name}</strong><small>{formatPrice(p.price! * cart[p.id]!)}</small></div>
                <div className="quantity">
                  <button className="icon-button" aria-label={`Retirar uma unidade de ${p.name}`} onClick={() => changeQuantity(p.id, -1)}><Minus size={16} /></button>
                  <span>{cart[p.id]}</span>
                  <button className="icon-button" aria-label={`Adicionar uma unidade de ${p.name}`} disabled={cart[p.id] === 99} onClick={() => changeQuantity(p.id, 1)}><Plus size={16} /></button>
                </div>
              </li>)}
            </ul>
            {discount && <p className="cart-discount"><Check size={17} /> {offerCode} aplicado <b>−{formatPrice(savings)}</b></p>}
            <div className="cart-total"><span>Total estimado</span><strong>{formatPrice(subtotal - savings)}</strong></div>
            <button className="button button--primary cart-continue" onClick={() => dialog.current?.close()}>Continuar a escolher</button>
          </>}
          <span className="sr-only" role="status">{count} artigos no saco</span>
        </div>
      </dialog>
      <div className="toast-region" role="status" aria-live="polite">{notice && <div className="toast"><Check size={19} /><span>{notice}</span></div>}</div>
    </>
  );
}
