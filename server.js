const app = require('./app.js');
require("dotenv").config();
const { connectDB } = require('./utils/db.js');

const port = process.env.PORT; 
// creating a server
app.listen(port, ()=>{
    console.log(`Server is Running at ${port}`);
    connectDB();
})