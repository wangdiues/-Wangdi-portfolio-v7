import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled, { keyframes, css } from 'styled-components';
import { withPrefix } from 'gatsby';
import { Layout } from '@components';
import { usePrefersReducedMotion } from '@hooks';

const IMAGES = [
  'FB_IMG_1343123537148313029.jpg',
  'FB_IMG_1717953694678933410.jpg',
  'FB_IMG_1767277303216.jpg',
  'FB_IMG_1772460282070.jpg',
  'FB_IMG_1772460352159.jpg',
  'FB_IMG_1772460986741.jpg',
  'FB_IMG_1772460995282.jpg',
  'FB_IMG_1772461002598.jpg',
  'FB_IMG_1772461012364.jpg',
  'FB_IMG_1772461029670.jpg',
  'FB_IMG_1772461032955.jpg',
  'FB_IMG_1772461042319.jpg',
  'FB_IMG_1772461050325.jpg',
  'FB_IMG_1772461052947.jpg',
  'FB_IMG_1772461061605.jpg',
  'FB_IMG_1772461071812.jpg',
  'FB_IMG_2992331926967076181.jpg',
  'FB_IMG_3129677369276556777.jpg',
  'FB_IMG_3349306116838487353.jpg',
  'FB_IMG_5147352463128233676.jpg',
  'FB_IMG_5709250295833179563.jpg',
  'FB_IMG_5816322693780937056.jpg',
  'FB_IMG_6175297709211037040.jpg',
  'FB_IMG_7334813338938230187.jpg',
  'FB_IMG_7407087828112269316.jpg',
  'FB_IMG_7444807213143393354.jpg',
  'FB_IMG_7913367842923587300.jpg',
  'FB_IMG_7966588469327882744.jpg',
  'FB_IMG_8037715989370687531.jpg',
  'FB_IMG_8461036346354499884.jpg',
  'IMG-20251018-WA0006.jpg',
  'IMG-20260103-WA0016.jpg',
  'IMG-20260103-WA0018.jpg',
  'W2 (1).jpg',
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const headerReveal = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const titleShine = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const kenBurns = keyframes`
  from { transform: scale(1.04); }
  to { transform: scale(1.12); }
`;

const gridReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(26px) scale(0.96);
    filter: saturate(0.75);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: saturate(1);
  }
`;

const lightboxPop = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// ── Page Shell ──────────────────────────────────────────────────────────────

const StyledPage = styled.main`
  padding-top: var(--nav-height);
  min-height: 100vh;
  max-width: none;
  background: linear-gradient(135deg, rgba(121, 182, 160, 0.08) 0%, transparent 36%),
    linear-gradient(225deg, rgba(216, 168, 91, 0.08) 0%, transparent 34%),
    linear-gradient(180deg, var(--dark-navy) 0%, #0b1a16 44%, var(--navy) 100%);
  isolation: isolate;

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ── Header ───────────────────────────────────────────────────────────────────

const PageHeader = styled.header`
  position: relative;
  padding: clamp(54px, 8vw, 88px) 40px clamp(36px, 6vw, 60px);
  overflow: hidden;
  animation: ${headerReveal} 0.8s var(--easing) both;

  &::before {
    content: '';
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(156, 207, 99, 0.5),
      rgba(216, 168, 91, 0.45),
      transparent
    );
  }

  @media (max-width: 768px) {
    padding-right: 22px;
    padding-left: 22px;

    &::before {
      left: 22px;
      right: 22px;
    }
  }
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 330px);
  gap: clamp(28px, 6vw, 88px);
  align-items: end;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Eyebrow = styled.p`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin: 0 0 18px;
`;

const PageTitle = styled.h1`
  margin: 0 0 14px;
  max-width: 900px;
  font-size: clamp(56px, 11vw, 132px);
  font-weight: 600;
  color: var(--lightest-slate);
  line-height: 0.88;
  letter-spacing: 0;

  em {
    font-style: normal;
    color: transparent;
    background: linear-gradient(90deg, var(--green), var(--blue), var(--pink), var(--green));
    background-size: 220% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    animation: ${titleShine} 7s linear infinite alternate;
  }
`;

const PageSubtitle = styled.p`
  max-width: 540px;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  line-height: 1.7;
  margin: 0;
`;

const HeaderStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const HeaderStat = styled.div`
  min-height: 104px;
  padding: 18px;
  border: 1px solid rgba(183, 196, 186, 0.12);
  border-radius: 8px;
  background: rgba(14, 31, 26, 0.5);
  box-shadow: 0 18px 42px rgba(3, 10, 8, 0.22);
  backdrop-filter: blur(10px);

  strong {
    display: block;
    color: var(--white);
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1;
    margin-bottom: 10px;
  }

  span {
    display: block;
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &:nth-child(2) {
    border-color: rgba(216, 168, 91, 0.18);
    transform: translateY(18px);
  }

  @media (max-width: 820px) {
    max-width: 520px;

    &:nth-child(2) {
      transform: translateY(0);
    }
  }
`;

// ── Slideshow ────────────────────────────────────────────────────────────────

const SlideshowSection = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: clamp(440px, 78vh, 860px);
  padding: 0;
  overflow: hidden;
  background: var(--navy);
  cursor: zoom-in;
  animation: ${fadeIn} 0.8s 0.2s var(--easing) both;
  box-shadow: 0 38px 90px rgba(3, 10, 8, 0.4);

  /* Subtle film-grain texture overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    background-repeat: repeat;
    pointer-events: none;
    z-index: 6;
    opacity: 0.6;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 18px;
    z-index: 4;
    border: 1px solid rgba(217, 226, 218, 0.12);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: clamp(420px, 68vh, 680px);

    &::before {
      inset: 10px;
    }
  }
`;

const SlidesContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const Slide = styled.div`
  position: absolute;
  inset: -2%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: scale(1.04);
  transition: opacity 1.2s ease;
  will-change: opacity, transform;

  ${({ $active, $motion }) =>
    $active &&
    !$motion &&
    css`
      animation: ${kenBurns} 9s ease-out both;
    `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(4, 12, 9, 0.72), transparent 36%, rgba(4, 12, 9, 0.2)),
      linear-gradient(180deg, rgba(4, 12, 9, 0.15), rgba(4, 12, 9, 0.45));
  }
`;

const GradientTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140px;
  background: linear-gradient(to bottom, rgba(8, 20, 16, 0.88), transparent);
  z-index: 3;
  pointer-events: none;
`;

const GradientBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 220px;
  background: linear-gradient(to top, rgba(8, 20, 16, 0.94), transparent);
  z-index: 3;
  pointer-events: none;
`;

const NavArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 24px;' : 'right: 24px;')}
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(14, 31, 26, 0.68);
  border: 1px solid rgba(217, 226, 218, 0.18);
  color: var(--lightest-slate);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 34px rgba(3, 10, 8, 0.32);
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: rgba(156, 207, 99, 0.16);
    border-color: var(--green);
    color: var(--green);
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
    left: ${({ $left }) => ($left ? '12px' : 'auto')};
    right: ${({ $left }) => ($left ? 'auto' : '12px')};
  }
`;

const SlideInfoBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  padding: 20px clamp(20px, 4vw, 54px) 34px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 600px) {
    padding: 16px 18px 20px;
  }
`;

const SlideCaption = styled.p`
  max-width: min(560px, 62vw);
  color: rgba(217, 226, 218, 0.84);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0;

  @media (max-width: 600px) {
    max-width: 58vw;
  }
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 8px 10px;
  border: 1px solid rgba(217, 226, 218, 0.12);
  border-radius: 999px;
  background: rgba(4, 12, 9, 0.42);
  backdrop-filter: blur(10px);
`;

const PlayBtn = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(156, 207, 99, 0.1);
  border: 1px solid rgba(156, 207, 99, 0.24);
  border-radius: 50%;
  color: var(--green);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, background 0.2s ease;
  line-height: 1;

  &:hover {
    transform: scale(1.08);
    background: rgba(156, 207, 99, 0.18);
  }

  &:disabled {
    cursor: default;
    opacity: 0.45;
    transform: none;
  }
`;

const SlideCounter = styled.span`
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 1px;
  white-space: nowrap;
`;

// ── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressTrack = styled.div`
  height: 3px;
  background: rgba(39, 69, 59, 0.68);
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--green), var(--blue), var(--pink));
  transition: width 0.7s ease;
  box-shadow: 0 0 22px rgba(156, 207, 99, 0.34);
`;

// ── Thumbnail Strip ───────────────────────────────────────────────────────────

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px clamp(16px, 3vw, 34px);
  overflow-x: auto;
  background: rgba(8, 20, 16, 0.86);
  border-bottom: 1px solid rgba(217, 226, 218, 0.08);
  scrollbar-width: thin;
  scrollbar-color: var(--green) var(--light-navy);

  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-track {
    background: var(--light-navy);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--green);
    border-radius: 2px;
  }
`;

const ThumbBtn = styled.button`
  flex: 0 0 auto;
  width: 84px;
  height: 62px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${({ $active }) => ($active ? 'var(--green)' : 'rgba(217, 226, 218, 0.1)')};
  background: var(--light-navy);
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${({ $active }) => ($active ? 1 : 0.52)};
    transform: scale(${({ $active }) => ($active ? 1.04 : 1)});
    transition: opacity 0.2s ease, transform 0.35s ease;
  }

  &:hover {
    border-color: rgba(156, 207, 99, 0.7);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);

    img {
      opacity: 1;
      transform: scale(1.06);
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: 0 0 0 1px var(--green), 0 6px 20px rgba(156, 207, 99, 0.2);
    `}
`;

// ── Photo Grid ───────────────────────────────────────────────────────────────

const GridSection = styled.section`
  padding: clamp(62px, 8vw, 104px) 40px clamp(82px, 10vw, 128px);
  max-width: 1480px;
  margin: 0 auto;
  animation: ${fadeIn} 1s 0.4s ease both;

  @media (max-width: 768px) {
    padding: 48px 18px 64px;
  }
`;

const GridHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 34px;

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

const GridTitle = styled.h2`
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  color: var(--lightest-slate);
  margin: 0;
`;

const GridCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-flow: dense;
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const GridItem = styled.button`
  position: relative;
  grid-column: span ${({ $variant }) => ($variant === 'wide' ? 6 : $variant === 'tall' ? 3 : 4)};
  aspect-ratio: ${({ $variant }) =>
    $variant === 'wide' ? '16 / 10' : $variant === 'tall' ? '3 / 4' : '1 / 1'};
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(217, 226, 218, 0.1);
  padding: 0;
  cursor: zoom-in;
  background: var(--light-navy);
  display: block;
  box-shadow: 0 18px 42px rgba(3, 10, 8, 0.2);
  opacity: ${({ $motion }) => ($motion ? 1 : 0)};
  ${({ $motion, $delay }) =>
    $motion
      ? css`
          animation: none;
        `
      : css`
          animation: ${gridReveal} 0.72s var(--easing) both;
          animation-delay: ${$delay}ms;
        `}
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.9) contrast(1.02);
    transition: transform 0.65s var(--easing), filter 0.35s ease;
  }

  &:hover {
    border-color: rgba(156, 207, 99, 0.55);
    box-shadow: 0 24px 58px rgba(3, 10, 8, 0.32), 0 0 0 1px rgba(156, 207, 99, 0.18);
    transform: translateY(-4px);
  }

  &:hover img {
    transform: scale(1.08);
    filter: saturate(1.08) contrast(1.05);
  }

  &:hover > span {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--green);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    grid-column: span ${({ $variant }) => ($variant === 'wide' ? 6 : 3)};
  }

  @media (max-width: 480px) {
    grid-column: span 1;
    aspect-ratio: 1 / 1;
  }
`;

const GridOverlay = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 20, 16, 0.1), rgba(8, 20, 16, 0.76)),
    rgba(8, 20, 16, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &::after {
    content: '+';
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(156, 207, 99, 0.45);
    border-radius: 50%;
    background: rgba(8, 20, 16, 0.54);
    font-size: 26px;
    font-weight: 300;
    color: var(--green);
    line-height: 1;
  }
`;

// ── Lightbox ─────────────────────────────────────────────────────────────────

const LightboxPortal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease both;
`;

const LightboxBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(4, 12, 9, 0.97);
  backdrop-filter: blur(12px);
`;

const LightboxImg = styled.div`
  position: relative;
  z-index: 1;
  max-width: min(92vw, 1100px);
  max-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 88vh;
    object-fit: contain;
    border-radius: 3px;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
    display: block;
    animation: ${lightboxPop} 0.3s var(--easing) both;
  }
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 22px;
  right: 28px;
  z-index: 2;
  background: none;
  border: none;
  color: var(--slate);
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--lightest-slate);
    transform: rotate(90deg);
  }
`;

const LightboxArrow = styled.button`
  position: fixed;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 18px;' : 'right: 18px;')}
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(14, 31, 26, 0.5);
  border: 1px solid rgba(156, 207, 99, 0.2);
  color: var(--lightest-slate);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(156, 207, 99, 0.12);
    border-color: var(--green);
    color: var(--green);
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 26px;
    left: ${({ $left }) => ($left ? '8px' : 'auto')};
    right: ${({ $left }) => ($left ? 'auto' : '8px')};
  }
`;

const LightboxFooter = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const LightboxCounter = styled.p`
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  margin: 0;
`;

const LightboxCaption = styled.p`
  color: var(--dark-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`;

// ── Component ─────────────────────────────────────────────────────────────────

const N = IMAGES.length;
const getGridVariant = idx => {
  if (idx % 11 === 0 || idx % 11 === 6) {
    return 'wide';
  }
  if (idx % 7 === 0 || idx % 7 === 4) {
    return 'tall';
  }
  return 'square';
};

const GalleryPage = ({ location }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbStripRef = useRef(null);

  const imgPath = filename => withPrefix(`/images/ghallery/${encodeURIComponent(filename)}`);
  const getCaption = idx => `DFO Sarpang field and office archive, Bhutan - photo ${idx + 1}`;

  // Only load background-image for current ± 1 to avoid mass-fetching
  const shouldLoad = idx => {
    const prev = (current - 1 + N) % N;
    const next = (current + 1) % N;
    return idx === current || idx === prev || idx === next;
  };

  const goPrev = () => setCurrent(c => (c - 1 + N) % N);
  const goNext = () => setCurrent(c => (c + 1) % N);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || lightboxOpen || prefersReducedMotion) {
      return;
    }
    const id = setInterval(() => setCurrent(c => (c + 1) % N), 5000);
    return () => clearInterval(id);
  }, [isPlaying, lightboxOpen, prefersReducedMotion]);

  useEffect(() => {
    setIsPlaying(!prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') {
        setCurrent(c => (c - 1 + N) % N);
      }
      if (e.key === 'ArrowRight') {
        setCurrent(c => (c + 1) % N);
      }
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbStripRef.current) {
      return;
    }
    const active = thumbStripRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [current]);

  return (
    <Layout location={location}>
      <Helmet title="Gallery" />

      <StyledPage>
        {/* ── Header ── */}
        <PageHeader>
          <HeaderInner>
            <div>
              <Eyebrow>Personal Archive</Eyebrow>
              <PageTitle>
                Field <em>Gallery</em>
              </PageTitle>
              <PageSubtitle>
                Memories from Divisional Forest Office, Sarpang &middot; Bhutan
              </PageSubtitle>
            </div>

            <HeaderStats aria-label="Gallery summary">
              <HeaderStat>
                <strong>{N}</strong>
                <span>Photographs</span>
              </HeaderStat>
              <HeaderStat>
                <strong>Bhutan</strong>
                <span>Field archive</span>
              </HeaderStat>
            </HeaderStats>
          </HeaderInner>
        </PageHeader>

        {/* ── Slideshow ── */}
        <SlideshowSection
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => {
            if (!prefersReducedMotion) {
              setIsPlaying(true);
            }
          }}
          onClick={() => setLightboxOpen(true)}
          aria-label="Photo slideshow">
          <SlidesContainer>
            {IMAGES.map((img, idx) => (
              <Slide
                key={img}
                $active={idx === current}
                $motion={prefersReducedMotion}
                style={{
                  backgroundImage: shouldLoad(idx) ? `url("${imgPath(img)}")` : 'none',
                }}
              />
            ))}
          </SlidesContainer>

          <GradientTop />
          <GradientBottom />

          <NavArrow
            $left
            onClick={e => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo">
            &#8249;
          </NavArrow>

          <NavArrow
            onClick={e => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo">
            &#8250;
          </NavArrow>

          <SlideInfoBar>
            <SlideCaption>{getCaption(current)}</SlideCaption>
            <SlideControls>
              <PlayBtn
                onClick={e => {
                  e.stopPropagation();
                  setIsPlaying(p => !p);
                }}
                disabled={prefersReducedMotion}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}>
                {isPlaying ? '⏸' : '▶'}
              </PlayBtn>
              <SlideCounter>
                {String(current + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </SlideCounter>
            </SlideControls>
          </SlideInfoBar>
        </SlideshowSection>

        {/* ── Progress Bar ── */}
        <ProgressTrack>
          <ProgressFill style={{ width: `${((current + 1) / N) * 100}%` }} />
        </ProgressTrack>

        {/* ── Thumbnail Strip ── */}
        <ThumbnailStrip ref={thumbStripRef}>
          {IMAGES.map((img, idx) => (
            <ThumbBtn
              key={img}
              $active={idx === current}
              data-active={idx === current}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to photo ${idx + 1}`}>
              <img src={imgPath(img)} alt={`Thumbnail for ${getCaption(idx)}`} loading="lazy" />
            </ThumbBtn>
          ))}
        </ThumbnailStrip>

        {/* ── Photo Grid ── */}
        <GridSection>
          <GridHeader>
            <GridTitle>All Memories</GridTitle>
            <GridCount>{N} photographs</GridCount>
          </GridHeader>

          <PhotoGrid>
            {IMAGES.map((img, idx) => (
              <GridItem
                key={img}
                $variant={getGridVariant(idx)}
                $delay={(idx % 12) * 45}
                $motion={prefersReducedMotion}
                onClick={() => {
                  setCurrent(idx);
                  setLightboxOpen(true);
                }}
                aria-label={`Open ${getCaption(idx)} in viewer`}>
                <img src={imgPath(img)} alt={getCaption(idx)} loading="lazy" />
                <GridOverlay />
              </GridItem>
            ))}
          </PhotoGrid>
        </GridSection>
      </StyledPage>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <LightboxPortal role="dialog" aria-modal="true" aria-label="Photo viewer">
          <LightboxBackdrop onClick={() => setLightboxOpen(false)} />

          <LightboxImg>
            <img key={current} src={imgPath(IMAGES[current])} alt={getCaption(current)} />
          </LightboxImg>

          <LightboxClose onClick={() => setLightboxOpen(false)} aria-label="Close viewer">
            &times;
          </LightboxClose>

          <LightboxArrow $left onClick={goPrev} aria-label="Previous photo">
            &#8249;
          </LightboxArrow>

          <LightboxArrow onClick={goNext} aria-label="Next photo">
            &#8250;
          </LightboxArrow>

          <LightboxFooter>
            <LightboxCounter>
              {current + 1} / {N}
            </LightboxCounter>
            <LightboxCaption>{getCaption(current)}</LightboxCaption>
          </LightboxFooter>
        </LightboxPortal>
      )}
    </Layout>
  );
};

GalleryPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default GalleryPage;
