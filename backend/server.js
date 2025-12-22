const express = require("express")
const app = express();
const dotenv = require ("dotenv").config()
const cors = require ('cors')
const bcrypt = require("bcryptjs");
const connectDB = require("./config/connectionDb")
connectDB()
app.use(express.json());
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const port = process.env.PORT || 3000;

app.use(express.static("public"))

app.use("/",require("./routes/user"))

app.use("/recipe",require("./routes/recipe"))

app.use("/user", require("./routes/user"));



app.listen(port,()=>{
    console.log(`app is listning at ${port}`);
    
})
