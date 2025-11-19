export async function getPlaceName(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Safara-App"
      }
    });

    const data = await res.json();
    return data.display_name || "Unknown Location";
  } catch (err) {
    console.error("Reverse Geocoding Error:", err);
    return "Unknown Location";
  }
}
