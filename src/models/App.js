import mongoose from 'mongoose'

export default mongoose.model('apps', {
  _id: mongoose.Schema.Types.ObjectId,
  apikey: String,
  secret: String,
  token: String,
  expiration: String
})
