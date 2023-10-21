import { APININJAS } from "$env/static/private";
import { addParamsString } from "../../../../hooks.client.js";
import hrefs from "../../../../data/hrefs.json";
import { redirect } from "@sveltejs/kit";
const airportUrl = "https://api.api-ninjas.com/v1/airports";
export async function load({ url }) {
  const searchParams = url.searchParams;
  const params = {
    dep: searchParams.get("dep"),
    des: searchParams.get("des"),
    depDate: searchParams.get("depDate"),
    desDate: searchParams.get("desDate"),
    manufacturer: searchParams.get("planeManu"),
    model: searchParams.get("planeModel"),
    identification: searchParams.get("planeId"),
    type: searchParams.get("planeType"),
    notes: searchParams.get("userNotes"),
    public: searchParams.get("isPublic"),
  };
  for (const i in params) {
    if (!params[i]) {
      handleError();
    }
  }
  const dep = params.dep,
    des = params.des,
    manu = params.manufacturer,
    model = params.model,
    type = params.type;

  const planeUrl = `https://api.api-ninjas.com/v1/${
    type === "airplane" ? "aircraft" : "helicopter"
  }`;
  const planePromise =
    type !== "other"
      ? (
          await fetch(
            addParamsString(planeUrl, { manufacturer: manu, model }),
            { headers: { "X-Api-Key": APININJAS } }
          )
        ).json()
      : [{ manufacturer: manu, model }];
  const plane = await planePromise;
  if (!plane[0]) {
    handleError();
    return;
  }
  const depAirport = await getAirportDetails(dep);
  if (!depAirport[0]) {
    handleError();
    return;
  }
  const desAirport = await getAirportDetails(des);
  if (!desAirport[0]) {
    handleError();
    return;
  }
  return { dep: depAirport[0], des: desAirport[0], plane: plane[0] };
}
async function getAirportDetails(airport = "") {
  const url = addParamsString(
    airportUrl,
    airport.length == 3
      ? { iata: airport }
      : airport.length == 4
      ? { icao: airport }
      : { name: airport }
  );

  const response = (
    await fetch(url, { headers: { "X-Api-Key": APININJAS } })
  ).json();
  return response;
}

function handleError() {
  throw redirect(301, "/protected/newflight/error");
}
