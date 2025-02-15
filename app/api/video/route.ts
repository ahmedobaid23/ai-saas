import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    const client = await Client.connect("ByteDance/AnimateDiff-Lightning");

    const { userId } = await auth();
    const body = await req.json();
    const { prompt, type, motion } = body;

    console.log(body);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await client.predict("/generate_image", {
      prompt,
      base: type,
      motion: "",
      step: "1",
    });

    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
