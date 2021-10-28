export const devConfig =
  process.env.NODE_ENV !== 'production' ? require('../../config.json') : {};
