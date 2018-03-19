import email from 'emailjs/email'

import config from '../../../config'

const MAIL = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'].MAIL
const counter = { count: 4 }

const resolvers = {
  Query: {
    counter () {
      return counter
    },
    store: async (parent, args, { Store }) => {
      let store = await Store.findOne(args)

      const avgRes = await Store.aggregate([
        { '$unwind': '$reviews' },
        { '$match': { URI: args.URI } },
        {
          '$group': {
            '_id': { '_id': '$_id' },
            'points': { '$avg': '$reviews.points' }
          }
        },
        { '$project': { '_id': 0, 'points': 1 } }
      ])
      
      store.points = Math.ceil(avgRes[0].points)

      return store
    },
    storesCount: async (parent, args, { Store }) => {
      return Store.count()
    },
    stores: async (parent, args, { Store }) => {
      let stores = []
      let limit = 0
      let skip = 0

      if (Number.isSafeInteger(args.limit) && Number.isSafeInteger(args.skip)) {
        limit = args.limit
        skip = args.skip
        delete args.limit
        delete args.skip
      }

      if (args.menuItemType) {
        stores = await Store.find({
          ['menu.items.' + args.menuItemType.toLowerCase() + '.category']: {
            $regex: '.*' + args.menuItemCategory + '.*',
            $options: 'i'
          }
        }).skip(skip).limit(limit)
      } else {
        stores = await Store.find(args).skip(skip).limit(limit)
      }

      return stores
    },
    featuredStores: async (parent, args, { Store }) => {
      let stores = await Store.find({ featured: true })

      return stores
    }
  },
  Mutation: {
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
