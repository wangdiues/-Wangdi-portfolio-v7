import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email, socialMedia } from '@config';
import { Icon } from '@components/icons';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

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
        color: var(--green);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Open to Collaboration</h2>

      <h2 className="title">Get In Touch</h2>

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
