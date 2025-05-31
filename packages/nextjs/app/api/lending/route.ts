import { NextResponse } from "next/server";

const mockLending = [
  { id: 1, assetId: 1, lender: "0xabc...", amount: 10, timestamp: 1710000000 },
  { id: 2, assetId: 2, lender: "0xdef...", amount: 20, timestamp: 1710001000 },
];

export async function GET() {
  return NextResponse.json({ lending: mockLending });
} 