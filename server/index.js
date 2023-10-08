const express = require('express');
const detenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect("mongodb+srv://root:quanglangprovip@cluster0.e84wig6.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Database not connected", err))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


app.use('/', require('./routes/authRoutes'));

const port = 8000;
app.listen(port, () => console.log(`Server are running in PORT:${port}`));