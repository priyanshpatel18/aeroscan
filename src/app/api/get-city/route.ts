import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!body.lat || !body.lon) {
    return NextResponse.json({ error: "Latitude and Longitude are required", status: 400 });
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${body.lat},${body.lon}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK") {
      const addressComponents = data.results[0].address_components;
      const city = addressComponents.find((comp: any) =>
        comp.types.includes("locality")
      )?.long_name;

      return NextResponse.json({ city }, { status: 200 });
    } else {
      console.log("UNABLE");
      return NextResponse.json({ error: "Unable to fetch location" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch location data", status: 500 });
  }
}
