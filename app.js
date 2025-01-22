// *INIT EXPRESS
const express = require("express");
const app = express();


app.use(express.json());

const propertiesRouter = require("./routers/propertiesRouter");
app.use("/api/properties", propertiesRouter);

const {HOST_DOMAIN, HOST_PORT} = process.env;






app.listen(HOST_PORT, () => {
  console.log(`Server listening at ${HOST_DOMAIN}:${HOST_PORT}`);
});