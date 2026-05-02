import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { srConfig, email, socialMedia } from '@config';
import { Icon } from '@components/icons';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

// Characters used during the scramble phase
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@&%?!';

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

const handleIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const goldPulse = keyframes`
  0%   { text-shadow: 0 0 0 rgba(240,200,72,0); }
  40%  { text-shadow: 0 0 32px rgba(240,200,72,0.85), 0 0 64px rgba(240,200,72,0.3); }
  100% { text-shadow: 0 0 10px rgba(240,200,72,0.18); }
`;

// ── Styled components ────────────────────────────────────────────────────────

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

// Scrambling character — glows gold while unsettled
const ScrambleChar = styled.span`
  display: inline-block;
  white-space: pre;
  color: ${({ $locked }) => ($locked ? 'var(--ivory)' : 'var(--gold-light)')};
  opacity: ${({ $locked, $active }) => ($locked || $active ? 1 : 0.22)};
  transition: color 0.12s ease, opacity 0.12s ease;
  font-variant-numeric: tabular-nums;
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

  opacity: ${({ $show }) => ($show ? 1 : 0)};
  animation: ${({ $show }) =>
    $show ? `${handleIn} 0.5s ease forwards, ${goldPulse} 1.2s 0.2s ease forwards` : 'none'};

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
    margin-left: 5px;
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

// ── Constants ────────────────────────────────────────────────────────────────

const TITLE = 'Get In Touch';
// ms each character scrambles before locking
const SCRAMBLE_DURATION = 480;
// ms between each character starting to lock (left → right)
const LOCK_STAGGER = 90;
// ms between each handle character being typed
const TYPE_SPEED = 70;
const HANDLE = '@wangdiues';

// ── Component ────────────────────────────────────────────────────────────────

const Contact = () => {
  const revealContainer = useRef(null);
  const titleRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Array of displayed chars (null = not yet started, ' ' for spaces in title)
  const [chars, setChars] = useState(() => TITLE.split('').map(() => null));
  const [lockedMask, setLockedMask] = useState(() => TITLE.split('').map(() => false));
  const [handleText, setHandleText] = useState('');
  const [showHandle, setShowHandle] = useState(false);
  const [started, setStarted] = useState(false);

  const rand = useCallback(
    () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
    [],
  );

  // Kick off the scramble sequence
  const startAnimation = useCallback(() => {
    if (started || prefersReducedMotion) {return;}
    setStarted(true);

    const letters = TITLE.split('');
    const totalChars = letters.length;

    // Scramble ticker — updates random chars for non-locked positions
    let lockedCount = 0;
    const scrambled = letters.map(ch => (ch === ' ' ? ' ' : rand()));
    setChars([...scrambled]);

    const tickInterval = setInterval(() => {
      setChars(prev =>
        prev.map((ch, i) => {
          if (lockedMask[i] || letters[i] === ' ') {return ch;}
          return rand();
        }),
      );
    }, 55);

    // Lock each character one by one, left to right
    letters.forEach((ch, i) => {
      setTimeout(() => {
        setLockedMask(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setChars(prev => {
          const next = [...prev];
          next[i] = ch;
          return next;
        });
        lockedCount += 1;

        if (lockedCount === totalChars) {
          // All locked — stop ticker, start handle typewriter
          clearInterval(tickInterval);
          setTimeout(() => {
            setShowHandle(true);
            // Type the handle char by char (skip '@' — it's rendered separately)
            const handleChars = HANDLE.slice(1); // 'wangdiues'
            handleChars.split('').forEach((c, j) => {
              setTimeout(() => {
                setHandleText(prev => prev + c);
              }, j * TYPE_SPEED);
            });
          }, 200);
        }
      }, SCRAMBLE_DURATION + i * LOCK_STAGGER);
    });

    return () => clearInterval(tickInterval);
  }, [started, prefersReducedMotion, rand, lockedMask]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (titleRef.current) {observer.observe(titleRef.current);}
    return () => observer.disconnect();
  }, [prefersReducedMotion, startAnimation]);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Open to Collaboration</h2>

      <h2 className="title" ref={titleRef} aria-label={TITLE}>
        {prefersReducedMotion
          ? TITLE
          : TITLE.split('').map((original, i) => (
            <ScrambleChar key={i} $locked={lockedMask[i]} $active={chars[i] !== null}>
              {chars[i] !== null ? chars[i] : original}
            </ScrambleChar>
          ))}
      </h2>

      {!prefersReducedMotion && (
        <HandleWrapper $show={showHandle} aria-label={HANDLE}>
          <span className="at">@</span>
          <span>{handleText}</span>
          {handleText.length < HANDLE.length - 1 && <span className="cursor" />}
          {handleText.length >= HANDLE.length - 1 && showHandle && <span className="cursor" />}
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
