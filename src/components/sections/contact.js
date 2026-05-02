import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { srConfig, email, socialMedia } from '@config';
import { Icon } from '@components/icons';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@&%?!';
const TITLE = 'Get In Touch';
const HANDLE = 'wangdiues'; // '@' rendered separately
const SCRAMBLE_DURATION = 480; // ms before first char locks
const LOCK_STAGGER = 88; // ms between each char locking
const TYPE_SPEED = 72; // ms between typed handle chars

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

const handleIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const goldPulse = keyframes`
  0%   { text-shadow: none; }
  35%  { text-shadow: 0 0 28px rgba(240,200,72,0.85), 0 0 56px rgba(240,200,72,0.3); }
  100% { text-shadow: 0 0 8px rgba(240,200,72,0.16); }
`;

// ── Styled ────────────────────────────────────────────────────────────────────

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
    font-family: var(--font-display);
    letter-spacing: 0.01em;
    line-height: 1.1;
    min-height: 1.2em;
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

const ScrambleChar = styled.span`
  display: inline-block;
  white-space: pre;
  color: ${({ $locked }) => ($locked ? 'var(--ivory)' : 'var(--gold-light)')};
  transition: color 0.1s ease;
`;

const HandleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: clamp(13px, 1.6vw, 16px);
  letter-spacing: 0.22em;
  color: var(--gold);
  min-height: 1.6em;
  opacity: 0;

  &.visible {
    animation: ${handleIn} 0.5s ease forwards, ${goldPulse} 1.2s 0.3s ease forwards;
  }

  .at {
    color: var(--gold-light);
    opacity: 0.65;
    font-size: 0.8em;
    letter-spacing: 0;
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 0.82em;
    background: var(--gold-light);
    margin-left: 4px;
    vertical-align: middle;
    border-radius: 1px;
    animation: ${cursorBlink} 1s step-end infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;

    .cursor {
      display: none;
    }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────

const rand = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

const Contact = () => {
  const revealContainer = useRef(null);
  const titleRef = useRef(null);
  const handleRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // displayedChars: what each position currently shows
  const [displayedChars, setDisplayedChars] = useState(() => TITLE.split(''));
  // lockedMask: which positions have settled to the real letter
  const [lockedMask, setLockedMask] = useState(() => TITLE.split('').map(() => true));
  const [handleText, setHandleText] = useState('');
  const [handleVisible, setHandleVisible] = useState(false);

  // Use a ref so the observer callback never becomes stale
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());

    const runAnimation = () => {
      if (startedRef.current) {return;}
      startedRef.current = true;

      const letters = TITLE.split('');
      // Track which positions are locked (local, not state — avoids stale closure)
      const locked = letters.map(() => false);
      let lockedCount = 0;

      // Start all chars scrambling
      setLockedMask(letters.map(() => false));
      setDisplayedChars(letters.map(ch => (ch === ' ' ? ' ' : rand())));

      // Ticker: update unlocked positions with random chars
      const ticker = setInterval(() => {
        setDisplayedChars(prev =>
          prev.map((ch, i) => {
            if (locked[i] || letters[i] === ' ') {return ch;}
            return rand();
          }),
        );
      }, 55);

      // Lock each character left-to-right
      letters.forEach((ch, i) => {
        setTimeout(() => {
          locked[i] = true;
          lockedCount += 1;

          setLockedMask(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          setDisplayedChars(prev => {
            const next = [...prev];
            next[i] = ch;
            return next;
          });

          if (lockedCount === letters.length) {
            clearInterval(ticker);
            // Typewrite the handle
            setTimeout(() => {
              setHandleVisible(true);
              if (handleRef.current) {
                handleRef.current.classList.add('visible');
              }
              HANDLE.split('').forEach((c, j) => {
                setTimeout(() => {
                  setHandleText(prev => prev + c);
                }, j * TYPE_SPEED);
              });
            }, 220);
          }
        }, SCRAMBLE_DURATION + i * LOCK_STAGGER);
      });

      return () => clearInterval(ticker);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.4 },
    );

    if (titleRef.current) {observer.observe(titleRef.current);}
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Open to Collaboration</h2>

      <h2 className="title" ref={titleRef} aria-label={TITLE}>
        {prefersReducedMotion
          ? TITLE
          : TITLE.split('').map((_, i) => (
            <ScrambleChar key={i} $locked={lockedMask[i]}>
              {displayedChars[i]}
            </ScrambleChar>
          ))}
      </h2>

      {!prefersReducedMotion && (
        <HandleWrapper ref={handleRef} aria-label={`@${HANDLE}`}>
          <span className="at">@</span>
          <span>{handleText}</span>
          {handleVisible && <span className="cursor" />}
        </HandleWrapper>
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
