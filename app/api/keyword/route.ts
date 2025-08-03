import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany();
    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch keywords " + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const keyword = await prisma.keyword.create({ data: { name } });
    return NextResponse.json(keyword);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create keyword " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.keyword.delete({ where: { id } });
    return NextResponse.json({ message: "Keyword deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete keyword " + error },
      { status: 500 }
    );
  }
}
