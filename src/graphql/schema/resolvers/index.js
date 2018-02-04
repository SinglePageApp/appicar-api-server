const counter = { count: 4 }

const resolvers = {
  Query: {
    counter () {
      return counter
    },
    stores: async (parent, args, { Store }) => {
      let stores = await Store.find()

      /*stores = stores.map((store) => {
        store._id = store._id.toString()
      })*/

      return stores
    }
  },
  Mutation: {
    createStore: async (parent, args, { Store }) => {
      const store = await new Store(args).save()
      store._id = store._id.toString()

      return store
    }
  }
}

export default resolvers
