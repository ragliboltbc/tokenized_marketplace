import { NextResponse } from "next/server";

const mockAssets = [
  { id: 1, name: "Luxury Car", assetType: "Car", brand: "Tesla", estimatedValue: 100, funded: 60 },
  { id: 2, name: "Beach House", assetType: "House", brand: "Modern", estimatedValue: 500, funded: 200 },
];

export async function GET() {
  return NextResponse.json({ assets: mockAssets });
} 