import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes } from 'merge-graphql-schemas'

import resolvers from './resolvers'

import query from './types/query.graphql'
import counter from './types/counter.graphql'
import store from './types/store.graphql'
import item from './types/item.graphql'
import menu from './types/menu.graphql'
import menuitem from './types/menuitem.graphql'
import food from './types/food.graphql'
import drink from './types/drink.graphql'
import price from './types/price.graphql'
import promotion from './types/promotion.graphql'
import translatable from './types/translatable.graphql'


const typeDefs = mergeTypes([counter, query, store, item, menu, menuitem, food, drink, price, promotion, translatable])

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
