const counter = { count: 4 }

const resolvers = {
  Query: {
    counter () {
      return counter
    },
    store: async (parent, args, { Store }) => {
      let stores = await Store.findOne(args)

      return stores
    },
    stores: async (parent, args, { Store }) => {
      let stores = await Store.find(args)

      return stores
    },
    featuredStores: async (parent, args, { Store }) => {
      let store = await Store.find({ featured: true })

      return store
    }
  }
}

export default resolvers
