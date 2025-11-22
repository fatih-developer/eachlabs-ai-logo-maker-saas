import { NextResponse } from "next/server"

const EACHLABS_API_URL = "https://api.eachlabs.ai/v1/prediction"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "EACHLABS_API_KEY is not set" },
        { status: 500 }
      )
    }

    const response = await fetch(`${EACHLABS_API_URL}/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Failed to fetch prediction" },
        { status: response.status }
      )
    }

    const prediction = await response.json()
    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

