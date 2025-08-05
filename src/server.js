const express = require('express');
const morgan = require('morgan');
require("dotenv").config();
const knex = require("./config/db");  
const mainRoute = require("./mainRoute");
const cors = require('cors');
const { StatusCodes } = require('http-status-codes');
const { sendResponse } = require('./common/helper');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use("/api/v1", mainRoute);

app.use("/", (req, res) => {
    return sendResponse({
        res,
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Api route not found",
    });

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

