const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection.js");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const testRoutes = require("./routes/test.route.js");
const adminRoutes = require("./routes/admin.route.js");
const path = require("path");
const passport = require("./auth/passport.js");
const cookieParser = require("cookie-parser");
const { corsOptions } = require("./constants/config.js");
const { ErrorHandler } = require("./middleware/ErrorHandler.js");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
passport(app);

// middleware for passport

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
