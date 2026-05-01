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

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
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
  }

  .cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 40px;
  }

  .primary-link {
    ${({ theme }) => theme.mixins.bigButton};
  }

  .secondary-link {
    ${({ theme }) => theme.mixins.smallButton};
  }

  .impact-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(120px, 1fr));
    gap: 14px;
    width: 100%;
    max-width: 760px;
    margin-top: 40px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }

    @media (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }

  .impact-item {
    padding: 18px 18px 16px;
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.025));
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
  }

  .impact-value {
    display: block;
    margin-bottom: 6px;
    color: var(--gold-light);
    font-size: clamp(24px, 4vw, 30px);
    font-weight: 600;
  }

  .impact-label {
    display: block;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
      <a className="secondary-link" href={withPrefix('/#case-studies')}>
        Explore Case Studies
      </a>
    </div>
  );

  const items = [one, two, three, four, five, six];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
