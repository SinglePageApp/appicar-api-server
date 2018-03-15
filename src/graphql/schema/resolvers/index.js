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
    stores: async (parent, args, { Store }) => {
      let stores = []
      if (args.menuItemType) {
        stores = await Store.find({
          ['menu.items.' + args.menuItemType.toLowerCase() + '.category']: {
            $regex: '.*' + args.menuItemCategory + '.*',
            $options: 'i'
          }
        })
      } else {
        stores = await Store.find(args)
      }

      return stores
    },
    featuredStores: async (parent, args, { Store }) => {
      let store = await Store.find({ featured: true })

      return store
    }
  }
}

export default resolvers
