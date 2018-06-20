/**
 * @file Query resolvers utilities.
 * @author Matías J. Magni <matias.magni@gmail.com>
 * @copyright Matías J. Magni @ 2018
 */
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

import config from '../../../config'


const SECURITY = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'].SECURITY

/**
 * Simulates a 401 authentication error over a GraphQL's 200 response.
 */
export function throwAuthenticationError () {
  throw new Error('401 Authentication error: the combination of apikey/secret is incorrect!')
}

/**
 * Simulates a 403 forbidden error over a GraphQL's 200 response.
 */
export function throwForbiddenError () {
  throw new Error('403 Authorization error: access forbidden!')
}

/**
 * Checks query authorization based on request header values.
 *
 * @param {any} req The request object.
 * @param {any} db The db object.
 * @returns {boolean} <true> if it was authorized.
 *                    <false> if it wasn't authorized.
 */
export async function checkAuth (req, db) {
  let app = null
  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''

  const { ok, result } = await new Promise(resolve =>
    jwt.verify(token, SECURITY.jwt.secret, (err, result) => {
      if (err) {
        resolve({
          ok: false,
          result: err
        })
      } else {
        resolve({
          ok: true,
          result
        })
      }
    })
  )

  if (ok) {
    app = await db.App.findOne({
      _id: new Types.ObjectId(result.key),
      apikey: result.apikey,
      secret: result.secret,
      token: token
    })
  } else if (result.expiredAt) {
    throw new Error(result.name + ': token expired on ' + result.expiredAt)
  } else {
    throwForbiddenError()
  }

  return Boolean(app)
}

/**
 * Signs a token for an app to be avaible to authenticate itself.
 *
 * @param {*} id The app's ID.
 * @param {*} apikey The app's apikey.
 * @param {*} secret The app's secret.
 * @returns {string} The signed token for the app to authenticate itself.
 */
export function signAppToken (id, apikey, secret) {
  return jwt.sign(
    {
      key: id,
      iss: 'appicar.com',
      apikey: apikey,
      secret: secret,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + SECURITY.jwt.expiration * 60
    },
    SECURITY.jwt.secret
  )
}

/**
 * Gets the app token's expiration date.
 *
 * @returns {Date} The app token's expiration date.
 */
export function getAppTokenExpirationDate () {
  return new Date(new Date().getTime() + SECURITY.jwt.expiration * 60000)
}
