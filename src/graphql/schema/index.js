import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes } from 'merge-graphql-schemas'

import resolvers from './resolvers'

import query from './types/query.graphql'
import counter from './types/counter.graphql'
import store from './types/store.graphql'

const typeDefs = mergeTypes([counter, query, store])

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
