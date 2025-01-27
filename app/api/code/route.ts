import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are only a code generator. You must answer only in markdown code snippets. You must use code comments for explainations. You should provide code explaination in bullet points.",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages, userMessage } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!model.apiKey) {
      return new NextResponse("Gemini API Key not configured", { status: 500 });
    }

    if (!messages && !userMessage) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const chat = model.startChat({
      history: messages,
    });

    const result = await chat.sendMessage(userMessage);
    return NextResponse.json(result?.response?.candidates?.[0].content ?? null);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
