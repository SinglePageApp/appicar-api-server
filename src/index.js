import express from 'express'
import path from 'path'
import chalk from 'chalk'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import mongoose from 'mongoose'
import cors from 'express-cors'

import schema from './graphql/schema'
import config from './config'

const app = express()

const corsOptions = {
  origin: 'localhost',
  credentials: true
}

const Store = mongoose.model('stores', {
  _id: String,
  name: String,
  date: String,
  description: String,
  address: String,
  featured: Boolean,
  lat: Number,
  lng: Number,
  image: String
})

mongoose.connect(config.MONGO_URL)

app.use('/', express.static(path.resolve(__dirname, '/../public')))

app.get('/', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!'
  })
})

app.use(cors(corsOptions))

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: { Store }
}))

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(config.PORT, () => {
  const log = console.log
  log('\n')
  log(chalk.bgGreen.black(`Server listening on http://localhost:${config.PORT}/ ..`))
  log('\n')
  log(`${chalk.blue('/graphql')}  - endpoint for queries`)
  log(`${chalk.blue('/graphiql')} - endpoint for testing`)
  log('\n')
})

export default app
