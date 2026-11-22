'use client';

import Image from 'next/image';
import { useEffect, useRef, type RefObject } from 'react';
import type { ScrollTrigger as ScrollController } from 'gsap/ScrollTrigger';

const posterSource = '/videos/burger-assembled-poster.webp';
const lastFrame = 62;
const frameWidth = 1280;
const frameHeight = 720;
const downloadLimit = 6;
const decodeLimit = 2;
const lookAhead = 9;
const lookBehind = 3;
const bitmapLimit = 1 + lookAhead + lookBehind;

function runSequence(canvas: HTMLCanvasElement, section: HTMLElement) {
  const renderingContext = canvas.getContext('2d', { alpha: false });
  if (!renderingContext || typeof createImageBitmap !== 'function') return;
  const context = renderingContext;
  const mobile = matchMedia('(max-width: 759px)');
  const bitmaps = new Map<number, ImageBitmap>();
  const compressed = new Map<number, Blob>();
  const downloading = new Set<number>();
  const decoding = new Set<number>();
  const failed = new Set<number>();
  const abort = new AbortController();
  const playhead = { frame: 0 };
  let controller: ScrollController | undefined;
  let visible = true;
  let disposed = false;
  let target = 0;
  let direction = 1;
  let painted = -1;
  let pending = 0;

  function frameWindow() {
    const frames = [target];
    for (let offset = 1; offset <= lookAhead; offset++) {
      const ahead = target + offset * direction;
      const behind = target - offset * direction;
      if (ahead >= 0 && ahead <= lastFrame) frames.push(ahead);
      if (offset <= lookBehind && behind >= 0 && behind <= lastFrame) frames.push(behind);
    }
    return frames.sort((a, b) => priority(a) - priority(b));
  }

  function priority(frame: number) {
    const offset = (frame - target) * direction;
    return offset < 0 ? lookAhead - offset : offset;
  }

  function canRender() {
    return !disposed && visible && !document.hidden;
  }

  function nearestFrame() {
    if (bitmaps.has(target)) return target;
    if (painted < 0) return painted;
    // Use the closest ready frame between the previous paint and the target.
    const step = Math.sign(target - painted);
    for (let offset = 1; offset <= 4; offset++) {
      const frame = target - offset * step;
      if ((frame - painted) * step <= 0) break;
      if (bitmaps.has(frame)) return frame;
    }
    return painted;
  }

  function schedulePaint() {
    if (!pending && canRender() && nearestFrame() !== painted) {
      pending = requestAnimationFrame(paint);
    }
  }

  function paint() {
    pending = 0;
    if (!canRender()) return;
    const frame = nearestFrame();
    if (frame === painted) return;
    const bitmap = bitmaps.get(frame);
    if (!bitmap) return;
    context.drawImage(bitmap, 0, 0);
    if (painted === -1) section.dataset.videoReady = '';
    painted = frame;
  }

  async function download(index: number) {
    downloading.add(index);
    try {
      const name = String(index).padStart(2, '0');
      const response = await fetch(`/videos/hero-frames/${name}.webp`, { signal: abort.signal });
      if (!response.ok) throw new Error(`Frame request failed: ${response.status}`);
      const blob = await response.blob();
      if (!disposed) compressed.set(index, blob);
    } catch {
      if (!disposed) failed.add(index);
    } finally {
      downloading.delete(index);
      fillWindow();
    }
  }

  async function decode(index: number, blob: Blob) {
    decoding.add(index);
    try {
      const bitmap = await createImageBitmap(blob);
      if (disposed || !frameWindow().includes(index)) {
        bitmap.close();
        return;
      }
      bitmaps.set(index, bitmap);
      if (bitmaps.size > bitmapLimit) {
        let evict = index;
        for (const frame of bitmaps.keys()) {
          if (priority(frame) > priority(evict)) evict = frame;
        }
        bitmaps.get(evict)?.close();
        bitmaps.delete(evict);
      }
      schedulePaint();
    } catch {
      if (!disposed) failed.add(index);
    } finally {
      decoding.delete(index);
      fillWindow();
    }
  }

  function fillWindow() {
    if (!canRender()) return;
    const wanted = frameWindow();
    for (const index of wanted) {
      if (bitmaps.has(index) || failed.has(index)) continue;
      const bytes = compressed.get(index);
      if (bytes && decoding.size < decodeLimit && !decoding.has(index)) {
        void decode(index, bytes);
      } else if (!bytes && downloading.size < downloadLimit && !downloading.has(index)) {
        void download(index);
      }
    }
  }

  function updateTarget() {
    const next = Math.round(playhead.frame);
    if (target === next) return;
    direction = Math.sign(next - target);
    target = next;
    schedulePaint();
    fillWindow();
  }
  function resume() {
    schedulePaint();
    fillWindow();
  }

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume();
  });
  visibility.observe(section);
  document.addEventListener('visibilitychange', resume);

  function stop() {
    if (disposed) return;
    disposed = true;
    visibility.disconnect();
    document.removeEventListener('visibilitychange', resume);
    cancelAnimationFrame(pending);
    controller?.kill();
    abort.abort();
    for (const bitmap of bitmaps.values()) bitmap.close();
    bitmaps.clear();
    compressed.clear();
    section.removeAttribute('data-video-ready');
  }

  async function prepare() {
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger'),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      controller = ScrollTrigger.create({
        animation: gsap.to(playhead, { frame: lastFrame, duration: 1, ease: 'none', paused: true, onUpdate: updateTarget }),
        trigger: section,
        pin: section.offsetHeight <= window.innerHeight + 2,
        start: 'top top',
        end: () => '+=' + Math.round(mobile.matches
          ? Math.max(1120, section.clientHeight * 1.60)
          : Math.max(1480, section.clientHeight * 1.85)),
        scrub: 0.18,
      });
      resume();
    } catch {
      stop();
    }
  }

  fillWindow();
  void prepare();
  return stop;
}

export function BurgerScene({ stage }: { stage: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const section = stage.current;
    if (!element || !section) return;

    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let cleanup: (() => void) | undefined;

    function syncPreference() {
      cleanup?.();
      if (element && section && motion.matches && !connection?.saveData) {
        cleanup = runSequence(element, section);
      }
    }

    motion.addEventListener('change', syncPreference);
    syncPreference();
    return () => {
      motion.removeEventListener('change', syncPreference);
      cleanup?.();
    };
  }, [stage]);

  return (
    <div className="hero-media" aria-hidden="true">
      <Image src={posterSource} alt="" fill sizes="(max-width: 767px) 100vw, 75vw" fetchPriority="high" loading="eager" />
      <canvas ref={canvas} width={frameWidth} height={frameHeight} />
    </div>
  );
}
