import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    const keywordExists = await prisma.keyword.findFirst({
      where: { name: keyword },
    });
    return NextResponse.json(!!keywordExists);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check keyword " + error },
      { status: 500 }
    );
  }
}
