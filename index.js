// api routers
module.exports.authRoutes = require("./routes/index")
// this.authRoutes()

module.exports.tokenType = require("./middlewares/token")
// this.tokenType.signToken()

module.exports.authorized = require("./auth/verify");
// this.authorized.verifyJWT

// 1. config
// 2. auth+user apis
// 3. middleware function
// 4. verify token


// const express = require("express");
// const routes = require("./routes/index");
// const { logger, AppError, openDataBase, globalError } = require("database-connection-function-com")

// const app = express();
// app.use(express.json({ limit: "20mb" }));
// app.use(express.urlencoded({ limit: "20mb", extended: true }));


// routes(app);

// app.use(globalError.errorHandler)

// app.listen(5000, async () => {
//     console.log(`App is running on port 5000`);
//     await openDataBase.openDBConnection("mongodb://127.0.0.1:27017/factory")
// })