const pdfParse = require("pdf-parse")

// console.log("PDF PARSE EXPORT:", pdfParse)
// const pdfjs = require("pdfjs-dist")
const {generateInterviewReport,generateResumePdf}=require("../services/ai.service")
const interviewReportModel=require("../models/interviewreport.model")

// Configure pdfjs worker
// pdfParse.default = pdfParse
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`


// frontned se 3 chize aaegi job,self description and resume in pdf form so phle use pdf ko handle krne packGE multer install kia
// pdf content ko extract krne we installed pdf-parse package
/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({ message: "Job description is required." })
        }

        let resumeText = ""
        if (req.file) {
            try {
                // console.log("File received:", {
                //     filename: req.file.originalname,
                //     mimetype: req.file.mimetype,
                //     size: req.file.size,
                //     bufferSize: req.file.buffer.length
                // })
                
               const resumeContent = await (
    new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer)
    )
).getText()

resumeText = resumeContent.text
                // console.log("PDF parsed successfully, extracted text length:", resumeText.length)
            } catch (pdfError) {
                console.error("PDF parsing error:", pdfError.message)
                return res.status(400).json({ 
                    message: "Error parsing PDF file. Please ensure it's a valid PDF.",
                    error: pdfError.message 
                })
            }
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({ message: "Either resume or self description is required." })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
//         console.log(
//     "AI RESPONSE:",
//     JSON.stringify(interViewReportByAi, null, 2)
// )

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title: interViewReportByAi.title || "Untitled Position",  // ✅ fallback
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error." })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self 
 * description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    // interview ke andr se id nikali
    const { interviewReportId } = req.params
// chck whether is id se koi report h bhi ya ni
    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }
// report ke andr se resume,job and self description
    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController,
     getInterviewReportByIdController,
      getAllInterviewReportsController, generateResumePdfController }
    // phli api interview report create kregi,dusri api ek specific interview report dikhaegi with thr help of id
    //  and tessri user ne jitni interview reports create kri h sari ek bar me fetch kr skte h
// in api,s ko handle krne we make interview.api.js