import {
  getBirds, auth, createBird, updateBird, deleteBird,
} from './services';
import { handleRoute } from './util';
import Knex from '../knex';

const config = {
  auth: {
    strategy: 'token',
  },
};

const preConfig = {
  ...config,
  pre: [
    {
      method: async (request, reply) => {
        const { birdGuid } = request.params;
        const { scope } = request.auth.credentials;
        const result = await Knex('birds')
          .where({
            guid: birdGuid,
          })
          .select('owner');
        const [bird] = result;
        if (!bird) {
          return reply
            .response({
              error: true,
              errMessage: `the bird with id ${birdGuid} was not found`,
            })
            .code(400)
            .takeover();
        }

        if (bird.owner !== scope) {
          return reply
            .response({
              error: true,
              errMessage: `the bird with id ${birdGuid} is not in the current scope`,
            })
            .code(401)
            .takeover();
        }

        return reply.continue;
      },
    },
  ],
};

export const goHome = server => handleRoute(server, '/', 'GET');

export const fetchPublicBirds = server => handleRoute(server, '/birds', 'GET', getBirds);

export const authUser = server => handleRoute(server, '/auth', 'POST', auth);
export const createBirds = server => handleRoute(server, '/birds', 'POST', createBird, config);

export const updateBirds = server => handleRoute(server, '/birds/{birdGuid}', 'PUT', updateBird, preConfig);
export const deleteBirds = server => handleRoute(server, '/birds/{birdGuid}', 'DELETE', deleteBird, preConfig);
