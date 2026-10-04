const express=require('express');
const cors = require("cors");
const app=express();
const bodyParser = require("body-parser");

const userRoutes = require("./routes/User");
const eventsRoutes = require("./routes/events");
const musicRoutes = require("./routes/music");
const sportsRoutes = require("./routes/sports");
const playsRoutes = require("./routes/plays");
const profileRoutes=require("./routes/Profile");
const ticketsRoutes=require("./routes/tickets");
const paymentRoutes=require("./routes/payments")

const fileUpload = require("express-fileupload");

require('dotenv').config();
const database=require('./config/database');
const {cloudinaryConnect}=require('./config/cloudinary');
const Port=process.env.PORT || 8000;

database.connect();
cloudinaryConnect();
app.use(express.json());
app.use(cors());	
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
app.use(bodyParser.json({ limit: "500mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use("/api/v1", userRoutes);
app.use("/api/v1", eventsRoutes);
app.use("/api/v1", musicRoutes);
app.use("/api/v1", sportsRoutes);
app.use("/api/v1", playsRoutes);
app.use("/api/v1",profileRoutes);
app.use("/api/v1",ticketsRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.listen(Port,()=>{
    console.log(`App is running at port ${Port}`);
})

module.exports = app;