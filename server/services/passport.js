const keys = require('../config/keys.js')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null,user.id);
});

passport.deserializeUser( (id, done) => {
  User.findById( id ).then( (user) => {
    done(null, user);
  })
});

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOne({
      googleId: profile.id
    }).then((existingUser) => {
      if (existingUser) {
        console.log("EXISTING USER");
        console.log(existingUser.id);
        console.log(existingUser.googleId);
        console.log(existingUser.name);
        done(null, existingUser);
      } else {
        new User({
          googleId: profile.id,
          name: profile.name.givenName + " " + profile.name.familyName
        }).save().then((user) => {
          console.log("NEW USER");
          console.log(user.id);
          console.log(user.googleId);
          console.log(user.name);
          done(null, user);
        });
      }

    })
  }
));