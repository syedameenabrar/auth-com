const authRouter = require("./auth");
const userRouter = require("./user");
const dealerRouter = require("./dealer");
const adminRouter = require("./admin");
const staffRouter = require("./staff");

const routes = (app) => {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/dealer", dealerRouter);
  app.use("/admin", adminRouter);
  app.use("/staff", staffRouter);
};

module.exports = routes;
