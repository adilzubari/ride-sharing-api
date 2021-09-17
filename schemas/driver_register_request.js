import mongoose from "mongoose";

const driver_register_request_schema = mongoose.Schema({
  Name: String,
  Email: String,
  Mobile: String,
  Vehiclemodel: String,
  Vehiclenumber: String,
  Password: String,
  IdentityCard: String,
  CarDocuments: String,
  DrivingLicense: String,
});

export default mongoose.model(
  "driver_register_request",
  driver_register_request_schema
);
