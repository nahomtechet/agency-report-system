import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Agency name is required" }, { status: 400 })
    }

    const agency = await prisma.agency.create({
      data: { name: name.trim() },
    })

    return NextResponse.json(agency)
  } catch (error) {
    return NextResponse.json({ error: "Agency might already exist" }, { status: 400 })
  }
}
