module.exports = {
  email: 'wangdiues@gmail.com',

  socialMedia: [
    {
      name: 'ORCID',
      url: 'https://orcid.org/0009-0007-7726-1742',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/wangdi-wangdi',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#experience',
    },
    {
      name: 'Case Studies',
      url: '/#case-studies',
    },
    {
      name: 'Publications',
      url: '/#publications',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
    {
      name: 'Gallery',
      url: '/gallery',
    },
  ],

  colors: {
    accent: '#9ccf63',
    forest: '#0e1f1a',
    deepForest: '#081410',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
