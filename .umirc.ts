import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  devServer: {
    port: 9027,
  },
  // alias: { umi 自带了两个有用的alias，我觉得足够了，后面还不够的话可以再补充进来
  //   '~@src': 'src',
  //   '~@widgets': 'src/widgets',
  // },
  fastRefresh: {},
});
