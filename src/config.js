export default {
  'dev': {
    PORT: 9000,
    MONGO_URL: 'mongodb://localhost:27017/appicar',
    CORS_OPTIONS: {
      origin: '*',
      credentials: true
    },
    MAIL: {
      server: {
        host: 'localhost',
        ssl: false
      },
      to: 'spa.singlepageapp@gmail.com'
    }
  },
  'prod': {
    PORT: 9000,
    MONGO_URL: 'mongodb://mongodb.localhost:27017/appicar',
    CORS_OPTIONS: {
      origin: 'http://appicar.com',
      credentials: true
    }
  }
}
