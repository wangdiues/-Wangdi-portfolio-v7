import React from 'react';
import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  0%   { opacity: 0;   transform: translateY(0)      translateX(0)            scale(1);    }
  8%   { opacity: 0.9;                                                                      }
  40%  { opacity: 0.6; transform: translateY(-30vh)  translateX(var(--dx1))   scale(0.75); }
  75%  { opacity: 0.2; transform: translateY(-68vh)  translateX(var(--dx2))   scale(0.42); }
  100% { opacity: 0;   transform: translateY(-102vh) translateX(var(--dx3))   scale(0.1);  }
`;

const EmberField = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
`;

const Particle = styled.span`
  position: absolute;
  bottom: -12px;
  left: ${({ $left }) => $left}%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff8d4 0%, ${({ $color }) => $color} 38%, transparent 72%);
  box-shadow: 0 0 ${({ $size }) => $size + 3}px ${({ $color }) => $color},
    0 0 ${({ $size }) => $size * 3}px ${({ $color }) => $color}66;
  --dx1: ${({ $da }) => $da}px;
  --dx2: ${({ $db }) => $db}px;
  --dx3: ${({ $dc }) => $dc}px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${rise} ${({ $dur }) => $dur}s ${({ $delay }) => $delay}s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

// 22 embers spread across the viewport; negative delays stagger phases
const EMBERS = [
  { left: 2, size: 3, dur: 7.2, delay: 0, da: 20, db: -14, dc: 28, color: '#f0c848' },
  { left: 7, size: 4, dur: 5.8, delay: -1.4, da: -18, db: 10, dc: -22, color: '#c9a227' },
  { left: 13, size: 5, dur: 8.4, delay: -3.6, da: 24, db: -20, dc: 32, color: '#c46c35' },
  { left: 18, size: 3, dur: 6.1, delay: -5.2, da: -12, db: 18, dc: -26, color: '#f0c848' },
  { left: 25, size: 4, dur: 7.8, delay: -2.7, da: 16, db: -24, dc: 20, color: '#c9a227' },
  { left: 32, size: 6, dur: 9.2, delay: -7.1, da: -26, db: 14, dc: -18, color: '#f0c848' },
  { left: 38, size: 3, dur: 5.6, delay: -4.3, da: 22, db: -10, dc: 28, color: '#c46c35' },
  { left: 45, size: 5, dur: 8.1, delay: -1.8, da: -20, db: 26, dc: -14, color: '#c9a227' },
  { left: 51, size: 4, dur: 6.7, delay: -6.4, da: 12, db: -22, dc: 16, color: '#f0c848' },
  { left: 57, size: 3, dur: 8.9, delay: -3.1, da: -24, db: 12, dc: -30, color: '#c9a227' },
  { left: 64, size: 4, dur: 6.3, delay: -5.7, da: 18, db: -16, dc: 22, color: '#c46c35' },
  { left: 70, size: 5, dur: 7.5, delay: -2.4, da: -14, db: 22, dc: -18, color: '#f0c848' },
  { left: 76, size: 3, dur: 6.0, delay: -4.9, da: 26, db: -18, dc: 32, color: '#c9a227' },
  { left: 82, size: 4, dur: 8.6, delay: -1.2, da: -22, db: 16, dc: -24, color: '#f0c848' },
  { left: 88, size: 6, dur: 7.0, delay: -6.8, da: 14, db: -26, dc: 18, color: '#c46c35' },
  { left: 94, size: 3, dur: 5.9, delay: -3.8, da: -18, db: 20, dc: -22, color: '#c9a227' },
  { left: 10, size: 4, dur: 9.0, delay: -7.5, da: 22, db: -12, dc: 26, color: '#f0c848' },
  { left: 29, size: 3, dur: 6.8, delay: -4.1, da: -16, db: 24, dc: -20, color: '#c9a227' },
  { left: 47, size: 5, dur: 7.3, delay: -2.9, da: 28, db: -8, dc: -16, color: '#f0c848' },
  { left: 60, size: 3, dur: 5.5, delay: -6.2, da: -10, db: 18, dc: -24, color: '#c46c35' },
  { left: 79, size: 4, dur: 8.3, delay: -0.8, da: 20, db: -24, dc: 30, color: '#c9a227' },
  { left: 91, size: 4, dur: 8.2, delay: -5.5, da: -20, db: 26, dc: -28, color: '#f0c848' },
];

const FireEmbers = () => (
  <EmberField aria-hidden="true">
    {EMBERS.map((e, i) => (
      <Particle
        key={i}
        $left={e.left}
        $size={e.size}
        $dur={e.dur}
        $delay={e.delay}
        $da={e.da}
        $db={e.db}
        $dc={e.dc}
        $color={e.color}
      />
    ))}
  </EmberField>
);

export default FireEmbers;
