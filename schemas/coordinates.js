import mongoose from "mongoose";

const coordinates = mongoose.Schema({
  User_id: String,
  coordinates: Object,
});

export default mongoose.model("coordinates", coordinates);
