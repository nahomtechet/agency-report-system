// app/api/agencies/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const agencies = await prisma.agency.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(agencies)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 })
  }
}
