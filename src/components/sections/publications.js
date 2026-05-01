import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledPublicationsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  .publications-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
    width: 100%;
    margin-top: 40px;
  }

  .publication-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .filter-button {
    ${({ theme }) => theme.mixins.smallButton};
    padding: 0.65rem 0.9rem;
    border-color: var(--lightest-navy);
    color: var(--light-slate);

    &.active {
      border-color: var(--green);
      background: var(--green-tint);
      color: var(--green);
    }
  }
`;

const StyledPublication = styled.li`
  .publication-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.8rem 1.6rem;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    background: rgba(22, 48, 42, 0.82);
    transition: var(--transition);

    &.is-clickable {
      cursor: pointer;

      &:hover,
      &:focus-visible {
        border-color: var(--green);
        background: rgba(22, 48, 42, 0.96);
        transform: translateY(-4px);
        outline: none;
      }
    }
  }

  .publication-top {
    ${({ theme }) => theme.mixins.flexBetween};
    gap: 12px;
    margin-bottom: 24px;
  }

  .status {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid var(--green);
    border-radius: 999px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.04em;
    text-transform: uppercase;

    &.status-published {
      background: var(--green);
      color: var(--dark-navy);
    }

    &.status-under-review {
      background: rgba(156, 207, 99, 0.08);
    }

    &.status-in-preparation {
      border-color: var(--dark-slate);
      color: var(--slate);
    }
  }

  .year {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .publication-title {
    margin: 0 0 12px;
    color: var(--white);
    font-size: var(--fz-xxl);
    line-height: 1.35;
  }

  .publication-meta {
    margin-bottom: 14px;
    color: var(--light-slate);
    font-size: var(--fz-sm);
    line-height: 1.7;
  }

  .publication-description {
    color: var(--light-slate);
    font-size: var(--fz-md);
    line-height: 1.7;
  }

  .publication-description a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  .publication-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0;
    margin: 14px 0 0;
    list-style: none;

    li {
      padding: 3px 9px;
      border: 1px solid rgba(156, 207, 99, 0.3);
      border-radius: 999px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.03em;
    }
  }

  .publication-link {
    ${({ theme }) => theme.mixins.flexCenter};
    margin-left: auto;
    color: var(--lightest-slate);
  }

  .publication-link svg {
    width: 20px;
    height: 20px;
  }

  .pdf-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 7px 14px;
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus {
      background: rgba(156, 207, 99, 0.1);
      outline: none;
    }

    svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
  }
`;

const Publications = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const data = useStaticQuery(graphql`
    query {
      publications: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/publications/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              authors
              venue
              status
              year
              external
              pdf
              tags
            }
            html
          }
        }
      }
    }
  `);

  const statusOrder = { Published: 0, 'Under Review': 1, 'In Preparation': 2 };
  const publications = data.publications.edges
    .filter(({ node }) => node)
    .sort((a, b) => {
      const sa = statusOrder[a.node.frontmatter.status] ?? 3;
      const sb = statusOrder[b.node.frontmatter.status] ?? 3;
      return sa - sb;
    });
  const filters = ['All', 'Published', 'Under Review', 'In Preparation'];
  const filteredPublications =
    activeFilter === 'All'
      ? publications
      : publications.filter(({ node }) => node.frontmatter.status === activeFilter);
  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, index) => sr.reveal(ref, srConfig(index * 80)));
  }, []);

  return (
    <StyledPublicationsSection id="publications">
      <h2 className="numbered-heading" ref={revealTitle}>
        Publications &amp; Manuscripts
      </h2>

      <div className="publication-filters" aria-label="Filter publications by status">
        {filters.map(filter => (
          <button
            className={`filter-button${activeFilter === filter ? ' active' : ''}`}
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}>
            {filter}
          </button>
        ))}
      </div>

      <ul className="publications-grid">
        {filteredPublications.map(({ node }, index) => {
          const { frontmatter, html } = node;
          const { title, authors, venue, status, year, external, pdf, tags } = frontmatter;
          const primaryLink = pdf ? withPrefix(pdf) : external;
          const statusClass = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
          const openPrimaryLink = () => {
            if (primaryLink) {
              window.open(primaryLink, '_blank', 'noopener,noreferrer');
            }
          };
          const handleKeyDown = event => {
            if (primaryLink && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              openPrimaryLink();
            }
          };

          return (
            <StyledPublication key={index} ref={el => (revealCards.current[index] = el)}>
              <div
                className={`publication-inner${primaryLink ? ' is-clickable' : ''}`}
                role={primaryLink ? 'link' : undefined}
                tabIndex={primaryLink ? 0 : undefined}
                onClick={openPrimaryLink}
                onKeyDown={handleKeyDown}>
                <div className="publication-top">
                  <span className={`status ${statusClass}`}>{status}</span>
                  <span className="year">{year}</span>
                  {external ? (
                    <a
                      className="publication-link"
                      href={external}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${title}`}
                      onClick={event => event.stopPropagation()}>
                      <Icon name="External" />
                    </a>
                  ) : null}
                </div>

                <h3 className="publication-title">{title}</h3>
                <div className="publication-meta">
                  <div>{authors}</div>
                  <div>{venue}</div>
                </div>
                <div
                  className="publication-description"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                {tags && tags.length > 0 && (
                  <ul className="publication-tags">
                    {tags.map((tag, i) => (
                      <li key={i}>{tag}</li>
                    ))}
                  </ul>
                )}
                {pdf && (
                  <a
                    className="pdf-link"
                    href={withPrefix(pdf)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View PDF: ${title}`}
                    onClick={event => event.stopPropagation()}>
                    <Icon name="External" />
                    View Manuscript
                  </a>
                )}
              </div>
            </StyledPublication>
          );
        })}
      </ul>
    </StyledPublicationsSection>
  );
};

export default Publications;
