const express  = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const keys = require('./config/keys.js')
require('./models/User.js')
require('./services/passport.js')

mongoose.connect(keys.MONGOURL);

const app = express();

app.use(
    cookieSession({
        maxAge: 30*24*60*1000,
        keys: [keys.COOKIE_KEY]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/outhRoutes.js')(app);

app.listen(8080);
