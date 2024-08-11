import { NextResponse } from 'next/server';
import axios from 'axios';
export async function GET() {
  const response = await axios.get("https://ayru-project.onrender.com/api/availability/check-expired")
  console.log(response);

  return NextResponse.json({ ok: true });
}