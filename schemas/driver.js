import mongoose from "mongoose";

const driver_schema = mongoose.Schema({
  Name: String,
  Email: String,
  Mobile: String,
  Vehiclemodel: String,
  Vehiclenumber: String,
  Password: String,
});

export default mongoose.model("driver", driver_schema);
