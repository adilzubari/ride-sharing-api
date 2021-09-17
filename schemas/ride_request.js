import mongoose from "mongoose";

const ride_request = mongoose.Schema({
  Ride: String,
  Rider: String,
});

export default mongoose.model("ride_request", ride_request);
