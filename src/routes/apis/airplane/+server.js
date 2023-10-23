import { APININJAS } from "$env/static/private";
import { addParamsString } from "../../../hooks.client.js";

export async function POST({ request }) {
  const { type, manu, model } = await request.json();
  const airplaneUrl = new URL(
    type === "airplane"
      ? "https://api.api-ninjas.com/v1/aircraft"
      : "https://api.api-ninjas.com/v1/helicopter"
  );
  const newUrl = addParamsString(airplaneUrl, { manufacturer: manu, model });
  const response = await fetch(newUrl, {
    headers: { "X-Api-Key": APININJAS },
  });
  return response;
}
