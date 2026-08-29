'use client';

import { useEffect, useRef, useState } from 'react';

const frames = [
  '/frames/image_03.jpg',
  '/frames/image_02.jpg',
  '/frames/image_04.jpg',
  '/frames/image_05.jpg',
  '/frames/image_06.jpg',
  '/frames/image_07.jpg',
  '/frames/image_08.jpg',
  '/frames/image_09.jpg',
  '/frames/image_10.jpg',
  '/frames/image_11.jpg',
];

export default function Home() {
  const sequenceRef = useRef<HTMLElement>(null);
  const ticking = useRef(false);
  const [frame, setFrame] = useState(0);
  const [blend, setBlend] = useState(0);
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
      setBlend(baseFrame === frames.length - 1 ? 0 : exactFrame - baseFrame);
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

  const nextFrame = Math.min(frames.length - 1, frame + 1);
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
            <img src={frames[nextFrame]} alt="" style={{ opacity: blend }} />
          </div>
          <div className="portrait-frame" aria-live="off">
            <img src={frames[frame]} alt="Chocolala chocolate and date tower assembling as you scroll" />
            <img src={frames[nextFrame]} alt="" style={{ opacity: blend }} />
          </div>
          <div className="stage-shade" />

          <div className="intro-copy" style={{ opacity: beginningOpacity }}>
            <p className="eyebrow">A signature creation</p>
            <h1>Every detail<br />finds its place.</h1>
            <p className="scroll-instruction"><span className="scroll-line" />Scroll to assemble</p>
          </div>

          <div className="final-copy" style={{ opacity: finishingOpacity }}>
            <p className="eyebrow">Perfectly composed</p>
            <h2>The Date Tower</h2>
            <p>Hand-selected dates. Fine chocolate.<br />One unforgettable centrepiece.</p>
            <a href="https://chocolala.org/" target="_blank" rel="noreferrer">Explore Chocolala <span aria-hidden="true">↗</span></a>
          </div>

          <div className="sequence-meter" aria-hidden="true">
            <span>01</span><div><i style={{ transform: `scaleX(${progress})` }} /></div><span>11</span>
          </div>
        </div>
      </section>

      <section id="story" className="story-section">
        <p className="eyebrow">The art of gifting</p>
        <h2>Made to be<br /><em>remembered.</em></h2>
        <p className="story-body">A sculptural celebration of textures, flavours and craft—assembled one exquisite piece at a time.</p>
        <a className="story-link" href="#top">Experience it again <span>↑</span></a>
      </section>

      <footer><span>CHOCOLALA</span><span>Luxury chocolate &amp; dates</span><span>UAE</span></footer>
    </main>
  );
}
