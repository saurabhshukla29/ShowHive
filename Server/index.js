require('dotenv').config();
const app = require('./app');
const database = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

const Port = process.env.PORT || 8000;

database.connect();
cloudinaryConnect();

app.listen(Port, () => {
    console.log(`App is running at port ${Port}`);
});