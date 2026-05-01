import { css } from 'styled-components';

const button = css`
  color: var(--green);
  background: rgba(201, 162, 39, 0.06);
  border: 1px solid var(--border-gold);
  border-radius: var(--border-radius);
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  text-decoration: none;
  padding: 1.25rem 1.75rem;
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    outline: none;
    color: var(--gold-light);
    background: rgba(201, 162, 39, 0.12);
    border-color: rgba(240, 200, 72, 0.55);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(240, 200, 72, 0.08);
    transform: translateY(-2px);
  }
  &:after {
    display: none !important;
  }
`;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  link: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
      outline: 0;
    }
  `,

  inlineLink: css`
    display: inline-block;
    position: relative;
    color: var(--green);
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
      outline: 0;
      &:after {
        width: 100%;
      }
      & > * {
        color: var(--green) !important;
        transition: var(--transition);
      }
    }
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 1px;
      position: relative;
      bottom: 0.37em;
      background-color: var(--green);
      opacity: 0.5;
      @media (prefers-reduced-motion: no-preference) {
        transition: var(--transition);
      }
    }
  `,

  button,

  smallButton: css`
    color: var(--green);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    padding: 0.75rem 1rem;
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      color: var(--gold-light);
      background: rgba(201, 162, 39, 0.1);
      border-color: rgba(240, 200, 72, 0.5);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }
    &:after {
      display: none !important;
    }
  `,

  bigButton: css`
    color: var(--green);
    background: rgba(201, 162, 39, 0.06);
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.75rem;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      color: var(--gold-light);
      background: rgba(201, 162, 39, 0.12);
      border-color: rgba(240, 200, 72, 0.55);
      box-shadow: 0 16px 38px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(240, 200, 72, 0.08);
      transform: translateY(-2px);
    }
    &:after {
      display: none !important;
    }
  `,

  boxShadow: css`
    box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22);
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      box-shadow: 0 24px 56px rgba(0, 0, 0, 0.3);
    }
  `,

  fancyList: css`
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--fz-lg);
    li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 10px;
      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
      }
    }
  `,

  resetList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

export default mixins;
