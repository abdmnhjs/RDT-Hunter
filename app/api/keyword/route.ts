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
    const { name, subreddit } = await request.json();
    const keyword = await prisma.keyword.create({
      data: { name, subreddit: subreddit || null },
    });
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
    // Trouver les posts qui n'ont que ce keyword
    const postsToDelete = await prisma.postSaved.findMany({
      where: {
        keywords: {
          some: { id },
          none: { NOT: { id } },
        },
      },
    });
    // Supprimer ces posts
    if (postsToDelete.length > 0) {
      await prisma.postSaved.deleteMany({
        where: {
          id: {
            in: postsToDelete.map((post) => post.id),
          },
        },
      });
    }
    // Supprimer le keyword
    await prisma.keyword.delete({ where: { id } });
    return NextResponse.json({
      message: `Keyword deleted with ${postsToDelete.length} associated posts`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete keyword " + error },
      { status: 500 }
    );
  }
}
