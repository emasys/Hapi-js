export const plugins = [
  {
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: true,
      logEvents: ['response', 'onPostStart']
    }
  },
  {
    plugin: require('hapi-auth-jwt2')
  }
];
