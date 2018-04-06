'use strict';

const express = require('express');
const morgan = require('morgan');
const queryString = require('query-string');

const app = express();

app.use(morgan(':date[iso] :method :url :response-time'));

const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  // ...other users
];

function gateKeeper(req, res, next) {
  
  const header = queryString.parse(req.get('x-username-and-password'));
  const user = header.user || null;
  const pass = header.pass || null;
  console.log("user is: " + user);
  console.log("pass is: " + pass);

  req.user = USERS.find(
    (usr, index) => usr.userName === user && usr.password === pass);

  console.log(`selected user is: ${req.user}`);
  next();
}

app.use(gateKeeper);

app.get("/api/users/me", (req, res) => {
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

// ... start the app
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));