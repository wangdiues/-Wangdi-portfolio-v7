const config = require('./src/config');
const pathPrefix = '/Wangdi-portfolio-v7';

module.exports = {
  pathPrefix,
  siteMetadata: {
    title: 'Wangdi | Ecologist & Conservation Researcher',
    description:
      'Senior Forestry Officer and conservation researcher focused on biodiversity, ecological modeling, climate-responsive forest management, and forest governance in Bhutan.',
    siteUrl: `https://wangdiues.github.io${pathPrefix}`,
    image: '/og.png',
    twitterUsername: '',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              linkImagesToOriginal: true,
              quality: 90,
              tracedSVG: { color: config.colors.accent },
            },
          },
        ],
      },
    },
  ],
};
