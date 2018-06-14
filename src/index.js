import express from 'express'
import path from 'path'
import chalk from 'chalk'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import mongoose from 'mongoose'
import cors from 'cors'

import config from './config'
import schema from './graphql/schema'
import App from './models/App'
import Store from './models/Store'


const app = express()
const CONFIG = config[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev']

mongoose.connect(CONFIG.MONGO_URL)

app.use('/', express.static(path.resolve(__dirname, '/../public')))

app.get('/', (req, res) => {
  res.send({
    message: 'I am a server route and can also be hot reloaded!'
  })
})

app.use(cors(CONFIG.CORS_OPTIONS))

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress((req, res) => {
    return ({
      schema: schema,
      context: {
        req,
        db: { App, Store }
      }
    })
  })
)

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(CONFIG.PORT, () => {
  const log = console.log
  log('\n')
  log(chalk.bgYellow.black(`MongoDB URL: ${CONFIG.MONGO_URL}`))
  log(chalk.bgGreen.black(`Server listening on http://localhost:${CONFIG.PORT}/ ..`))
  log('\n')
  log(`${chalk.blue('/graphql')}  - endpoint for queries`)
  log(`${chalk.blue('/graphiql')} - endpoint for testing`)
  log('\n')
})

export default app
