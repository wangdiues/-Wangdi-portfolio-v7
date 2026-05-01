import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #07060d;
    --navy: #0c0a18;
    --light-navy: #12102a;
    --lightest-navy: #2b263f;
    --navy-shadow: rgba(0, 0, 0, 0.5);
    --dark-slate: #6f6a79;
    --slate: #a7a095;
    --light-slate: rgba(240, 236, 224, 0.72);
    --lightest-slate: #f0ece0;
    --white: #fffaf0;
    --green: #c9a227;
    --green-tint: rgba(201, 162, 39, 0.13);
    --pink: #9b1c2e;
    --blue: #27a08e;
    --gold: #c9a227;
    --gold-light: #f0c848;
    --crimson: #9b1c2e;
    --ivory: #f0ece0;
    --glass: rgba(255, 255, 255, 0.05);
    --glass-md: rgba(255, 255, 255, 0.09);
    --border-gold: rgba(201, 162, 39, 0.2);

    --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 6px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
