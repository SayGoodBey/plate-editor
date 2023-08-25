import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: ['@ice/pkg-plugin-docusaurus'],
  // transform: {
  //   formats: ['esm', 'es2017'],
  // },
  bundle: {
    formats: ['umd'],
    name: 'plateEditor', // 配置 umd 模块导出的名字，通过 `window[name]` 访问
    modes: ['development'],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
});
