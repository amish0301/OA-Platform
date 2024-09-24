const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const User = require("../db/user.model");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const passportUtil = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 5 * 60 * 1000, // 5 min
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: 'none' 
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              profileImage: profile.photos[0].value,
              password: Date.now().toString(),
            });
            
            user.refreshToken = await user.generateRefreshToken();
            await user.save({ validateBeforeSave: false });
          }

          return cb(null, user);
        } catch (error) {
          return cb(error,null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = passportUtil;
