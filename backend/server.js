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
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const port = process.env.PORT || 3000;

app.use(express.static("public"))

app.use("/",require("./routes/user"))

app.use("/recipe",require("./routes/recipe"))

app.use("/user", require("./routes/user"));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  console.error('Error stack:', err.stack)
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` })
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})



app.listen(port,()=>{
    console.log(`app is listning at ${port}`);
    
})
