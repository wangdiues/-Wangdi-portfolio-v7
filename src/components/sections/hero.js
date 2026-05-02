import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const nameGlow = keyframes`
  0% {
    background-position: 0% 50%;
    text-shadow: 0 0 0 rgba(201, 162, 39, 0);
  }
  50% {
    text-shadow: 0 0 28px rgba(240, 200, 72, 0.24);
  }
  100% {
    background-position: 100% 50%;
    text-shadow: 0 0 0 rgba(201, 162, 39, 0);
  }
`;

const sparkleAnim = keyframes`
  0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
  20%       { opacity: 0.9; }
  50%       { transform: scale(1) rotate(45deg); opacity: 0.75; }
  80%       { opacity: 0.35; }
`;

// Scattered sparkle positions — heavier on the right (clear of text on desktop)
const SPARKLES = [
  { top: '7%', left: '72%', size: 16, delay: 0.0, dur: 3.2 },
  { top: '20%', left: '89%', size: 10, delay: 1.4, dur: 2.9 },
  { top: '4%', left: '47%', size: 7, delay: 2.6, dur: 3.8 },
  { top: '40%', left: '82%', size: 14, delay: 0.7, dur: 4.1 },
  { top: '66%', left: '93%', size: 9, delay: 1.9, dur: 3.0 },
  { top: '14%', left: '61%', size: 11, delay: 3.2, dur: 2.7 },
  { top: '54%', left: '71%', size: 6, delay: 0.4, dur: 4.5 },
  { top: '29%', left: '97%', size: 10, delay: 2.1, dur: 3.5 },
  { top: '79%', left: '59%', size: 7, delay: 1.1, dur: 3.0 },
  { top: '11%', left: '26%', size: 5, delay: 3.8, dur: 3.6 },
  { top: '87%', left: '83%', size: 13, delay: 0.8, dur: 4.3 },
  { top: '49%', left: '56%', size: 6, delay: 2.4, dur: 3.2 },
  { top: '61%', left: '35%', size: 4, delay: 1.6, dur: 4.8 },
  { top: '91%', left: '14%', size: 5, delay: 4.2, dur: 3.4 },
  { top: '74%', left: '4%', size: 4, delay: 2.9, dur: 3.7 },
];

const SparkleField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const SparkleItem = styled.div`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $alt }) => ($alt ? 'var(--gold-light)' : 'var(--gold)')};
    clip-path: polygon(50% 0%, 55% 44%, 100% 50%, 55% 56%, 50% 100%, 45% 56%, 0% 50%, 45% 44%);
  }

  &::before {
    animation: ${sparkleAnim} ${({ $dur }) => $dur}s ${({ $delay }) => $delay}s ease-in-out infinite;
  }

  &::after {
    transform: rotate(45deg) scale(0.65);
    opacity: 0.5;
    animation: ${sparkleAnim} ${({ $dur }) => $dur}s ${({ $delay }) => $delay + 0.35}s ease-in-out
      infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 12vh -8vw auto auto;
    width: min(42rem, 70vw);
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.5), transparent);
    opacity: 0.6;
  }

  @media (max-height: 700px) and (min-width: 700px), (max-width: 600px) {
    height: auto;
    min-height: unset;
    padding-top: var(--nav-height);
    padding-bottom: 60px;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h2.big-heading {
    font-size: clamp(36px, 6vw, 60px);

    &.name-heading {
      width: fit-content;
      color: transparent;
      background: linear-gradient(
        90deg,
        var(--lightest-slate),
        var(--green),
        var(--gold-light),
        var(--lightest-slate)
      );
      background-size: 240% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      animation: ${nameGlow} 5.5s ease-in-out infinite alternate;

      @media (prefers-reduced-motion: reduce) {
        color: var(--lightest-slate);
        background: none;
        animation: none;
      }
    }
  }

  h3.big-heading {
    margin-top: 5px;
    color: var(--slate);
    line-height: 1.1;
    font-size: clamp(22px, 4vw, 42px);
  }

  p {
    margin: 20px 0 0;
    max-width: 620px;
    color: rgba(240, 236, 224, 0.74);
    line-height: 1.65;

    @media (max-width: 480px) {
      font-size: var(--fz-md);
      margin-top: 16px;
    }
  }

  .cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 40px;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 12px;
      margin-top: 32px;
    }
  }

  .primary-link {
    ${({ theme }) => theme.mixins.bigButton};
    min-height: 44px;

    @media (max-width: 480px) {
      width: 100%;
      text-align: center;
      justify-content: center;
      padding: 14px 20px;
    }
  }

  .secondary-link {
    ${({ theme }) => theme.mixins.smallButton};
    min-height: 44px;

    @media (max-width: 480px) {
      width: 100%;
      text-align: center;
      justify-content: center;
    }
  }

  .impact-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(120px, 1fr));
    gap: 14px;
    width: 100%;
    max-width: 760px;
    margin-top: 40px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    @media (max-width: 360px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
  }

  .impact-item {
    padding: 18px 18px 16px;
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.025));
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);

    @media (max-width: 480px) {
      padding: 14px 12px 12px;
    }
  }

  .impact-value {
    display: block;
    margin-bottom: 6px;
    color: var(--gold-light);
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 600;

    @media (max-width: 480px) {
      font-size: clamp(20px, 5vw, 26px);
      margin-bottom: 4px;
    }
  }

  .impact-label {
    display: block;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.08em;
    text-transform: uppercase;

    @media (max-width: 480px) {
      font-size: 10px;
      letter-spacing: 0.05em;
    }
  }
`;

const Hero = () => {
  const data = useStaticQuery(graphql`
    query {
      publications: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/publications/" } }
      ) {
        totalCount
      }
    }
  `);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const publicationCount = data.publications.totalCount;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Research &amp; Conservation</h1>;
  const two = <h2 className="big-heading name-heading">Wangdi.</h2>;
  const three = (
    <h3 className="big-heading">
      Ecologist and forest governance professional quantifying biodiversity, connectivity, and
      climate risk across Bhutan’s protected landscapes.
    </h3>
  );
  const four = (
    <p>
      Research-active conservation practitioner embedded in Bhutan’s public forest governance system
      for 5+ years. Work spans field ecology, geospatial analysis, species distribution modelling,
      and peer-reviewed publication across wildlife, forest, and climate systems—translating
      ecological evidence into conservation planning and management decisions.
    </p>
  );
  const five = (
    <div className="impact-strip">
      <div className="impact-item">
        <span className="impact-value">5+</span>
        <span className="impact-label">Years in public-sector forestry</span>
      </div>
      <div className="impact-item">
        <span className="impact-value">{publicationCount}</span>
        <span className="impact-label">Publications &amp; manuscripts</span>
      </div>
      <div className="impact-item">
        <span className="impact-value">100+</span>
        <span className="impact-label">Species documented</span>
      </div>
      <div className="impact-item">
        <span className="impact-value">3</span>
        <span className="impact-label">Consecutive Outstanding ratings</span>
      </div>
    </div>
  );
  const six = (
    <div className="cta-group">
      <a
        className="primary-link"
        href={withPrefix('/Wangdi_CV.pdf')}
        target="_blank"
        rel="noreferrer">
        View CV
      </a>
      <a className="secondary-link" href={withPrefix('/#programs')}>
        Explore Programs
      </a>
    </div>
  );

  const items = [one, two, three, four, five, six];

  return (
    <StyledHeroSection>
      {/* Twinkling gold sparkle field */}
      <SparkleField aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <SparkleItem
            key={i}
            $top={s.top}
            $left={s.left}
            $size={s.size}
            $delay={s.delay}
            $dur={s.dur}
            $alt={i % 4 === 0}
          />
        ))}
      </SparkleField>

      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1 }}>
              {item}
            </div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms`, position: 'relative', zIndex: 1 }}>
                  {item}
                </div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
