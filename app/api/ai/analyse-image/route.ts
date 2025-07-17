import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { spawn } from "child_process"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save the uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    // Run AI analysis using the Kaggle-trained model
    const analysisResult = await analyzeImageWithKaggleModel(filepath)

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      filename: filename,
      model_version: "Kaggle Pothole Detector v2.0",
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function analyzeImageWithKaggleModel(imagePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), "scripts", "predict_image_kaggle.py")
    const pythonProcess = spawn("python", [pythonScript, imagePath])

    let result = ""
    let error = ""

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString()
    })

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const analysis = JSON.parse(result)
          resolve(analysis)
        } catch (e) {
          reject(new Error(`Failed to parse AI analysis result: ${result}`))
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${error}`))
      }
    })

    // Set timeout for long-running predictions
    setTimeout(() => {
      pythonProcess.kill()
      reject(new Error("AI analysis timed out"))
    }, 30000) // 30 second timeout
  })
}
