import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Cloudflare from "cloudflare"


const client = new Cloudflare({
  apiEmail: process.env['CLOUDFLARE_EMAIL'],
  apiKey: process.env['CLOUDFLARE_API_KEY'],
});


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, resolution = "256" } = body;

    if (!client.apiKey) {
      return new NextResponse("Cloudflare API Key not configured", { status: 500 });
    }

    if (!client.apiEmail) {
      return new NextResponse("Cloudflare API Email not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const input = {
      prompt,
      height: parseInt(resolution),
      width: parseInt(resolution)
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env['CLOUDFLARE_ACCOUNT_ID']}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        headers: { Authorization: `Bearer ${process.env['CLOUDFLARE_API_KEY']}` },
        method: "POST",
        body: JSON.stringify(input),
      }
    );

    const imageBlob = await response.blob();
    console.log(imageBlob);
    return new NextResponse(imageBlob)

  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
