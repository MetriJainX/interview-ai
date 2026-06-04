const multer=require("multer")
// since we only need temporary storage for file we used multer storage

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ]
    const allowedExtensions = ['.pdf', '.docx', '.doc']
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase()
    
    // console.log("File upload attempt:", {
    //     filename: file.originalname,
    //     mimetype: file.mimetype,
    //     extension: fileExtension
    // })
    
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true)
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false)
    }
}

const upload=multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {fileSize: 5*1024*1024}
}) // this will store the file in memory as a buffer
module.exports=upload;