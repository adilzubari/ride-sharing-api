// User: admin
// Password: y79LY2ki1qXe2uWB

// mongodb+srv://amdin:<password>@ridesharing.jyyee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

import express from "express";
import mongoose from "mongoose";
// Schemas
import driver_register_request from "./schemas/driver_register_request.js";
import rider from "./schemas/rider.js";
import driver from "./schemas/driver.js";
import ride from "./schemas/ride.js";
import ride_request from "./schemas/ride_request.js";
import ride_request_approved from "./schemas/ride_request_approved.js";
import coordinates from "./schemas/coordinates.js";

// App Config
// const functions = require("firebase-functions");
const app = express();
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use(express.json());
const port = process.env.port || 3000;
const connection_url =
  "mongodb+srv://amdin:y79LY2ki1qXe2uWB@ridesharing.jyyee.mongodb.net/RideSharing?retryWrites=true&w=majority";

// Middlewares

// DB Config
mongoose.connect(connection_url);

// app.get("/", (req, res) => {
//   const date = new Date();
//   const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
//   res.send(`
//     <!doctype html>
//     <head>
//       <title>Time</title>
//       <link rel="stylesheet" href="/style.css">
//       <script src="/script.js"></script>
//     </head>
//     <body>
//       <p>In London, the clock strikes:
//         <span id="bongs">${"BONG ".repeat(hours)}</span></p>
//       <button onClick="refresh(this)">Refresh</button>
//     </body>
//   </html>`);
// });
// app.get("/api", (req, res) => {
//   const date = new Date();
//   const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
//   res.json({ bongs: "BONG ".repeat(hours) });
// });
// API Endpoints
app.get("/", (req, res) => {
  // res.send(req.body);
  res.send("Happy Ride Sharing!");
});

app.post("/rider/register", (req, res) => {
  const body = req.body;
  rider.create(body, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(data);
  });
});
app.post("/rider/authorization", (req, res) => {
  const body = req.body;
  rider.find({ Email: body.Email, Password: body.Password }, (err, values) => {
    if (err) res.status(500).send(err);
    else if (values.length == 1) res.status(200).send(values);
    else if (values.length == 0) res.status(500).send("Not matched");
    else res.status(500).send("Multiple users exist. Warning: Must be handled");
  });
});
app.get("/rider", (req, res) => {
  rider.find((err, values) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(values);
  });
});

// -----
// Rider
// -----
app.post("/driver/register", (req, res) => {
  const body = req.body;

  driver_register_request.create(body, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(data);
  });
});
app.post("/driver/authorization", (req, res) => {
  const body = req.body;
  driver.find({ Email: body.Email, Password: body.Password }, (err, values) => {
    if (err) res.status(500).send(err);
    else if (values.length == 1) res.status(200).send(values);
    else if (values.length == 0) res.status(500).send("Not matched");
    else res.status(500).send("Multiple users exist. Warning: Must be handled");
  });
});
app.post("/driver/ride/create", (req, res) => {
  const d = new Date();
  const body = {
    Driver: req.body.Driver_id,
    Rider: {
      Alpha: "",
      Beta: "",
    },
    Destination: {
      Coords: {
        latitude: req.body.Destination.Coords.latitude,
        latitudeDelta: req.body.Destination.Coords.latitudeDelta,
        longitude: req.body.Destination.Coords.longitude,
        longitudeDelta: req.body.Destination.Coords.longitudeDelta,
      },
      city: req.body.Destination.city,
      country: req.body.Destination.country,
      district: req.body.Destination.district,
      isoCountryCode: req.body.Destination.isoCountryCode,
      name: req.body.Destination.name,
      postalCode: req.body.Destination.postalCode,
      region: req.body.Destination.region,
      street: req.body.Destination.street,
      subregion: req.body.Destination.subregion,
      timezone: req.body.Destination.timezone,
    },
    Created: {
      Date: d.getDate().toString(),
      Month: (d.getMonth() + 1).toString(),
      Hour: d.getHours().toString(),
      Minute: d.getMinutes().toString(),
    },
    Ended: {
      Date: "",
      Month: "",
      Hour: "",
      Minute: "",
    },
    Direction: "Destination",
    Completed: false,
  };
  ride.deleteMany({}, (err, data) => {
    if (err) return;
  });
  ride_request.deleteMany({}, (err, data) => {
    if (err) return;
  });
  ride_request_approved.deleteMany({}, (err, data) => {
    if (err) return;
  });
  ride.create(body, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(data);
  });
});

// -----
// Rides
// -----
app.post("/rides/get", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  // res.status(200).send(body);
  // return;
  ride.find(
    {
      "Destination.name": body.name,
      "Destination.postalCode": body.postalCode,
    },
    (err, values) => {
      (() => {
        const Rides = values;
        let FoundRides = [];
        Rides.forEach((Ride) => {
          FoundRides.push({
            _id: Ride._id,
            Destination: Ride.Destination.name + ", " + Ride.Destination.street,
            Driver_id: Ride.Driver_id,
          });
        });
        values = FoundRides;
      })();
      if (err) res.status(500).send(err);
      else res.status(200).send(typeof values == Object ? [values] : values);
    }
  );
});
app.post("/rider/get/data", (req, res) => {
  const body = req.body;
  rider.find(
    {
      _id: body.RIDER_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/driver/get/data", (req, res) => {
  const body = req.body;
  driver.find(
    {
      _id: body.DRIVER_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/request", (req, res) => {
  const body = req.body;
  ride_request.create(
    {
      Ride: body.RIDE_ID,
      Rider: body.RIDER_ID,
      PickupLocation: body.PickupLocation,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});

app.post("/ride/get/request", (req, res) => {
  const body = req.body;
  // res.status(200).send("reached");
  // return;
  ride_request.findOne(
    {
      RIDE_ID: body.RIDE_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/request/delete", (req, res) => {
  const body = req.body;
  ride_request.deleteOne(
    {
      Ride: body.RIDE_ID,
      Rider: RIDER_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/update/initial/alpha", (req, res) => {
  const body = req.body;
  ride.update(
    {
      _id: body.RIDE_ID,
    },
    {
      "Rider.Alpha": body.RIDER_ID,
      Direction: "PickUp",
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});

app.post("/ride/update/initial/beta", (req, res) => {
  const body = req.body;
  ride.update(
    {
      _id: body.RIDE_ID,
    },
    {
      "Rider.Beta": body.RIDER_ID,
      Direction: "PickUp",
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/request/approve", (req, res) => {
  const body = req.body;
  ride_request_approved.create(
    {
      Ride: body.RIDE_ID,
      Rider: body.RIDER_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else {
        rider.findOne(
          {
            _id: body.RIDER_ID,
          },
          (err, __values) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(__values);
          }
        );
      }
    }
  );
});
app.post("/ride/get/data", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  ride.find(
    {
      _id: body.RIDE_ID,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/action/complete", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  ride.update(
    {
      _id: body.RIDE_ID,
    },
    {
      "Ride.Completed": true,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/ride/request/status", (req, res) => {
  // res.status(200).send("reached");
  // return;
  const body = req.body;
  let approved = false;
  let _RIDE = null;
  // check if approved
  ride_request_approved.find(
    {
      RIDE_ID: body.RIDE_ID,
      RIDER_ID: body.RIDER_ID,
    },
    (err, values) => {
      // values = values[0];
      // _RIDE = typeof values;
      // _RIDE = values[0].RIDER_ID + "===" + body.RIDER_ID;
      // if (values.RIDER_ID == body.RIDER_ID) {
      if (values.length != 0) {
        // Approved
        approved = true;
        // delete from ride_request_approved and ride_request
        ride_request.deleteMany(
          {
            Ride: body.RIDE_ID,
            Rider: body.RIDER_ID,
          },
          (err2, values2) => {
            ride_request_approved.create(
              {
                RIDE_ID: body.RIDE_ID,
                RIDER_ID: body.RIDER_ID,
              },
              (err3, values3) => {
                // res.status(200).send({ approved, _RIDE: true });
                if (err3) res.status(500).send(err);
                else res.status(200).send(approved);
                return;
                // Get Ride Info
                ride.find({ _id: body.RIDE_ID }, (err4, values4) => {
                  _RIDE = values4;
                  // Get Driver Info
                  driver.findOne({ _id: _RIDE.Driver_id }, (err5, values5) => {
                    _RIDE.Driver = values5;
                    // now get riders info
                    _RIDE.Rider.Alpha = body.RIDER_ID;
                    rider.findOne(
                      { _id: _RIDE.Rider.Alpha },
                      (err6, values6) => {
                        // check if rider 2 has a id
                        _RIDE.Rider.Alpha = values6;
                        if (_RIDE.Rider.Beta != "") {
                          rider.findOne(
                            { _id: _RIDE.Rider.Alpha },
                            (err7, values7) => {
                              _RIDE.Rider.Beta = values7;
                            }
                          );
                        }
                      }
                    );
                  });
                });
              }
            );
          }
        );
      } else res.status(200).send(approved);

      // if (err) res.status(500).send(err);
      // else res.status(200).send({ approved, _RIDE });
      // else res.status(200).send(approved ? _RIDE : "not approved");
      // Some code remains
    }
  );
});

app.post("/location/push", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  coordinates.deleteMany(
    {
      User_id: body.User_id,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      // else res.status(200).send(values);
    }
  );
  coordinates.create(
    {
      User_id: body.User_id,
      coordinates: body.coordinates,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      // else res.status(200).send(values);
    }
  );
});

app.post("/driver/history", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  ride.find(
    {
      Driver: body.Driver_id,
      // Completed: true,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});
app.post("/rider/history", (req, res) => {
  const body = req.body;
  // res.status(200).send(body);
  // return;
  ride.find(
    {
      "Rider.Alpha": body.Rider_id,
      "Rider.Beta": body.Rider_id,
    },
    (err, values) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(values);
    }
  );
});

// exports.app = functions.https.onRequest(app);

// Listener
// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`);
// });
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

// "dependencies": {
//   "axios": "^0.21.4",
//   "body-parser": "^1.19.0",
//   "cors": "^2.8.5",
//   "dotenv": "^10.0.0",
//   "ejs": "^3.1.6",
//   "express": "^4.17.1",
//   "mongoose": "^6.0.5",
//   "multer": "^1.4.3",
//   "react-loader-spinner": "^4.0.0",
//   "react-native-loader": "^1.3.1",
//   "validator": "^13.6.0"
// },
