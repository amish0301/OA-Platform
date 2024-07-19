const express = require("express");
const cors = require("cors");
const connectDB = require('./db/connection.js');
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const session = require("express-session");
const passport = require("./auth/passport");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./utils/helper.js");

require("dotenv").config();

const app = express();
connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URI,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/user", userRoutes); 

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port ", process.env.PORT || 5000);
});


// video url for OAuth: https://youtu.be/yICiz12SdI4