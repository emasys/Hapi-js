import Hapi from 'hapi';
import Knex from '../knex';

const people = {
  // our "users database"
  1: {
    id: 1,
    name: 'Jen Jones'
  }
};

// bring your own validation function
const validate = async function(decoded, request) {
  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

const init = async () => {
  const server = new Hapi.Server({ port: 8000 });
  // await server.register(require('hapi-auth-jwt2'));

  // server.auth.strategy('jwt', 'jwt', {
  //   key: 'NeverShareYourSecret', // Never Share your secret key
  //   validate, // validate function defined above
  //   verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  // });

  // server.auth.default('jwt');

  server.route({
    path: '/birds',
    method: 'GET',
    handler: (request, reply) => {
      const getOperation = Knex('birds')
        .where({
          isPublic: true
        })
        .select('name', 'species', 'picture_url')
        .then((results) => {
          if (!results || results.length === 0) {
            reply({
              error: true,
              errMessage: 'no public bird found'
            });
          }

          reply({
            dataCount: results.length,
            data: results
          });
        })
        .catch((err) => {
          console.log(err);
          reply('server-side error');
        });
    }
  });

  // server.route([
  //   {
  //     method: 'GET',
  //     path: '/',
  //     config: { auth: false },
  //     handler: function(request, reply) {
  //       return { text: 'Token not required' };
  //     }
  //   },

  //   {
  //     method: 'GET',
  //     path: '/restricted',
  //     config: { auth: 'jwt' },
  //     handler: function(request, reply) {
  //       reply({ text: 'You used a Token!' }).header(
  //         'Authorization',
  //         request.headers.authorization
  //       );
  //     }
  //   }
  // ]);
  await server.start();
  return server;
};

init()
  .then((server) => {
    console.log('Server running at:', server.info.uri);
  })
  .catch((error) => {
    console.log(error);
  });
