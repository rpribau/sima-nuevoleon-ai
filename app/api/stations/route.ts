import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data', 'stations');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationName = searchParams.get('station');

  if (!stationName) {
    return NextResponse.json({ error: "Station name is required" }, { status: 400 });
  }

  try {
    const filePath = path.join(dataDirectory, `${stationName.toLowerCase()}.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const stationData = JSON.parse(fileContents);
    
    return NextResponse.json(stationData);
  } catch (error) {
    console.error('Error loading station data:', error);
    return NextResponse.json({ error: `Failed to load data for ${stationName}` }, { status: 500 });
  }
}
