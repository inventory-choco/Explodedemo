const sequence = document.querySelector('.sequence');
const productFrame = document.querySelector('#product-frame');
const ambientFrame = document.querySelector('#ambient-frame');
const introCopy = document.querySelector('#intro-copy');
const finalCopy = document.querySelector('#final-copy');
const meterFill = document.querySelector('#meter-fill');
const meterEnd = document.querySelector('#meter-end');

let frames = [];
let currentFrame = -1;
let targetFrame = 0;
let targetProgress = 0;
let animating = false;
let scrollScheduled = false;

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
  scrollScheduled = false;
  if (!frames.length) return;
  const rect = sequence.getBoundingClientRect();
  const distance = sequence.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / distance));
  targetProgress = progress;
  targetFrame = Math.min(frames.length - 1, Math.round(progress * (frames.length - 1)));
  if (!animating) {
    animating = true;
    requestAnimationFrame(animateFrames);
  }
}

function animateFrames() {
  if (currentFrame !== targetFrame) {
    currentFrame += currentFrame < targetFrame ? 1 : -1;
    productFrame.src = frames[currentFrame];
    ambientFrame.src = frames[currentFrame];
  }

  introCopy.style.opacity = Math.max(0, 1 - targetProgress * 4.5);
  finalCopy.style.opacity = Math.max(0, Math.min(1, (targetProgress - 0.73) * 5));
  meterFill.style.transform = 'scaleX(' + targetProgress + ')';

  if (currentFrame !== targetFrame) {
    requestAnimationFrame(animateFrames);
  } else {
    animating = false;
  }
}

function requestUpdate() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateSequence);
  }
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

  await Promise.all(frames.map(src => new Promise(resolve => {
    const image = new Image();
    image.onload = async () => {
      try { await image.decode(); } catch {}
      resolve();
    };
    image.onerror = resolve;
    image.src = src;
  })));
  sequence.style.height = Math.max(650, frames.length * 24) + 'vh';
  meterEnd.textContent = String(frames.length).padStart(2, '0');
  currentFrame = 0;
  productFrame.src = frames[0];
  ambientFrame.src = frames[0];
  updateSequence();
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
initializeSequence();
