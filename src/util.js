import jwt from 'jsonwebtoken';

export const handleRoute = (server, path, method, handler = 'welcome', config = null) => server.route({
  path,
  method,
  config,
  handler: (req, res) => {
    req.logger.info('In handler %s', req.path);
    if (typeof handler === 'function') return handler(req, res);
    return handler;
  },
});

export const handleNotFound = message => ({
  error: true,
  message,
});

export const signToken = (username, user) => {
  const token = jwt.sign(
    {
      username,
      scope: user.guid,
    },
    'secret',
    {
      algorithm: 'HS256',
      expiresIn: '1d',
    },
  );

  return {
    token,
    scope: user.guid,
  };
};
