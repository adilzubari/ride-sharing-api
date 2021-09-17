import mongoose from "mongoose";

const ride_request_approved = mongoose.Schema({
  Ride: String,
  Rider: String,
});

export default mongoose.model("ride_request_approved", ride_request_approved);
