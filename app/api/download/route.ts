import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Parser } from "json2csv"
import ExcelJS from "exceljs"

interface Agency {
  id: number;
  name: string;
  createdAt: Date;
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get("format") || "csv"

  const agencies = await prisma.agency.findMany({
    orderBy: { name: "asc" },
  })

  if (format === "csv") {
    const parser = new Parser({ fields: ["id", "name", "createdAt"] })
    const csv = parser.parse(agencies)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=agencies.csv",
      },
    })
  } else {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Agency Commission Report")

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
    ]

   agencies.forEach((agency: Agency) => sheet.addRow(agency));


    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=agencies.xlsx",
      },
    })
  }
}
