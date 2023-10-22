import { APININJAS } from "$env/static/private";
import { addParams } from "../../../hooks.client.js";

const airportUrl = new URL("https://api.api-ninjas.com/v1/airports");

export async function POST({ request }) {
  const { airport } = await request.json();
  addParams(
    airportUrl,
    airport.length == 3
      ? { iata: airport }
      : airport.length == 4
      ? { icao: airport }
      : { name: airport }
  );
  const response = await fetch(airportUrl, {
    headers: { "X-Api-Key": APININJAS },
  });
  return response;
}
