import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { defineConfig } from 'umi';
import { appName } from './src/conf.json';
import routes from './src/routes';

export default defineConfig({
  define: {
    'process.env.UMI_API_BASE': '/ragflow/api',
  },
  title: appName,
  outputPath: 'dist',
  alias: { '@parent': path.resolve(__dirname, '../').replace(/\\/g, '/') },
  npmClient: 'npm',
  base: '/ragflow/', // 调整为部署路径
  routes,
  publicPath: '/ragflow/', // 调整静态资源路径
  esbuildMinifyIIFE: true,
  icons: {},
  hash: true,
  favicons: ['/logo.svg'],
  clickToComponent: false,
  history: {
    type: 'browser',
  },
  plugins: [
    '@react-dev-inspector/umi4-plugin',
    '@umijs/plugins/dist/tailwindcss',
  ],
  jsMinifier: 'none',
  lessLoader: {
    modifyVars: {
      hack: `true; @import "~@/less/index.less";`,
    },
  },
  devtool: 'source-map',
  copy: [{ from: 'src/conf.json', to: 'dist/conf.json' }],
  proxy: [
    {
      context: ['/api', '/v1'],
      target: 'http://192.168.66.100:9080/',
      changeOrigin: true,
      ws: true,
      logger: console,
    },
  ],
  chainWebpack(memo, args) {
    memo.module.rule('markdown').test(/\.md$/).type('asset/source');
    memo.optimization.minimizer('terser').use(TerserPlugin);
    return memo;
  },
  tailwindcss: {},
});
