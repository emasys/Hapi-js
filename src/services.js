import GUID from 'node-uuid';
import Knex from '../knex';
import { handleNotFound, signToken } from './util';

const guid = GUID.v4();

export const getBirds = async (req, res) => {
  const results = await Knex('birds')
    .where({
      isPublic: true,
    })
    .select('name', 'species', 'picture_url', 'guid');
  try {
    if (!results || results.length === 0) {
      return handleNotFound('no bird found');
    }
    return { dataCount: results.length, data: results };
  } catch (error) {
    return { error };
  }
};

export const auth = async (request, res) => {
  const { username, password } = request.payload;

  const result = await Knex('users')
    .where({
      username,
    })
    .select('guid', 'password');
  const [user] = result;
  try {
    if (!user) {
      return handleNotFound('The specified user was not found');
    }
    if (password === user.password) {
      const token = signToken(username, user);
      return token;
    }
    return handleNotFound('Invalid credentials');
  } catch (error) {
    return { error };
  }
};

export const createBird = async (req, res) => {
  const { name, species, picture } = req.payload;
  const response = await Knex('birds').insert({
    owner: req.auth.credentials.scope,
    name,
    species,
    picture_url: picture,
    guid,
  });

  try {
    if (response) {
      return res
        .response({
          data: guid,
          message: 'successfully created bird',
        })
        .code(201);
    }
    return null;
  } catch (error) {
    return { error };
  }
};

export const updateBird = async (req, res) => {
  const {
    name, species, picture, isPublic,
  } = req.payload;
  const { birdGuid } = req.params;
  const response = await Knex('birds')
    .where({
      guid: birdGuid,
    })
    .update({
      name,
      species,
      picture_url: picture,
      isPublic,
    });

  try {
    if (response) {
      return res
        .response({
          message: 'successfully updated bird',
        })
        .code(200);
    }
    return null;
  } catch (error) {
    return { error };
  }
};

export const deleteBird = async (req, res) => {
  const { birdGuid } = req.params;
  await Knex('birds')
    .where({
      guid: birdGuid,
    })
    .del();

  try {
    return res
      .response({
        message: 'successfully deleted bird',
      })
      .code(200);
  } catch (error) {
    return { error };
  }
};
