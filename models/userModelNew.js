import db from '../db/knex.js';

const FIND_BY_CALENDLY_UID_QUERY = function(calendly_uid) { return db('users').where('calendly_uid', calendly_uid) }
const FIND_BY_ID_QUERY = function(id) { return db('users').where('id', id) }
const FIND_BY_ACCESS_TOKEN_QUERY = function(access_token) { return db('users').where('access_token', access_token)}
const CREATE_USER_QUERY = function(new_user) { return db('users').insert(new_user)}
const UPDATE_USER_QUERY = function(id, updated_attrs) { return db('users').where('id', id).update(updated_attrs)}

class UserModel {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreate({ calendlyUid, refreshToken, accessToken }) {
    const user = await this.findByCalendlyUserId(calendlyUid);

    if (user) return user;

    await this.create({
      calendlyUid,
      refreshToken,
      accessToken,
    });

    return this.findByCalendlyUserId(calendlyUid);
  }

  async findByCalendlyUserId(calendlyUid) {
    return new Promise((resolve, reject) => {
      FIND_BY_CALENDLY_UID_QUERY(calendlyUid)
        .then(() => resolve)
        .catch((err) => reject(err))
    })
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      FIND_BY_ID_QUERY(id)
        .then(() => resolve)
        .catch((err) => reject(err))
    })
  }

  async findByAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
      FIND_BY_ACCESS_TOKEN_QUERY(accessToken)
        .then(() => resolve)
        .catch((err) => reject(err))
    })
  }

  async update(id, {accessToken, refreshToken }) {
    return new Promise((resolve, reject) => {
      UPDATE_USER_QUERY(id, {'access_token': accessToken, 'refresh_token': refreshToken})
        .then(() => resolve)
        .catch((err) => reject(err))
    })
  }

  async create({ calendlyUid, accessToken, refreshToken }) {
    return new Promise((resolve, reject) => {
      CREATE_USER_QUERY({'calendly_uid': calendlyUid, 'access_token': accessToken, 'refresh_token': refreshToken})
        .then(() => resolve)
        .catch((err) => reject(err))
    })
  }
}

export default new UserModel(db);
