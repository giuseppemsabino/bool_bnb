// *INIT EXPRESS
const express = require("express");
const app = express();
const cors = require("cors");

const { HOST_DOMAIN, HOST_PORT, APP_FRONTEND_URL } = process.env;

// !CORSE CONFIG
const corsOptions = {
  origin: APP_FRONTEND_URL,
  optionsSuccessStatus: 200,
};

//! MIDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use("/public", express.static("public"));

//! ROUTERS
const propertiesRouter = require("./routers/propertiesRouter");
app.use("/api/properties", propertiesRouter);

//! ERROR HANDLERS
const errorsHandler = require("./middlewares/errorsHandler");
const notFound = require("./middlewares/notFound");

app.use(notFound);
app.use(errorsHandler);

app.listen(HOST_PORT, () => {
  console.log(`Server listening at ${HOST_DOMAIN}:${HOST_PORT}`);
});
