import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: ['@ice/pkg-plugin-docusaurus'],
  bundle: {
    modes: ['development'],
    formats: ['esm', 'es2017', 'cjs'],
  },
});
