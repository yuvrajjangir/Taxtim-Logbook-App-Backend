const express = require('express');
const connection = require('./config/db');
const cors = require("cors");
const {userController} = require("./routes/user.route");
const expenseRoutes = require('./routes/expenserouter');
const app = express();
const locationRoutes = require('./routes/location.route');
const bodyParser = require('body-parser');
const {triprouter} = require("./routes/trip.route")
const {statsRouter} = require("./routes/statsrouter");
const pdfRoute = require('./routes/pdfRoute'); 
// const verifyToken = require('./middleware/verifytoken'); 
const PORT = process.env.PORT;
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/", userController);
app.use('/trips', triprouter);
app.use('/locations', locationRoutes);
app.use('/expenses', expenseRoutes);
app.use('/logbook', statsRouter);
app.use('/', pdfRoute);

app.listen(PORT, async() => {
    try {
        await connection
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
    console.log(`Listening on ${PORT}`);
})