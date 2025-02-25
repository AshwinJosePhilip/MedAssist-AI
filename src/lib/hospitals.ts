import axios from "axios";

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

export interface Hospital {
  name: string;
  distance: string;
  address: string;
  phone?: string;
  coordinates: [number, number];
}

export async function findNearbyHospitals(query: string, limit: number = 5) {
  try {
    const response = await axios.get(NOMINATIM_API, {
      params: {
        q: `hospital ${query}`,
        format: "json",
        limit,
        amenity: "hospital",
      },
      headers: {
        "User-Agent": "TempoMedicalAssistant/1.0",
      },
    });

    return response.data.map((item) => ({
      name: item.display_name.split(",")[0],
      distance: "~" + ((Math.random() * 5).toFixed(1) + " miles"), // Simulated distance
      address: item.display_name,
      coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
      phone:
        "+1-" +
        Math.floor(Math.random() * 900 + 100) +
        "-" +
        Math.floor(Math.random() * 900 + 100) +
        "-" +
        Math.floor(Math.random() * 9000 + 1000), // Simulated phone
    }));
  } catch (error) {
    console.error("Error finding hospitals:", error);
    return [];
  }
}
