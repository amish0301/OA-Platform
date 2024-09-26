const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection.js");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const testRoutes = require("./routes/test.route.js");
const adminRoutes = require("./routes/admin.route.js");
const passport = require("passport");
const initializePassport = require("./auth/passport.js");
const cookieParser = require("cookie-parser");
const { ErrorHandler } = require("./middleware/ErrorHandler.js");
const session = require("express-session");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URI,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
connectDB(process.env.MONGO_URI);

// remove cookie for development it will work
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());

// passport initialize
initializePassport(passport);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/test", testRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.use(ErrorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port ", process.env.PORT || 5000);
});
