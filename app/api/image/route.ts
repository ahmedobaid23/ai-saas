import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "imagen-3.0-generate-002",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = "1", aspectRatio = "1:1" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!model.apiKey) {
      return new NextResponse("Gemini API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!aspectRatio) {
      return new NextResponse("Aspect Ratio is required", { status: 400 });
    }

    // return NextResponse.json(result?.response?.candidates?.[0].content ?? null);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
