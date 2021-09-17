import mongoose from "mongoose";

const rider_schema = mongoose.Schema({
  Name: String,
  Email: String,
  Mobile: String,
  Password: String,
});

export default mongoose.model("rider", rider_schema);
