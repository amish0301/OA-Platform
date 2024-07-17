const passport = require("passport");
const User = require("../db/user.model.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");

require("dotenv").config({path: path.resolve(__dirname, "../.env")});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {

        if (!profile.emails || !profile.emails.length) {
          throw new Error("No emails found in profile");
        }

        const defaultUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profileImage:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
        };

        let user = await User.findOne({
          $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
        });

        if (!user) {
          user = await User.create(defaultUser);
          await user.save();
        }

        console.log("User found or created:", user);
        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).catch((err) => {
      console.log("Error in deserializing");
      return done(err, null);
    });

    console.log("User:", user);
    if (user) done(null, user);
    else done(new Error("User not found"), null);
  } catch (error) {
    console.error("Error in deserializing user:", error);
    done(error, null);
  }
});

module.exports = passport;
