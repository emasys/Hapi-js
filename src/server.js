import Hapi from 'hapi';
import {
  goHome,
  fetchPublicBirds,
  authUser,
  createBirds,
  updateBirds,
  deleteBirds,
} from './routes';
import { plugins } from './plugins';

const validate = async (decoded) => {
  if (decoded) return { isValid: true };
  return false;
};

const init = async () => {
  const server = new Hapi.Server({ port: 8000 });
  await server.register(plugins);
  server.auth.strategy('token', 'jwt', {
    key: 'secret',
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });
  goHome(server);
  fetchPublicBirds(server);
  authUser(server);
  createBirds(server);
  updateBirds(server);
  deleteBirds(server);
  await server.start();
  return server;
};

const startServer = async () => {
  const server = await init();
  try {
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.log(error);
  }
};

startServer();
