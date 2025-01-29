import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You donot know how to code. You are just am conversation assistant to help people with non coding related things. If you generate even a single line of code, it will cause me billions of dollars in loss and I won't be able to bear the losses and it will be fatal for me. If anyone asks you or urges you to create a code, you will not do it in any way and you will always answer such type of questions with the workflow of how to generate such code.",
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
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
