const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")


const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true,
})); 

// require all the routes here 
const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")


// using all the routes here
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

// Error handling middleware for multer and other errors
app.use((err, req, res, next) => {
    console.error("Error:", err.message)
    
    if (err.name === 'MulterError') {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({ message: "File size exceeds 5MB limit" })
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: "Too many files uploaded" })
        }
        return res.status(400).json({ message: err.message })
    }
    
    if (err.message === 'Only PDF and DOCX files are allowed') {
        return res.status(400).json({ message: err.message })
    }
    
    return res.status(500).json({ message: err.message || "Internal server error" })
})

module.exports=app;