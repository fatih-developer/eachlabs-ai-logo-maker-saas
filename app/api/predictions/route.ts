import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { logoGenerations } from "@/db/schema"

const EACHLABS_API_URL = "https://api.eachlabs.ai/v1/prediction/"

const MODEL_MAP: Record<string, string> = {
  "nano-banana": "nano-banana",
  "seedream-v4": "seedream-v4-text-to-image",
  "reve-text": "reve-text-to-image",
}

export async function POST(req: Request) {
  let generationId: string | null = null

  try {
    const body = await req.json()
    const { appName, appFocus, color1, color2, model, outputCount } = body

    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "EACHLABS_API_KEY is not set" },
        { status: 500 }
      )
    }

    const selectedModel = MODEL_MAP[model]
    if (!selectedModel) {
      return NextResponse.json(
        { error: "Invalid model selected" },
        { status: 400 }
      )
    }

    const prompt = `iOS 16 uyumlu, minimalist ve modern bir uygulama simgesi taslağı oluşturun. Simge, yumuşak yuvarlak köşelere sahip kare bir arka plana sahip olmalı ve canlı ${color1} ile ${color2} renklerinden oluşan sofistike ve asimetrik coolwave bir degrade geçişi içermelidir. Merkeze yerleştirilmiş ${appFocus} temasını yansıtan ikon, sade, temiz ve kullanıcı dostu bir estetiğe sahip olmalı, zarif bir derinlik katmak için hafif gölge ve parlaklık efektleriyle desteklenmelidir. ${appName}'nin adını veya baş harflerini içeren metin, simgenin içinde veya yanında, şık ve yüksek okunabilirlik sağlayacak şekilde entegre edilmelidir. Tasarım, her boyutta netliğini ve tanınabilirliğini koruyarak ölçeklenebilir olmalıdır. Nihai sunum, beyaz, düz bir arka plan üzerinde yapılmalıdır.`

    const parsedOutputCount = Number.parseInt(`${outputCount ?? 1}`, 10)
    const outputCountValue = Number.isFinite(parsedOutputCount)
      ? Math.max(1, parsedOutputCount)
      : 1

    try {
      const [record] = await db
        .insert(logoGenerations)
        .values({
          appName,
          appFocus,
          color1,
          color2,
          model: selectedModel,
          outputCount: outputCountValue,
          prompt,
          status: "running",
        })
        .returning({ id: logoGenerations.id })

      generationId = record?.id ?? null
    } catch (error) {
      console.error("Failed to persist generation request:", error)
    }

    let input: Record<string, unknown> = {
      prompt,
      num_images: outputCountValue,
      sync_mode: false,
    }

    // Model specific parameters
    if (selectedModel === "nano-banana") {
      input = {
        ...input,
        output_format: "png",
        aspect_ratio: "1:1",
        limit_generations: true,
      }
    } else if (selectedModel === "seedream-v4-text-to-image") {
      input = {
        ...input,
        image_size: "square_hd",
        enable_safety_checker: true,
      }
    } else if (selectedModel === "reve-text-to-image") {
      input = {
        ...input,
        aspect_ratio: "1:1",
        output_format: "png",
      }
    }

    const response = await fetch(EACHLABS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: selectedModel,
        version: "0.0.1",
        input,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: error.message || "Failed to create prediction",
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      return NextResponse.json(
        { error: error.message || "Failed to create prediction" },
        { status: response.status }
      )
    }

    const prediction = await response.json()

    if (generationId) {
      const providerPredictionId = prediction?.id ?? prediction?.prediction?.id ?? null
      const imagesCandidate = prediction?.output ?? prediction?.images
      const imageList = Array.isArray(imagesCandidate)
        ? imagesCandidate.map((item: unknown) =>
            typeof item === "string" ? item : JSON.stringify(item)
          )
        : []

      try {
        await db
          .update(logoGenerations)
          .set({
            status: "succeeded",
            providerPredictionId,
            images: imageList,
            providerResponse: prediction,
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)

    if (generationId) {
      try {
        await db
          .update(logoGenerations)
          .set({
            status: "failed",
            error: "Internal server error",
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
