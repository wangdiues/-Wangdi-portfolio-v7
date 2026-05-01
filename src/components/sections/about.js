import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled, { keyframes } from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const credentialsGlow = keyframes`
  0% {
    background-position: 0% 50%;
    text-shadow: 0 0 0 rgba(201, 162, 39, 0);
  }
  100% {
    background-position: 100% 50%;
    text-shadow: 0 0 18px rgba(240, 200, 72, 0.22);
  }
`;

const currentRolePulse = keyframes`
  0%, 100% {
    color: var(--green);
    transform: translateX(0);
  }
  50% {
    color: var(--white);
    transform: translateX(4px);
  }
`;

const currentRoleAccent = keyframes`
  0%, 100% {
    opacity: 0.28;
    transform: scaleY(0.72);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1);
  }
`;

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 220px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledProfilePanel = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  height: fit-content;
  padding: 28px 26px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-gold);
  background: linear-gradient(180deg, rgba(34, 31, 58, 0.88), rgba(12, 10, 24, 0.92));

  .photo-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    .gatsby-image-wrapper {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 2px solid rgba(240, 200, 72, 0.8);
      box-shadow: 0 0 0 6px rgba(201, 162, 39, 0.08), 0 16px 36px rgba(0, 0, 0, 0.28);
      overflow: hidden;
      flex-shrink: 0;
    }
  }

  h3 {
    margin: 0 0 20px;
    color: var(--white);
    font-size: var(--fz-xxl);

    &.credentials-title {
      width: fit-content;
      color: transparent;
      background: linear-gradient(
        90deg,
        var(--white),
        var(--green),
        var(--gold-light),
        var(--white)
      );
      background-size: 220% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      animation: ${credentialsGlow} 5s ease-in-out infinite alternate;
    }
  }

  .panel-group + .panel-group {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px solid rgba(201, 162, 39, 0.14);
  }

  .panel-label {
    display: block;
    margin-bottom: 8px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .current-role {
    position: relative;
    padding-left: 14px;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 2px;
      border-radius: 99px;
      background: var(--green);
      transform-origin: center;
      animation: ${currentRoleAccent} 3.6s ease-in-out infinite;
    }

    .panel-label {
      display: inline-block;
      animation: ${currentRolePulse} 3.6s ease-in-out infinite;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    h3.credentials-title,
    .current-role:before,
    .current-role .panel-label {
      animation: none;
    }
  }

  p,
  li {
    margin: 0;
    color: var(--light-slate);
    font-size: var(--fz-sm);
    line-height: 1.7;
  }

  ul {
    padding-left: 18px;
    margin: 0;
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'QGIS',
    'ArcGIS',
    'Google Earth Engine',
    'Python',
    'R',
    'Species Distribution Modeling',
    'Occupancy Modeling',
    'Camera Trap Analysis',
    'Forest Inventory',
    'Remote Sensing',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Wangdi is a public-sector forestry, biodiversity, and environmental management
              professional working within Bhutan’s forest governance system. His work combines field
              implementation, ecological analysis, policy-linked planning, and conservation program
              delivery.
            </p>

            <p>
              He currently serves as Senior Forestry Officer in the NWFP Section, Forest Resources
              Planning &amp; Management Division, after a merit-based promotion effective 1 January
              2026. His earlier role in Sarpang focused on biodiversity monitoring, climate
              assessment, protected area and corridor planning, and human-wildlife coexistence
              strategy development.
            </p>

            <p>
              The portfolio highlights work that links geospatial analysis, ecological evidence, and
              management decisions across protected areas, corridors, and community-linked forest
              stewardship. It is designed for collaborators, scholarship reviewers, institutions,
              and conservation partners who need a clear view of Wangdi’s experience and technical
              depth.
            </p>

            <p>
              He has 2 papers published in peer-reviewed journals and 5 manuscripts currently under
              review at international journals — including Ecology &amp; Evolution, Forest Ecology
              and Management, and Journal of Vegetation Science — with 4 additional manuscripts in
              preparation spanning tiger ecology, plant community assembly, and ecosystem integrity
              assessment.
            </p>

            <p>Selected tools and methods:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledProfilePanel>
          <div className="photo-wrapper">
            <StaticImage
              src="../../images/profile.jpg"
              width={140}
              height={140}
              quality={90}
              alt="Wangdi"
              formats={['auto', 'webp', 'avif']}
              imgStyle={{ borderRadius: '50%' }}
            />
          </div>
          <h3 className="credentials-title">Selected Credentials</h3>

          <div className="panel-group current-role">
            <span className="panel-label">Current Role</span>
            <p>
              Senior Forestry Officer, NWFP Section, Forest Resources Planning &amp; Management
              Division
            </p>
          </div>

          <div className="panel-group">
            <span className="panel-label">Recognition</span>
            <ul>
              <li>Merit-based promotion effective 1 January 2026</li>
              <li>Three consecutive Outstanding performance ratings</li>
              <li>Managed conservation programs exceeding Nu. 35 million</li>
            </ul>
          </div>

          <div className="panel-group">
            <span className="panel-label">Education</span>
            <p>
              BSc (Honours) in Forestry, First Class, College of Natural Resources, Royal University
              of Bhutan
            </p>
          </div>

          <div className="panel-group">
            <span className="panel-label">Research Profile</span>
            <p>
              2 published. 5 under review at Ecology &amp; Evolution, Forest Ecology and Management,
              and Journal of Vegetation Science. 4 in preparation spanning elephant distribution,
              protected area integrity, national forest biodiversity, and tiger-prey dynamics.
            </p>
          </div>
        </StyledProfilePanel>
      </div>
    </StyledAboutSection>
  );
};

export default About;
