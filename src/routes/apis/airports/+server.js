import { APININJAS } from "$env/static/private";
import { addParamsString } from "../../../hooks.client.js";

const airportUrl = new URL("https://api.api-ninjas.com/v1/airports");

export async function POST({ request }) {
  const { airport } = await request.json();
  const newUrl = addParamsString(
    airportUrl,
    airport.length == 3
      ? { iata: airport }
      : airport.length == 4
      ? { icao: airport }
      : { name: airport }
  );
  const response = await fetch(newUrl, {
    headers: { "X-Api-Key": APININJAS },
  });
  return response;
}
