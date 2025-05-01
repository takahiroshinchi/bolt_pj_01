import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log("POST /api/favorites - userId:", userId);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { articleId } = await req.json();
    console.log("POST /api/favorites - articleId:", articleId);

    // ユーザーが存在しない場合は作成
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        articleId,
      },
    });
    console.log("Created favorite:", favorite);

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    console.log("DELETE /api/favorites - userId:", userId);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { articleId } = await req.json();
    console.log("DELETE /api/favorites - articleId:", articleId);
    
    await prisma.favorite.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    console.log("Deleted favorite - userId:", userId, "articleId:", articleId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    console.log("GET /api/favorites - userId:", userId);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { articleId: true },
    });
    console.log("Found favorites:", favorites);

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 