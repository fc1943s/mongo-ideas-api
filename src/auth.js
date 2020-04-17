const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const UserModel = require('./model/user');


const jwtPrivateKey = 'private_key'; // wrong place :-)

function registerMiddleware() {
  passport.use('jwt', new passportJwt.Strategy({
    secretOrKey: jwtPrivateKey,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  }, async (token, done) => {
    try {
      return done(null, token);
    } catch (err) {
      done(err);
    }
  }));
}

function registerRoute() {
  passport.use('login', new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({email});
      if (!user) {
        return done(null, false, {message: 'User not found'});
      }
      const authenticated = await user.authenticate(password);
      if (!authenticated) {
        return done(null, false, {message: 'Wrong Password'});
      }
      return done(null, user, {message: 'Logged in successfully'});
    } catch (err) {
      return done(err);
    }
  }));
}

function signJwtToken(userId, workspaceId) {
  return jwt.sign({
    userId,
    workspaceId,
  }, jwtPrivateKey, {
    expiresIn: '1d',
  });
}

async function authenticate(req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }

      if (!user) {
        console.log(`Auth error (user ${user.name}): ${info.message}`);
        return res.status(401).send({error: info.message});
      }

      await req.login(user, {session: false});

      const token = signJwtToken(user._id);

      return res.json(token);
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
}

const auth = {
  initialize: () => {
    registerMiddleware();
    registerRoute();
    return passport.initialize();
  },
  signJwtToken,
  authenticate,
  hashPassword: (password) => bcrypt.hashSync(password, 10),
  middleware: passport.authenticate('jwt', { session: false }),
};

module.exports = auth;
