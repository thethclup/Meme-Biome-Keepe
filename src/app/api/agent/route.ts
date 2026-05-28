import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    name: "MemeBiom Orchestrator",
    description: "Meme biology and evolution orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "MemeBiom",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  return NextResponse.json({
    status: "success",
    message: "Agent endpoint active"
  }, { headers: CORS_HEADERS });
}
