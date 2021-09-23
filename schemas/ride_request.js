import mongoose from "mongoose";

const ride_request = mongoose.Schema({
  Ride: String,
  Rider: String,
  PickupLocation: Object,
});

export default mongoose.model("ride_request", ride_request);
