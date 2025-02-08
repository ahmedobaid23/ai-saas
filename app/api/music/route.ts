import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    const client = await Client.connect(
      "artificialguybr/Stable-Audio-Open-Zero"
    );

    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await client.predict("/predict", {
      prompt: prompt,
      seconds_total: 5,
      steps: 100,
      cfg_scale: 10,
    });

    console.log(response);

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
