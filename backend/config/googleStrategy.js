import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserTypeModel } from "../models/UserTypeModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "http://localhost:3000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        let user =
          await UserTypeModel.findOne({
            email: profile.emails[0].value,
          });

        if (!user) {

          user =
            await UserTypeModel.create({

              firstName:
                profile.name.givenName,

              lastName:
                profile.name.familyName,

              email:
                profile.emails[0].value,

              role: "USER",

              googleId:
                profile.id,

              profileImageUrl:
                profile.photos[0].value,

              password:
                "GOOGLE_AUTH_USER",
            });
        }

        return done(null, user);

      } catch (err) {

        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id, done) => {

    try {

      const user =
        await UserTypeModel.findById(id);

      done(null, user);

    } catch (err) {

      done(err, null);
    }
  }
);