const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection.js");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const testRoutes = require("./routes/test.route.js");
const adminRoutes = require("./routes/admin.route.js");
const path = require("path");
const passport = require("./auth/passport");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB(process.env.MONGO_URI);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// middleware for passport
passport(app);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/test', testRoutes);
app.use('/admin', adminRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port ", process.env.PORT || 5000);
});
