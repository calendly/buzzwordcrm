const db = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
});

const createUserTable = db.schema.createTable('users', function(table) {
  table.increments('id').primary()
  table.string('calendly_uid').unique().dropNullable()
  table.string('access_token').unique().dropNullable()
  table.string('refresh_token').unique().dropNullable()
});

db.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return createUserTable;
  }
});

export default db;