const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// CORS config.
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
 
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;
// get driver connection (from mongodb ATLAS cloud :^))
const dbo = require("./db/conn");
 
// Passport/Express Sessions for User authentication & authorization.
const session = require('express-session');
const passport = require('passport');
//require('./passport/localStrategy')(passport)
 
// import routes...
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
// import User model...
const user = require('./models/user')
const seedDB = require('./seeds/seed');
const morgan = require('morgan');
 
const app = express();
 
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "REDDIT API DOCUMENTATION",
      description: "This is the API documentation for the reddit clone, dealing with posting, commenting and creation of new users",
      contact: {
        name: "samuel wanza",
        email: "s.wanza@alustudent.com"
      },
      servers: [""]
    }
  },
  // ['.routes/*.js']
  apis: ["server.js"]
};
/**
 * @swagger
 * /posts:
 *  get:
 *    description: Use to request all posts
 *    responses:
 *      '200':
 *        description: A successful response
 * /posts/post_id:
 *  get:
 *    description: Use to request all posts
 *    responses:
 *      '200':
 *        description: A successful response
 *              
 *  
 *
 */
 
 
/**
* @swagger
* /posts/new:
 *  post:
 *    description: creating a new post
 *    responses:
 *      '200':
 *        description: A successful response
*/
 
 
/**
* @swagger
* /posts/delete/post_id:
*   post:
*     summary: Remove the post by id
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The post id
*
*     responses:
*       200:
*         description: The post was deleted
*       404:
*         description: The post was not found
*/
 
 
/**
 * @swagger
 * /comments:
 *  get:
 *    description: Returns all the comments
 *    responses:
 *      '200':
 *        description: A successful response
 */
 
/**
* @swagger
* /comments/new:
 *  post:
 *    description: creating a new comment
 *    responses:
 *      '200':
 *        description: A new comment successfully created
*/
 
 
/**
 * @swagger
/register:
 *  post:
 *    description: Register a new user
 *    responses:
 *      '200':
 *        description: User successfully signed up
 */
 
 
/**
 * @swagger
/login:
 *  post:
 *    description: logging in to your account
 *    responses:
 *      '200':
 *        description: A user successfully logged in
 */
 
/**
 * @swagger
/logout:
 *  post:
 *    description: logging out of your account, Terminating your session
 *    responses:
 *      '200':
 *        description: A successful response
 */
 
 
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

 
require('./passport/passport')(passport);
 
//require('./passport')(passport);
//app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')) // console logs requests for debugging. (NOTE: has to be right after app...)
app.use(express.json());
app.use(cors(corsOptions));
dbo
 
// Configure express-sessions middleware
app.use(cookieParser('youmustbearedditor'));
const sessionConfig = session({
  secret: 'youmustbearedditor',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
})
app.use(sessionConfig);
app.use(bodyParser.urlencoded({ extended: false })); // We are parsing URL-encoded data from the body
 
// Passport
app.use(passport.initialize()); // Middleware to use Passport with Express
app.use(passport.session()); // Needed to use express-session with passport
 
 
app.use((req, res, next) => { // [Debugging]
  console.log('req.session:', req.session);
  console.log('req.user:', req.user); // not working here...
  next();
});
 
// Routing middleware
 
app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
 
 
 
 
// Start listening for requests...
// callback: try to connect to mongodb atlas db after server starts
//app.use(express.static("public"));
// app.get("*", function(req,res){
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// })
app.listen(port, async () => {
  // No errors, we are good to go!
  console.log(`Server is running on port: ${port}`);
  // await seedDB();
  // console.log(`Seeds planted.`);
});
 
 
 

