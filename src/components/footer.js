import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  border-top: 1px solid rgba(201, 162, 39, 0.12);
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1.8;

  .title {
    color: var(--green);
    font-family: var(--font-display);
    font-size: var(--fz-lg);
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();
  const hasSocialLinks = socialMedia && socialMedia.length > 0;

  return (
    <StyledFooter>
      {hasSocialLinks ? (
        <StyledSocialLinks>
          <ul>
            {socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
          </ul>
        </StyledSocialLinks>
      ) : null}

      <StyledCredit tabIndex="-1">
        <div className="title">Wangdi</div>
        <div>Senior Forestry Officer | Biodiversity, Climate &amp; Forest Governance</div>
        <div>{year}</div>
      </StyledCredit>
    </StyledFooter>
  );
};

export default Footer;
