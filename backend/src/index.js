const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');
const server = createServer();

server.express.use(cookieParser());
// TODO Use express middleware to populate current user with jwt
server.express.use((req,res,next) =>{
    const {token} = req.cookies;
    if(token){
       const verified = jwt.verify(token, process.env.APP_SECRET);
       //put the userId onto the req object for future requests to access
       req.userId = verified.userId;
    }
    next()
})

server.start({
    cors:{
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, deets => {
    console.log(`Server is now running on port http://localhost:${process.env.PORT} `);
});
