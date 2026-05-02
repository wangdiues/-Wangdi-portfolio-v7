import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(12, 1fr);
  align-items: stretch;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, rgba(34, 31, 58, 0.82), rgba(12, 10, 24, 0.92));
  }

  &:not(:last-of-type) {
    margin-bottom: 100px;

    @media (max-width: 768px) {
      margin-bottom: 70px;
    }

    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 1 / 7;
      text-align: right;

      @media (max-width: 768px) {
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;

      @media (max-width: 768px) {
        justify-content: flex-start;
      }

      li {
        margin: 0 0 5px 20px;

        @media (max-width: 768px) {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-panel {
      grid-column: 7 / -1;

      @media (max-width: 768px) {
        border-radius: 0 0 var(--border-radius) var(--border-radius);
      }
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      padding: 40px 40px 30px;
      z-index: 5;
    }

    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
      margin: 0 0 20px;
    }

    @media (max-width: 768px) {
      color: var(--white);

      a {
        position: static;

        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border: 1px solid rgba(201, 162, 39, 0.12);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, rgba(34, 31, 58, 0.92), rgba(18, 16, 42, 0.88));
    color: var(--light-slate);
    font-size: var(--fz-lg);

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }
  }

  .project-action {
    ${({ theme }) => theme.mixins.smallButton};
    margin-top: 18px;
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }

  .project-panel {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 7 / -1;
    position: relative;
    z-index: 1;
    padding: 32px;
    border: 1px solid var(--border-gold);
    border-radius: var(--border-radius);
    background: linear-gradient(180deg, rgba(34, 31, 58, 0.92), rgba(12, 10, 24, 0.92));

    @media (max-width: 768px) {
      opacity: 1;
      padding: 24px;
      box-shadow: none;
    }

    .panel-label {
      display: block;
      margin-bottom: 6px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .panel-value {
      color: var(--ivory);
      font-size: var(--fz-lg);
      line-height: 1.5;
    }

    .panel-item + .panel-item {
      margin-top: 24px;
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/case-studies/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              date
              title
              region
              focus
              impact
              methods
              external
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <section id="programs">
      <h2 className="numbered-heading" ref={revealTitle}>
        Programs
      </h2>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { date, external, title, region, focus, impact, methods } = frontmatter;
            const year = date ? new Date(date).getFullYear() : null;
            const reportUrl =
              external && external.startsWith('/') ? withPrefix(external) : external;

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <div>
                    <p className="project-overline">Flagship Programs</p>

                    <h3 className="project-title">
                      {reportUrl ? <a href={reportUrl}>{title}</a> : <span>{title}</span>}
                    </h3>

                    <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />

                    {methods && methods.length > 0 && (
                      <ul className="project-tech-list">
                        {methods.map((method, index) => (
                          <li key={index}>{method}</li>
                        ))}
                      </ul>
                    )}

                    {reportUrl ? (
                      <a
                        className="project-action"
                        href={reportUrl}
                        target="_blank"
                        rel="noreferrer">
                        View Full Report
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="project-panel">
                  {year ? (
                    <div className="panel-item">
                      <span className="panel-label">Year</span>
                      <div className="panel-value">{year}</div>
                    </div>
                  ) : null}

                  <div className="panel-item">
                    <span className="panel-label">Geographic Scope</span>
                    <div className="panel-value">{region}</div>
                  </div>

                  <div className="panel-item">
                    <span className="panel-label">Focus</span>
                    <div className="panel-value">{focus}</div>
                  </div>

                  <div className="panel-item">
                    <span className="panel-label">Outcome</span>
                    <div className="panel-value">{impact}</div>
                  </div>
                </div>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
