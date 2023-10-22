import { APININJAS } from "$env/static/private";
import { addParams } from "../../../hooks.client.js";

export async function POST({ request }) {
  const { type, manu, model } = await request.json();
  const airplaneUrl = new URL(
    type === "airplane"
      ? "https://api.api-ninjas.com/v1/aircraft"
      : "https://api.api-ninjas.com/v1/helicopter"
  );
  addParams(airplaneUrl, { manufacturer: manu, model });
  const response = await fetch(airplaneUrl, {
    headers: { "X-Api-Key": APININJAS },
  });
  return response;
}
