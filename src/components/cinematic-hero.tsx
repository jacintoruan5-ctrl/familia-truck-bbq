'use client';

import Image from 'next/image';
import { ArrowRight, Flame, Menu, ShoppingBag } from 'lucide-react';
import { useRef } from 'react';
import { brandName } from '../data/brand';
import { featured, formatPrice } from '../data/menu';
import { BurgerScene } from './burger-scene';

interface HeroProps {
  count: number;
  onOrder: () => void;
  onOpenCart: () => void;
  onViewMenu: () => void;
}

const links = [
  ['#menu', 'Menu'], ['#sobre', 'Sobre nós'], ['#ofertas', 'Ofertas'], ['#contacto', 'Contacto'],
] as const;

export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label={`${brandName}, início`} translate="no">
      <Flame size={20} aria-hidden="true" />
      <span>{brandName}</span>
    </a>
  );
}

export function CinematicHero({ count, onOrder, onOpenCart, onViewMenu }: HeroProps) {
  const stage = useRef<HTMLElement>(null);
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  return (
    <div id="inicio">
    <section className="hero" ref={stage} aria-labelledby="hero-title">
      <BurgerScene stage={stage} />
      <header className="hero-header container">
        <Brand />
        <nav className="hero-nav" aria-label="Navegação principal">
          <a href="#inicio" aria-current="page">Início</a>
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="hero-tools">
          <button className="button button--primary bag-button" type="button" onClick={onOpenCart} aria-label={`Abrir saco, ${count} artigos`}>
            <ShoppingBag size={17} aria-hidden="true" /><span>O teu saco</span><b>{count}</b>
          </button>
          <details className="mobile-menu" ref={mobileMenu} onKeyDown={(event) => {
            if (event.key === 'Escape' && mobileMenu.current?.open) {
              mobileMenu.current.open = false;
              mobileMenu.current.querySelector('summary')?.focus();
            }
          }}>
            <summary aria-label="Navegação principal"><Menu size={22} aria-hidden="true" /></summary>
            <nav aria-label="Navegação móvel">
              {links.map(([href, label]) => <a key={href} href={href} onClick={() => { if (mobileMenu.current) mobileMenu.current.open = false; }}>{label}</a>)}
            </nav>
          </details>
        </div>
      </header>

      <div className="hero-body container">
        <div className="hero-copy" lang="en">
          <h1 id="hero-title">Built in the lab.<br /><em>Grilled for the night.</em></h1>
          <div className="hero-rule" aria-hidden="true"><Flame size={17} /></div>
          <p>Toasted brioche, melted cheddar and grilled beef. Scroll to explore The Lab Burger layer by layer.</p>
          <div className="hero-actions">
            <button className="button button--primary" type="button" onClick={onOrder}>Order The Lab Burger <ArrowRight size={17} aria-hidden="true" /></button>
            <a className="button button--outline" href="#menu" onClick={onViewMenu}>View full menu</a>
          </div>
        </div>
        <aside className="hero-product" aria-labelledby="hero-product-title">
          <div className="hero-product-summary">
            <Image src={`/images/${featured.id}.webp`} alt="" width={48} height={48} />
            <div>
              <h2 id="hero-product-title">{featured.name}</h2>
              {featured.price !== undefined && <span className="hero-product-price">{formatPrice(featured.price)}</span>}
            </div>
          </div>
          <p>{featured.description}</p>
          <button className="button button--primary" type="button" onClick={onOrder}><ShoppingBag size={16} aria-hidden="true" /> Adicionar ao saco</button>
        </aside>
      </div>

    </section>
    </div>
  );
}
