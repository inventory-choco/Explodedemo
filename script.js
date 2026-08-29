const sequence = document.querySelector('.sequence');
const productFrame = document.querySelector('#product-frame');
const ambientFrame = document.querySelector('#ambient-frame');
const introCopy = document.querySelector('#intro-copy');
const finalCopy = document.querySelector('#final-copy');
const meterFill = document.querySelector('#meter-fill');
const meterEnd = document.querySelector('#meter-end');

let frames = [];
let currentFrame = -1;
let ticking = false;

const frameNumber = name => Number(name.match(/frame_(\d+)\.jpg$/i)?.[1] || 0);

async function loadFramesFromGitHub() {
  const response = await fetch('https://api.github.com/repos/inventory-choco/Explodedemo/contents/IMAGES', {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!response.ok) throw new Error('GitHub image listing was unavailable');
  const files = await response.json();
  return files
    .filter(file => file.type === 'file' && /^frame_\d+\.jpg$/i.test(file.name))
    .sort((a, b) => frameNumber(a.name) - frameNumber(b.name))
    .map(file => './IMAGES/' + file.name);
}

function imageExists(src) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src + '?probe=' + Date.now();
  });
}

async function discoverConsecutiveFrames() {
  const discovered = [];
  for (let number = 1; number <= 9999; number += 1) {
    const name = 'frame_' + String(number).padStart(4, '0') + '.jpg';
    const src = './IMAGES/' + name;
    if (!(await imageExists(src))) break;
    discovered.push(src);
  }
  return discovered;
}

function updateSequence() {
  if (!frames.length) { ticking = false; return; }
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
  meterFill.style.transform = 'scaleX(' + progress + ')';
  ticking = false;
}

function requestUpdate() {
  if (!ticking) { ticking = true; requestAnimationFrame(updateSequence); }
}

async function initializeSequence() {
  try {
    frames = await loadFramesFromGitHub();
  } catch {
    frames = await discoverConsecutiveFrames();
  }

  if (!frames.length) {
    productFrame.alt = 'No animation frames found in the IMAGES folder.';
    return;
  }

  frames.forEach(src => { const image = new Image(); image.src = src; });
  meterEnd.textContent = String(frames.length).padStart(2, '0');
  currentFrame = -1;
  updateSequence();
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
initializeSequence();
