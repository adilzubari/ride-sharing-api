import mongoose from "mongoose";

const ride = mongoose.Schema({
  Driver: String,
  Rider: {
    Alpha: String,
    Beta: String,
  },
  Destination: {
    Coords: {
      latitude: Number,
      latitudeDelta: Number,
      longitude: Number,
      longitudeDelta: Number,
    },
    city: String,
    country: String,
    district: String,
    isoCountryCode: String,
    name: String,
    postalCode: String,
    region: String,
    street: String,
    subregion: String,
    timezone: String,
  },
  Created: {
    Date: String,
    Month: String,
    Hour: String,
    Minute: String,
  },
  Ended: {
    Date: String,
    Month: String,
    Hour: String,
    Minute: String,
  },
  Direction: String,
  Completed: Boolean,
});

export default mongoose.model("ride", ride);
