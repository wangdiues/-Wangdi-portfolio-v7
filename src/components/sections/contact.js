import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
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
    justify-content: center;
    gap: 20px;
    margin-top: 20px;

    a {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--green);
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
        <a
          href="https://orcid.org/0009-0007-7726-1742"
          target="_blank"
          rel="noreferrer"
          aria-label="ORCID profile">
          ORCID: 0009-0007-7726-1742
        </a>
      </div>
    </StyledContactSection>
  );
};

export default Contact;
