// app/api/register/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Agency name is required" }, { status: 400 })
    }

    const normalized = name.trim().toLowerCase() // normalize for duplicate check

    // Check if an agency already exists
    const exists = await prisma.agency.findFirst({
      where: {
        name: {
          equals: normalized,
          mode: "insensitive", // important: case-insensitive
        },
      },
    })

    if (exists) {
      return NextResponse.json({ error: "Agency already registered" }, { status: 400 })
    }

    // Create agency (store original casing if you want)
    const agency = await prisma.agency.create({
      data: { name: name.trim() },
    })

    return NextResponse.json(agency)
  } catch (error) {
    return NextResponse.json({ error: "Failed to register agency" }, { status: 500 })
  }
}
