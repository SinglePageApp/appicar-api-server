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
    },
    SECURITY: {
      jwt: {
        secret: '9bfc8cd8ff97d83b7c4266093c072e58ebc33b66fdaf63d9e009b2bf23c1c7e660d990d9f3b8fad084e591de286075c7e4641764640f91a248ccdea10376c937',
        expiration: 30 // In minutes.
      }
    }
  },
  'prod': {
    PORT: 9000,
    MONGO_URL: 'mongodb://mongodb.localhost:27017/appicar',
    CORS_OPTIONS: {
      origin: 'http://appicar.com',
      credentials: true
    },
    SECURITY: {
      jwt: {
        secret: '9bfc8cd8ff97d83b7c4266093c072e58ebc33b66fdaf63d9e009b2bf23c1c7e660d990d9f3b8fad084e591de286075c7e4641764640f91a248ccdea10376c937',
        expiration: 30 // In minutes.
      }
    }
  }
}
