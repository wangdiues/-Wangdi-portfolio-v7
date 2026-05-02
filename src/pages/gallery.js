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

// Subtle per-photo rotations for the scattered-prints effect
const ROTATIONS = [-1.8, 0.0, 1.2, -0.6, 1.6, 0.0, -1.4, 0.8, -1.2, 1.5, 0.0, -0.9];
const getRotation = idx => ROTATIONS[idx % ROTATIONS.length];

// ─── Keyframes ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const headerReveal = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const titleShine = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const kenBurns = keyframes`
  from { transform: scale(1.04); }
  to   { transform: scale(1.13); }
`;

const captionUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const counterPop = keyframes`
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
`;

const gridReveal = keyframes`
  from {
    opacity: 0;
    transform: rotate(var(--rot)) translateY(30px) scale(0.94);
    filter: saturate(0.6);
  }
  to {
    opacity: 1;
    transform: rotate(var(--rot)) translateY(0) scale(1);
    filter: saturate(1);
  }
`;

const lbSlideForward = keyframes`
  from { opacity: 0; transform: translateX(30px) scale(0.985); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
`;

const lbSlideBackward = keyframes`
  from { opacity: 0; transform: translateX(-30px) scale(0.985); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
`;

const lightboxFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Page Shell ──────────────────────────────────────────────────────────────

const StyledPage = styled.main`
  padding-top: var(--nav-height);
  min-height: 100vh;
  max-width: none;
  background: linear-gradient(155deg, rgba(121, 182, 160, 0.06) 0%, transparent 30%),
    linear-gradient(205deg, rgba(201, 162, 39, 0.05) 0%, transparent 28%),
    linear-gradient(180deg, var(--dark-navy) 0%, #091410 50%, var(--navy) 100%);
  isolation: isolate;
  overflow-x: hidden;

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─── Header ──────────────────────────────────────────────────────────────────

const PageHeader = styled.header`
  position: relative;
  padding: clamp(60px, 9vw, 100px) 40px clamp(40px, 6vw, 68px);
  overflow: hidden;
  animation: ${headerReveal} 0.9s var(--easing) both;

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
      rgba(201, 162, 39, 0.42),
      rgba(39, 160, 142, 0.36),
      transparent
    );
  }

  /* Decorative corner mark */
  &::after {
    content: '';
    position: absolute;
    top: 28px;
    right: 40px;
    width: 48px;
    height: 48px;
    border-top: 1px solid rgba(201, 162, 39, 0.22);
    border-right: 1px solid rgba(201, 162, 39, 0.22);
  }

  @media (max-width: 768px) {
    padding-right: 22px;
    padding-left: 22px;
    &::before {
      left: 22px;
      right: 22px;
    }
    &::after {
      right: 22px;
    }
  }

  @media (max-width: 480px) {
    padding-right: 16px;
    padding-left: 16px;
    padding-top: clamp(48px, 7vw, 68px);
    &::before {
      left: 16px;
      right: 16px;
    }
    &::after {
      display: none;
    }
  }
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: clamp(28px, 6vw, 80px);
  align-items: end;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Eyebrow = styled.p`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  letter-spacing: 0.26em;
  text-transform: uppercase;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1px;
    background: var(--green);
    flex-shrink: 0;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;
  max-width: 920px;
  font-family: var(--font-display);
  font-size: clamp(72px, 13vw, 160px);
  font-weight: 400;
  color: var(--lightest-slate);
  line-height: 0.84;
  letter-spacing: -0.02em;

  em {
    font-style: italic;
    color: transparent;
    background: linear-gradient(110deg, var(--gold), var(--blue), var(--gold-light), var(--gold));
    background-size: 260% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    animation: ${titleShine} 7s linear infinite alternate;
  }
`;

const PageSubtitle = styled.p`
  max-width: 520px;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  line-height: 1.75;
  margin: 0;
  opacity: 0.85;
`;

const HeaderStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const HeaderStat = styled.div`
  min-height: 108px;
  padding: 20px;
  border: 1px solid rgba(183, 196, 186, 0.1);
  border-radius: 6px;
  background: rgba(12, 10, 24, 0.6);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.35;
  }

  strong {
    display: block;
    font-family: var(--font-display);
    color: var(--white);
    font-size: clamp(32px, 5vw, 46px);
    font-weight: 400;
    line-height: 1;
    margin-bottom: 10px;
  }

  span {
    display: block;
    color: var(--dark-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &:nth-child(2) {
    border-color: rgba(201, 162, 39, 0.16);
    transform: translateY(18px);

    &::before {
      background: linear-gradient(90deg, var(--blue), transparent);
    }
  }

  @media (max-width: 820px) {
    max-width: 520px;
    &:nth-child(2) {
      transform: translateY(0);
    }
  }
`;

// ─── Slideshow ────────────────────────────────────────────────────────────────

const SlideshowSection = styled.section`
  position: relative;
  width: 100%;
  height: clamp(460px, 82vh, 900px);
  overflow: hidden;
  background: var(--navy);
  cursor: zoom-in;
  animation: ${fadeIn} 0.8s 0.18s var(--easing) both;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);

  /* Film grain overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.036'/%3E%3C/svg%3E");
    background-repeat: repeat;
    pointer-events: none;
    z-index: 6;
    opacity: 0.72;
  }

  /* Inner frame line */
  &::before {
    content: '';
    position: absolute;
    inset: 16px;
    z-index: 4;
    border: 1px solid rgba(217, 226, 218, 0.08);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: clamp(420px, 70vh, 680px);
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
  transition: opacity 1.3s ease;
  will-change: opacity;

  ${({ $active, $motion }) =>
    $active &&
    !$motion &&
    css`
      animation: ${kenBurns} 10s ease-out both;
    `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        rgba(4, 8, 6, 0.8) 0%,
        transparent 44%,
        rgba(4, 8, 6, 0.18) 100%
      ),
      linear-gradient(180deg, rgba(4, 8, 6, 0.12), rgba(4, 8, 6, 0.56));
  }
`;

const GradientTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(to bottom, rgba(7, 6, 13, 0.86), transparent);
  z-index: 3;
  pointer-events: none;
`;

const GradientBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 260px;
  background: linear-gradient(to top, rgba(7, 6, 13, 0.97), transparent);
  z-index: 3;
  pointer-events: none;
`;

/* Giant ghosted frame number — the defining cinematic detail */
const SlideNumber = styled.div`
  position: absolute;
  left: clamp(16px, 3.5vw, 48px);
  bottom: clamp(52px, 10vh, 110px);
  z-index: 4;
  font-family: var(--font-display);
  font-size: clamp(72px, 18vw, 280px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--gold);
  opacity: 0.065;
  pointer-events: none;
  user-select: none;
  animation: ${counterPop} 0.45s var(--easing) both;

  @media (max-width: 480px) {
    font-size: clamp(60px, 22vw, 110px);
    bottom: 56px;
    opacity: 0.055;
  }
`;

const NavArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 24px;' : 'right: 24px;')}
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(12, 10, 24, 0.56);
  border: 1px solid rgba(217, 226, 218, 0.12);
  color: var(--lightest-slate);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.36);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(201, 162, 39, 0.14);
    border-color: var(--gold);
    color: var(--gold);
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
  padding: 24px clamp(24px, 4vw, 60px) 38px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 600px) {
    padding: 18px 20px 22px;
  }
`;

/* Caption re-animates on every slide change via key prop */
const SlideCaption = styled.p`
  max-width: min(540px, 60vw);
  color: rgba(240, 236, 224, 0.76);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
  animation: ${captionUp} 0.48s var(--easing) both;

  @media (max-width: 600px) {
    max-width: 56vw;
  }
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid rgba(217, 226, 218, 0.1);
  border-radius: 999px;
  background: rgba(4, 8, 6, 0.5);
  backdrop-filter: blur(12px);
`;

const PlayBtn = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 162, 39, 0.1);
  border: 1px solid rgba(201, 162, 39, 0.2);
  border-radius: 50%;
  color: var(--gold);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, background 0.2s ease;
  line-height: 1;

  &:hover {
    transform: scale(1.08);
    background: rgba(201, 162, 39, 0.18);
  }

  &:disabled {
    cursor: default;
    opacity: 0.42;
    transform: none;
  }
`;

const SlideCounter = styled.span`
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 1.5px;
  white-space: nowrap;
`;

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressTrack = styled.div`
  height: 2px;
  background: rgba(26, 22, 48, 0.9);
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--blue), var(--gold));
  transition: width 0.7s ease;
  box-shadow: 0 0 24px rgba(201, 162, 39, 0.4);
`;

// ─── Film Strip ───────────────────────────────────────────────────────────────

const FilmStrip = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  padding: 26px clamp(16px, 3vw, 36px);
  overflow-x: auto;
  background: #040307;
  border-bottom: 1px solid rgba(217, 226, 218, 0.06);
  scrollbar-width: thin;
  scrollbar-color: var(--gold) #040307;

  &::-webkit-scrollbar {
    height: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #040307;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gold);
    border-radius: 1px;
  }

  /* Sprocket holes — top edge */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 18px;
    pointer-events: none;
    background-image: radial-gradient(circle at center, transparent 42%, #040307 42%);
    background-size: 22px 18px;
    background-color: #040307;
    z-index: 1;
  }

  /* Sprocket holes — bottom edge */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 18px;
    pointer-events: none;
    background-image: radial-gradient(circle at center, transparent 42%, #040307 42%);
    background-size: 22px 18px;
    background-color: #040307;
    z-index: 1;
  }
`;

const ThumbBtn = styled.button`
  flex: 0 0 auto;
  width: 82px;
  height: 58px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid ${({ $active }) => ($active ? 'var(--gold)' : 'rgba(217, 226, 218, 0.08)')};
  background: var(--light-navy);
  padding: 0;
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${({ $active }) => ($active ? 1 : 0.44)};
    transform: scale(${({ $active }) => ($active ? 1.04 : 1)});
    transition: opacity 0.22s ease, transform 0.35s ease;
    filter: ${({ $active }) => ($active ? 'none' : 'saturate(0.65)')};
  }

  &:hover {
    border-color: rgba(201, 162, 39, 0.58);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    img {
      opacity: 1;
      transform: scale(1.07);
      filter: none;
    }
  }

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: 0 0 0 1px var(--gold), 0 6px 24px rgba(201, 162, 39, 0.18);
    `}
`;

// ─── Photo Grid ───────────────────────────────────────────────────────────────

const GridSection = styled.section`
  padding: clamp(64px, 8vw, 108px) 40px clamp(88px, 10vw, 134px);
  max-width: 1500px;
  margin: 0 auto;
  animation: ${fadeIn} 1s 0.4s ease both;

  @media (max-width: 768px) {
    padding: 52px 18px 68px;
  }
`;

const GridHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(201, 162, 39, 0.1);

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

const GridTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 400;
  font-style: italic;
  color: var(--lightest-slate);
  margin: 0;
  letter-spacing: -0.01em;
`;

const GridCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
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
  border-radius: 4px;
  border: 1px solid rgba(217, 226, 218, 0.09);
  padding: 0;
  cursor: zoom-in;
  background: var(--light-navy);
  display: block;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.26), 0 2px 5px rgba(0, 0, 0, 0.36);

  --rot: ${({ $rotation }) => $rotation}deg;

  opacity: ${({ $motion }) => ($motion ? 1 : 0)};
  transform: rotate(var(--rot));

  ${({ $motion, $delay }) =>
    $motion
      ? css`
          animation: none;
        `
      : css`
          animation: ${gridReveal} 0.76s var(--easing) both;
          animation-delay: ${$delay}ms;
        `}

  transition: border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.88) contrast(1.03);
    transition: transform 0.65s var(--easing), filter 0.35s ease;
  }

  &:hover {
    border-color: rgba(201, 162, 39, 0.48);
    box-shadow: 0 28px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.14);
    transform: rotate(var(--rot)) translateY(-6px) scale(1.02);
    z-index: 2;
  }

  &:hover img {
    transform: scale(1.08);
    filter: saturate(1.1) contrast(1.05);
  }

  &:hover > span {
    opacity: 1;
  }
  &:hover > small {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    grid-column: span ${({ $variant }) => ($variant === 'wide' ? 6 : 3)};
    --rot: 0deg;
  }

  @media (max-width: 480px) {
    grid-column: span 1;
    aspect-ratio: 1 / 1;
  }
`;

const GridOverlay = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 6, 13, 0.06), rgba(7, 6, 13, 0.72));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &::after {
    content: '↗';
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(201, 162, 39, 0.4);
    border-radius: 50%;
    background: rgba(7, 6, 13, 0.56);
    font-size: 18px;
    color: var(--gold);
    line-height: 1;
  }
`;

/* Photo number badge, visible on hover */
const GridBadge = styled.small`
  position: absolute;
  top: 9px;
  right: 9px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(240, 236, 224, 0.7);
  background: rgba(7, 6, 13, 0.72);
  border: 1px solid rgba(217, 226, 218, 0.1);
  border-radius: 2px;
  padding: 2px 5px;
  letter-spacing: 0.1em;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
`;

// ─── Lightbox ─────────────────────────────────────────────────────────────────

const LightboxPortal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${lightboxFade} 0.22s ease both;
`;

const LightboxBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(4, 3, 10, 0.97);
  backdrop-filter: blur(14px);
`;

const LightboxFrame = styled.div`
  position: relative;
  z-index: 1;
  max-width: min(92vw, 1100px);
  max-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxPhoto = styled.img`
  max-width: 100%;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: 0 32px 100px rgba(0, 0, 0, 0.78);
  display: block;
  animation: ${({ $dir }) => ($dir === 'forward' ? lbSlideForward : lbSlideBackward)} 0.32s
    var(--easing) both;
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 20px;
  right: 26px;
  z-index: 2;
  background: rgba(12, 10, 24, 0.52);
  border: 1px solid rgba(217, 226, 218, 0.12);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--slate);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.22s ease;

  &:hover {
    color: var(--lightest-slate);
    border-color: rgba(201, 162, 39, 0.36);
    background: rgba(201, 162, 39, 0.1);
    transform: rotate(90deg) scale(1.06);
  }
`;

const LightboxArrow = styled.button`
  position: fixed;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 18px;' : 'right: 18px;')}
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(12, 10, 24, 0.52);
  border: 1px solid rgba(201, 162, 39, 0.18);
  color: var(--lightest-slate);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.22s ease;

  &:hover {
    background: rgba(201, 162, 39, 0.12);
    border-color: var(--gold);
    color: var(--gold);
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 24px;
    left: ${({ $left }) => ($left ? '8px' : 'auto')};
    right: ${({ $left }) => ($left ? 'auto' : '8px')};
  }
`;

const LightboxFooter = styled.div`
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const LightboxCounter = styled.p`
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  margin: 0;
  background: rgba(4, 3, 10, 0.52);
  padding: 4px 14px;
  border-radius: 999px;
  border: 1px solid rgba(217, 226, 218, 0.1);
  backdrop-filter: blur(6px);
`;

const LightboxCaption = styled.p`
  color: var(--dark-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`;

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [navDirection, setNavDirection] = useState('forward');
  const thumbStripRef = useRef(null);

  const imgPath = filename => withPrefix(`/images/ghallery/${encodeURIComponent(filename)}`);
  const getCaption = idx => `DFO Sarpang field and office archive, Bhutan - photo ${idx + 1}`;

  const shouldLoad = idx => {
    const prev = (current - 1 + N) % N;
    const next = (current + 1) % N;
    return idx === current || idx === prev || idx === next;
  };

  const goPrev = () => setCurrent(c => (c - 1 + N) % N);
  const goNext = () => setCurrent(c => (c + 1) % N);

  const lightboxPrev = () => {
    setNavDirection('backward');
    goPrev();
  };
  const lightboxNext = () => {
    setNavDirection('forward');
    goNext();
  };

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
        setNavDirection('backward');
        setCurrent(c => (c - 1 + N) % N);
      }
      if (e.key === 'ArrowRight') {
        setNavDirection('forward');
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

          {/* Giant ghosted frame number */}
          <SlideNumber key={current} aria-hidden="true">
            {String(current + 1).padStart(2, '0')}
          </SlideNumber>

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
            {/* Caption re-animates on each slide via key */}
            <SlideCaption key={current}>{getCaption(current)}</SlideCaption>
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

        {/* ── Film Strip (with sprocket holes) ── */}
        <FilmStrip ref={thumbStripRef}>
          {IMAGES.map((img, idx) => (
            <ThumbBtn
              key={img}
              $active={idx === current}
              data-active={idx === current}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to photo ${idx + 1}`}>
              <img src={imgPath(img)} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
            </ThumbBtn>
          ))}
        </FilmStrip>

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
                $rotation={getRotation(idx)}
                $delay={(idx % 12) * 48}
                $motion={prefersReducedMotion}
                onClick={() => {
                  setNavDirection('forward');
                  setCurrent(idx);
                  setLightboxOpen(true);
                }}
                aria-label={`Open ${getCaption(idx)} in viewer`}>
                <img src={imgPath(img)} alt={getCaption(idx)} loading="lazy" />
                <GridOverlay />
                <GridBadge>{String(idx + 1).padStart(2, '0')}</GridBadge>
              </GridItem>
            ))}
          </PhotoGrid>
        </GridSection>
      </StyledPage>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <LightboxPortal role="dialog" aria-modal="true" aria-label="Photo viewer">
          <LightboxBackdrop onClick={() => setLightboxOpen(false)} />

          <LightboxFrame>
            <LightboxPhoto
              key={`${current}-${navDirection}`}
              $dir={navDirection}
              src={imgPath(IMAGES[current])}
              alt={getCaption(current)}
            />
          </LightboxFrame>

          <LightboxClose onClick={() => setLightboxOpen(false)} aria-label="Close viewer">
            &times;
          </LightboxClose>

          <LightboxArrow $left onClick={lightboxPrev} aria-label="Previous photo">
            &#8249;
          </LightboxArrow>

          <LightboxArrow onClick={lightboxNext} aria-label="Next photo">
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
