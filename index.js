const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");


dotenv.config();
const app = express();

//const secretKey = 'my_secret_key';
const port = process.env.PORT || 8000;

//app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URL).catch(err => {console.log(err)})

//app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//AUTHENTICATION
//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
// app.post('/register', (req, res) => {
//   const { name, email, password } = req.body;

//   // create a new user object
//   const user = {
//     name,
//     email,
//     password
//   };

//   // save user object to database
//   // ...

//   res.json({ message: 'User created successfully' });
// });

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // check user credentials
//   // ...

//   // create JWT token
//   const token = jwt.sign({ email }, secretKey);

//   res.json({ token });
// });

// app.post('/refresh-token', (req, res) => {
//     const refreshToken = req.body.refreshToken;
  
//     if (!refreshToken) {
//       return res.status(401).json({ message: 'Refresh token is required' });
//     }
  
//     // verify refresh token
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Invalid refresh token' });
//       }
  
//       // create new access token
//       const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  
//       // send new access token to client
//       res.json({ accessToken });
//     });
// });

// async function connect() {
//   dotenv.config();
//   //const client = new mongodb.MongoClient(process.env.MONGODB_URL);
//   const port = process.env.PORT || 8000;

//   try {
//     // Connect to the MongoDB cluster
//       await mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       console.log("CONNECTED TO MongoDB");
//   }   catch (e) {
//       console.error(e);
//       process.exit(1);
//   }
// }
// connect().catch(console.error);

// function verifyToken(req, res, next) {
//     const token = req.headers['authorization'];
  
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }
  
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }
  
//       req.user = decoded;
//       next();
//     });
// }

// function verifyTokenWithRefresh(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const refreshToken = req.body.refreshToken;
  
//     if (!authHeader && !refreshToken) {
//       return res.status(401).json({ message: 'Access token or refresh token is required' });
//     }
  
//     const token = authHeader ? authHeader.split(' ')[1] : null;
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) {
//         if (err.name === 'TokenExpiredError') {
//           // access token is expired, try to refresh it
//           if (!refreshToken) {
//             return res.status(401).json({ message: 'Access token is expired and refresh token is missing' });
//           }
  
//           jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if (err) {
//               return res.status(403).json({ message: 'Invalid refresh token' });
//             }
  
//             const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  
//             // send new access token to client
//             res.set('Authorization', `Bearer ${accessToken}`);
//             next();
//           });
//         } else {
//           // access token is invalid
//           return res.status(403).json({ message: 'Invalid access token' });
//         }
//       } else {
//         // access token is valid
//         req.user = user;
//         next();
//       }
//     });
// }
    
// function verifyRole(role) {
//     return (req, res, next) => {
//       const { role: userRole } = req.user;
//       if (userRole !== role) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       next();
//     };
// }
  
// app.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
//     // only admin can access this API
//     res.json({ message: 'Hello Admin' });
// });
  
// app.get('/profile', verifyToken, (req, res) => {
//     const { email } = req.user;
    
//     // get user profile from database
//     const userProfile = getUserProfile(email);
  
//     if (!userProfile) {
//       return res.status(404).json({ message: 'User profile not found' });
//     }
  
//     const { name, profile } = userProfile;
    
//     res.json({ email, name, profile });
// });
 
// app.get('/profile', verifyTokenWithRefresh, (req, res) => {
//     const { email } = req.user;
  
//     // query user profile from database
//     User.findOne({ email }, (err, user) => {
//       if (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//       }
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const { name, profile } = user;
//       res.json({ email, name, profile });
//     });
// });
  
app.listen(port, () => {
  console.log(`Server running at http://localhost:` + port);
});

//JSON WEB TOKEN