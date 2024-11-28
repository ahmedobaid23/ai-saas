import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// let chatHistory: any[] = [];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { userMessage } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!model.apiKey) {
      return new NextResponse("Gemini API Key not configured", { status: 500 });
    }

    if (!userMessage) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const result = await model.generateContent(userMessage);
    return NextResponse.json(result.response.text());
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
