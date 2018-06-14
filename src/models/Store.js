import mongoose from 'mongoose'

export default mongoose.model('stores', {
  _id: mongoose.Schema.Types.ObjectId,
  URI: String,
  name: String,
  date: String,
  category: String,
  description: Object,
  address: String,
  city: String,
  country: String,
  featured: Boolean,
  lat: Number,
  lng: Number,
  image: String,
  menu: Object,
  reviews: Array
})
