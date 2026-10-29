import nextConfig from 'eslint-config-next';

export default [
  ...nextConfig,
  {
    files: ['components/ui/carousel.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
