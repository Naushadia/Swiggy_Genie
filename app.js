const express = require("express");
const path = require('path');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require("cron");

const deleteUserData = require("./deleteUserData");

dotenv.config('./.env');

var db = require('./models');

const authRoutes = require("./Routes/authRoute");
const orderRoutes = require("./Routes/oderListRoute");
const driverRoutes = require("./Routes/driverRoute");
const profileROute = require('./Routes/profileRoute');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/auth", authRoutes);
app.use(orderRoutes);
app.use(driverRoutes);
app.use(profileROute);

const PORT = process.env.PORT || 3001;

app.listen(PORT);

// Setup cron job to delete user data
const cronJob = new cron.CronJob(
    "37 11 * * *", // Run every day at 11:15 AM according to India time standard
    async () => {
      await deleteUserData(); // Call function to delete user data
    },
    null,
    true,
    "Asia/Kolkata" // Set timezone to India Standard Time
  );
  
  // Start the cron job
  cronJob.start();

  module.exports = app;
