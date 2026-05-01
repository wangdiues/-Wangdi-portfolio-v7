import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled, { keyframes, css } from 'styled-components';
import { withPrefix } from 'gatsby';
import { Layout } from '@components';

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

// ── Page Shell ──────────────────────────────────────────────────────────────

const StyledPage = styled.main`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--dark-navy);
`;

// ── Header ───────────────────────────────────────────────────────────────────

const PageHeader = styled.header`
  text-align: center;
  padding: 64px 24px 48px;
  animation: ${fadeIn} 0.6s ease both;
`;

const Eyebrow = styled.p`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 18px;
`;

const PageTitle = styled.h1`
  margin: 0 0 14px;
  font-size: clamp(48px, 9vw, 96px);
  font-weight: 600;
  color: var(--lightest-slate);
  line-height: 1;
  letter-spacing: -2px;

  em {
    font-style: normal;
    color: var(--green);
  }
`;

const PageSubtitle = styled.p`
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  letter-spacing: 1px;
  margin: 0;
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: var(--green);
  margin: 28px auto 0;
  opacity: 0.5;
`;

// ── Slideshow ────────────────────────────────────────────────────────────────

const SlideshowSection = styled.section`
  position: relative;
  width: 100%;
  height: clamp(380px, 78vh, 820px);
  overflow: hidden;
  background: var(--navy);
  cursor: zoom-in;
  animation: ${fadeIn} 0.8s 0.2s ease both;

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
`;

const SlidesContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1.1s ease;
  will-change: opacity;
`;

const GradientTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140px;
  background: linear-gradient(to bottom, rgba(8, 20, 16, 0.75), transparent);
  z-index: 3;
  pointer-events: none;
`;

const GradientBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(to top, rgba(8, 20, 16, 0.9), transparent);
  z-index: 3;
  pointer-events: none;
`;

const NavArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 24px;' : 'right: 24px;')}
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(14, 31, 26, 0.6);
  border: 1px solid rgba(156, 207, 99, 0.25);
  color: var(--lightest-slate);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  font-size: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(156, 207, 99, 0.15);
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
  padding: 20px 32px 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 600px) {
    padding: 16px 18px 20px;
  }
`;

const SlideCaption = styled.p`
  color: rgba(217, 226, 218, 0.75);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;

const PlayBtn = styled.button`
  background: none;
  border: none;
  color: var(--green);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  transition: transform 0.2s ease;
  line-height: 1;

  &:hover {
    transform: scale(1.3);
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
  height: 2px;
  background: var(--lightest-navy);
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, var(--green), rgba(156, 207, 99, 0.6));
  transition: width 0.7s ease;
`;

// ── Thumbnail Strip ───────────────────────────────────────────────────────────

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 5px;
  padding: 14px 16px;
  overflow-x: auto;
  background: rgba(14, 31, 26, 0.8);
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
  width: 76px;
  height: 58px;
  border-radius: 3px;
  overflow: hidden;
  border: 2px solid ${({ $active }) => ($active ? 'var(--green)' : 'transparent')};
  background: var(--light-navy);
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${({ $active }) => ($active ? 1 : 0.55)};
    transition: opacity 0.2s ease;
  }

  &:hover {
    border-color: rgba(156, 207, 99, 0.7);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);

    img {
      opacity: 1;
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
  padding: 64px 40px 80px;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 1s 0.4s ease both;

  @media (max-width: 768px) {
    padding: 48px 18px 64px;
  }
`;

const GridHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 32px;
`;

const GridTitle = styled.h2`
  font-family: var(--font-mono);
  font-size: var(--fz-md);
  font-weight: 400;
  color: var(--lightest-slate);
  margin: 0;
`;

const GridCount = styled.span`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 7px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }
`;

const GridItem = styled.button`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 3px;
  border: none;
  padding: 0;
  cursor: zoom-in;
  background: var(--light-navy);
  display: block;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s var(--easing);
  }

  &:hover img {
    transform: scale(1.1);
  }

  &:hover > span {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--green);
    outline-offset: 2px;
  }
`;

const GridOverlay = styled.span`
  position: absolute;
  inset: 0;
  background: rgba(8, 20, 16, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &::after {
    content: '+';
    font-size: 28px;
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
    animation: ${fadeIn} 0.25s ease both;
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

const GalleryPage = ({ location }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
    if (!isPlaying || lightboxOpen) {return;}
    const id = setInterval(() => setCurrent(c => (c + 1) % N), 5000);
    return () => clearInterval(id);
  }, [isPlaying, lightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') {setCurrent(c => (c - 1 + N) % N);}
      if (e.key === 'ArrowRight') {setCurrent(c => (c + 1) % N);}
      if (e.key === 'Escape') {setLightboxOpen(false);}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbStripRef.current) {return;}
    const active = thumbStripRef.current.querySelector('[data-active="true"]');
    if (active) {active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });}
  }, [current]);

  return (
    <Layout location={location}>
      <Helmet title="Gallery" />

      <StyledPage>
        {/* ── Header ── */}
        <PageHeader>
          <Eyebrow>Personal Archive</Eyebrow>
          <PageTitle>Gallery</PageTitle>
          <PageSubtitle>
            Memories from Divisional Forest Office, Sarpang &middot; Bhutan
          </PageSubtitle>
          <Divider />
        </PageHeader>

        {/* ── Slideshow ── */}
        <SlideshowSection
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onClick={() => setLightboxOpen(true)}
          aria-label="Photo slideshow">
          <SlidesContainer>
            {IMAGES.map((img, idx) => (
              <Slide
                key={img}
                $active={idx === current}
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
