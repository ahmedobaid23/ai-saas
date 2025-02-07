import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

const API_KEY = process.env["CLOUDFLARE_API_KEY"];
const ACCOUNT_ID = process.env["CLOUDFLARE_ACCOUNT_ID"];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = "1" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!API_KEY) {
      return new NextResponse("Cloudflare API Key not configured", {
        status: 500,
      });
    }

    if (!ACCOUNT_ID) {
      return new NextResponse("Cloudflare Account ID not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    const input = {
      prompt,
    };

    const requests = Array.from({ length: amount }, () =>
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      )
    );

    const responses = await Promise.all(requests);
    const imageBlobs = await Promise.all(
      responses.map((response) => response.blob())
    );

    const imageBase64Strings = await Promise.all(
      imageBlobs.map(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString("base64");
      })
    );

    return new NextResponse(JSON.stringify(imageBase64Strings));
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
