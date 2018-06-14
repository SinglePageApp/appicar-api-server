/**
 * @file Resolvers for queries and mutations.
 * @author Matías J. Magni <matias.magni@gmail.com>
 * @copyright Matías J. Magni @ 2018
 */
import email from 'emailjs/email'

import config from '../../../config'
import {
  checkAuth,
  signAppToken,
  getAppTokenExpirationDate,
  throwAuthenticationError,
  throwForbiddenError
} from './utils'


const MAIL = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'].MAIL
const counter = { count: 4 }

const resolvers = {
  Query: {
    /**
     * Resolver for counter query:
     *
     * - counter: Counter
     */
    counter () {
      return counter
    },
    /**
     * Resolver for store query:
     *
     * - store(URI: String): Store
     */
    store: async (parent, args, { req, db }) => {
      let store = null

      if (await checkAuth(req, db)) {
        store = await db.Store.findOne(args)

        const avgRes = await db.Store.aggregate([
          { '$unwind': '$reviews' },
          { '$match': { URI: args.URI } },
          {
            '$group': {
              '_id': {'_id': '$_id'},
              'points': { '$avg': '$reviews.points' }
            }
          },
          { '$project': { '_id': 0, 'points': 1 } }
        ])
        
        store.points = avgRes.length ? Math.ceil(avgRes[0].points) : null
      } else {
        throwForbiddenError()
      }

      return store
    },
    /**
     * Resolver for storesCount query:
     *
     * - storesCount: Int
     */
    storesCount: async (parent, args, { req, db }) => {
      let count = 0

      if (await checkAuth(req, db)) {
        count = db.Store.count()
      } else {
        throwForbiddenError()
      }

      return count
    },
    /**
     * Resolver for stores queries:
     *
     * - stores(skip: Int, limit: Int): [Store]
     * - stores(category: String, skip: Int, limit: Int): [Store]
     * - stores(menuItemType: String, menuItemCategory: String, skip: Int, limit: Int): [Store]
     */
    stores: async (parent, args, { req, db }) => {
      let stores = []

      if (await checkAuth(req, db)) {
        let limit = 0
        let skip = 0
  
        if (Number.isSafeInteger(args.limit) && Number.isSafeInteger(args.skip)) {
          limit = args.limit
          skip = args.skip
          delete args.limit
          delete args.skip
        }
  
        if (args.menuItemType) {
          stores = await db.Store.find({
            ['menu.items.' + args.menuItemType.toLowerCase() + '.category']: {
              $regex: '.*' + args.menuItemCategory + '.*',
              $options: 'i'
            }
          }).skip(skip).limit(limit)
        } else {
          stores = await db.Store.find(args).skip(skip).limit(limit)
        }
      } else {
        throwForbiddenError()
      }

      return stores
    },
    /**
     * Resolver for featuredStores query:
     *
     * - featuredStores: [Store]
     */
    featuredStores: async (parent, args, { req, db }) => {
      let stores = await db.Store.find({ featured: true })

      return stores
    }
  },
  Mutation: {
    /**
     * Resolver for login mutation:
     *
     * - login(apikey: String, secret: String): String
     */
    login: async (parent, args, { req, db }) => {
      const app = await db.App.findOne(args)
      let token = null
      if (app) {
        token = signAppToken(app._id, args.apikey, args.secret)
        // Update app data with the new generated token
        db.App.update(args, {
          '$set': {
            'apikey': app.apikey,
            'secret': app.secret,
            'token': token,
            'expiration': getAppTokenExpirationDate()
          }
        }, function (err, res) {
          if (err) {
            console.log(err)
            throw new Error(err)
          }
          console.log(res)
        })
      } else {
        throwAuthenticationError()
      }
      
      return token
    },
    /**
     * Resolver for sendEmail mutation:
     *
     * - sendEmail(from: String, subject: String, text: String): Boolean
     */
    sendEmail: async (parent, args) => {
      const server = email.server.connect(MAIL.server)
      const mailOptions = args
      mailOptions.to = MAIL.to
      let successful = false
      // send the message and get a callback with an error or details of the message that was sent
      server.send(mailOptions, (err, message) => {
        console.log('E-mail data: ')
        console.log(mailOptions)
        // Error handling.
        if (err) {
          console.log(err)
        } else {
          successful = true
        }
      })

      return successful
    }
  }
}

export default resolvers
