exports.seed = function seed(knex, Promise) {
  var tableName = 'users';

  var rows = [
    {
      name: 'emasys nd',
      username: 'emasys',
      password: 'password',
      email: 'example@sample.com',
      guid: 'f03ede7c-b121-4112-bcc7-130a3e87988c'
    }
  ];

  return knex(tableName)
    .del()
    .then(function() {
      return knex.insert(rows).into(tableName);
    });
};
