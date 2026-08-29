const frames = [
  'image_03.jpg', 'image_02.jpg', 'image_04.jpg', 'image_05.jpg', 'image_06.jpg',
  'image_07.jpg', 'image_08.jpg', 'image_09.jpg', 'image_10.jpg', 'image_11.jpg'
].map(name => `./public/frames/${name}`);

const sequence = document.querySelector('.sequence');
const productFrame = document.querySelector('#product-frame');
const ambientFrame = document.querySelector('#ambient-frame');
const introCopy = document.querySelector('#intro-copy');
const finalCopy = document.querySelector('#final-copy');
const meterFill = document.querySelector('#meter-fill');
let currentFrame = -1;
let ticking = false;

frames.forEach(src => { const image = new Image(); image.src = src; });

function updateSequence() {
  const rect = sequence.getBoundingClientRect();
  const distance = sequence.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / distance));
  const frameIndex = Math.min(frames.length - 1, Math.round(progress * (frames.length - 1)));

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;
    productFrame.src = frames[frameIndex];
    ambientFrame.src = frames[frameIndex];
  }

  introCopy.style.opacity = Math.max(0, 1 - progress * 4.5);
  finalCopy.style.opacity = Math.max(0, Math.min(1, (progress - 0.73) * 5));
  meterFill.style.transform = `scaleX(${progress})`;
  ticking = false;
}

function requestUpdate() {
  if (!ticking) { ticking = true; requestAnimationFrame(updateSequence); }
}

updateSequence();
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
