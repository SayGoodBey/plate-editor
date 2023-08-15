import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: ['@ice/pkg-plugin-docusaurus'],
  bundle: {
    modes: ['development'],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    formats: ['cjs', 'esm', 'es2017'],
  },
});
