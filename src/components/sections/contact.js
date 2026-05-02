import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { srConfig, email, socialMedia } from '@config';
import { Icon } from '@components/icons';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const letterIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const handleReveal = keyframes`
  0%   { opacity: 0; transform: translateY(10px) scale(0.95); letter-spacing: 0.35em; }
  60%  { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 1; transform: translateY(0) scale(1); letter-spacing: 0.18em; }
`;

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

const StyledLetter = styled.span`
  display: inline-block;
  white-space: pre;
  opacity: 0;
  animation: ${({ $visible }) => ($visible ? letterIn : 'none')} 0.45s
    cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const StyledHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  letter-spacing: 0.18em;
  color: var(--gold);
  opacity: 0;
  animation: ${({ $visible }) => ($visible ? handleReveal : 'none')} 0.7s
    cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  .at {
    color: var(--gold-light);
    font-size: var(--fz-xs);
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--gold-light);
    margin-left: 3px;
    vertical-align: middle;
    animation: ${cursorBlink} 0.9s step-end infinite;
    animation-delay: ${({ $delay }) => $delay}s;
    border-radius: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
    .cursor {
      display: none;
    }
  }
`;

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  position: relative;
  text-align: center;

  &:before {
    content: '';
    display: block;
    width: min(220px, 55vw);
    height: 1px;
    margin: 0 auto 42px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
  }

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
    color: var(--ivory);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }

  .contact-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin-top: 24px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--gold-light);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const TITLE = 'Get In Touch';

const Contact = () => {
  const revealContainer = useRef(null);
  const titleRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (titleRef.current) {observer.observe(titleRef.current);}
    return () => observer.disconnect();
  }, []);

  // each letter gets a stagger delay; spaces are a bit faster
  const letterDelay = i => (0.04 * i).toFixed(2);
  const handleDelay = (TITLE.length * 0.04 + 0.3).toFixed(2);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Open to Collaboration</h2>

      <h2 className="title" ref={titleRef} aria-label={TITLE}>
        {prefersReducedMotion
          ? TITLE
          : TITLE.split('').map((ch, i) => (
            <StyledLetter key={i} $visible={titleVisible} $delay={letterDelay(i)}>
              {ch}
            </StyledLetter>
          ))}
      </h2>

      {!prefersReducedMotion && (
        <StyledHandle $visible={titleVisible} $delay={handleDelay}>
          <span className="at">@</span>wangdiues
          <span className="cursor" />
        </StyledHandle>
      )}

      <p>
        Open to collaboration on biodiversity research, conservation planning, climate and forest
        governance, technical peer review, or speaking opportunities. I typically respond within a
        few working days.
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Email Wangdi
      </a>

      <div className="contact-links">
        {socialMedia.map(({ name, url }) => (
          <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={`${name} profile`}>
            <Icon name={name} />
            {name === 'Linkedin' ? 'LinkedIn' : name}
          </a>
        ))}
      </div>
    </StyledContactSection>
  );
};

export default Contact;
