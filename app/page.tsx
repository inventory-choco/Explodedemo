'use client';

import { useEffect, useRef, useState } from 'react';

const frames = Array.from(
  { length: 31 },
  (_, index) => `/IMAGES/frame_${String(index + 1).padStart(4, '0')}.jpg`,
);

export default function Home() {
  const sequenceRef = useRef<HTMLElement>(null);
  const ticking = useRef(false);
  const [frame, setFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    frames.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const update = () => {
      const section = sequenceRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance));
      const exactFrame = nextProgress * (frames.length - 1);
      const baseFrame = Math.min(frames.length - 1, Math.floor(exactFrame));
      setFrame(baseFrame);
      setProgress(nextProgress);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const beginningOpacity = Math.max(0, 1 - progress * 4.5);
  const finishingOpacity = Math.max(0, Math.min(1, (progress - 0.73) * 5));

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Chocolala home">CHOCOLALA</a>
        <span className="header-note">An edible composition</span>
        <a className="discover-link" href="#story">Discover</a>
      </header>

      <section id="top" ref={sequenceRef} className="sequence" aria-label="Chocolate tower assembly">
        <div className="stage">
          <div className="frame-layer frame-blur" aria-hidden="true">
            <img src={frames[frame]} alt="" />
          </div>
          <div className="portrait-frame" aria-live="off">
            <img src={frames[frame]} alt="Chocolala chocolate and date tower assembling as you scroll" />
          </div>
          <div className="stage-shade" />

          <div className="intro-copy" style={{ opacity: beginningOpacity }}>
            <p className="eyebrow">The world of Chocolala</p>
            <h1>Happiness<br />handmade.</h1>
            <p className="scroll-instruction"><span className="scroll-line" />Scroll to assemble</p>
          </div>

          <div className="final-copy" style={{ opacity: finishingOpacity }}>
            <p className="eyebrow">Handmade in Chocolala</p>
            <h2>Luxury Arrangements</h2>
            <p>The finest of luxury handmade chocolates,<br />cakes, sweets and ice cream.</p>
            <a href="https://chocolala.org/" target="_blank" rel="noreferrer">Explore Chocolala <span aria-hidden="true">↗</span></a>
          </div>

          <div className="sequence-meter" aria-hidden="true">
            <span>01</span><div><i style={{ transform: `scaleX(${progress})` }} /></div><span>{frames.length}</span>
          </div>
        </div>
      </section>

      <section id="story" className="story-section">
        <p className="eyebrow">We made for you</p>
        <h2>From the heart of<br /><em>our chefs.</em></h2>
        <p className="story-body">Each and every one of our beautiful chocolate creations is handmade to the height of luxury.</p>
        <a className="story-link" href="#top">Experience it again <span>↑</span></a>
      </section>

      <footer><span>CHOCOLALA</span><span>Luxury chocolate &amp; dates</span><span>UAE</span></footer>
    </main>
  );
}
