// file: index.js


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// Parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: "Express is up!" });
});

app.post("/login", (req, res) => {

  if (req.body.name && req.body.password) {
    const name = req.body.name;
    const password = req.body.password;
    const user = users[_.findIndex(users, {name: name})];
    if (!user) {
      res.sendStatus(401).json({message: "No such user found"});
    }

    if (user.password === password) {
      // We will identify the user by the id which is the only
      // personnalized value to goes into our token
      const payload = {id: user.id};
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: 'OK', token: token});
    } else {
      res.status(401).json({message: "passwords did not match"});
    }
  } else {
    res.status(401).json({message: "missing username or password"});
  }
});

app.get('/secret', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json("Success! You can't see this without a token!");
});

app.listen(3000, () => {
  console.log("Express is running");
});

const users = [
  {
    id: 1,
    name: 'hle',
    password: 'h_pass'
  },
  {
    id: 2,
    name: 'test',
    password: 't_pass'
  }
];

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = "tasmanianDevil";

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  console.log('Payload was received', jwtPayload);
  const user = users[_.findIndex(users, {id: jwtPayload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

