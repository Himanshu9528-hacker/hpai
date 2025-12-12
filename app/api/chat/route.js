import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Latest OpenAI recommended endpoint (Dec 2025)
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "You are HP AI, a friendly helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract assistant response
    const reply =
      response.output_text ||
      response.output[0]?.content[0]?.text ||
      "No response received";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
