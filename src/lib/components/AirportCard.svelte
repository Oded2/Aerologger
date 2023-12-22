<script>
  import { getOpenStreetMap, getCountryByCode } from "../../hooks.client.js";
  import Card from "./Card.svelte";
  export let airportData = {};
  export let cardTitle = "";
</script>

<Card
  title={cardTitle}
  actions={false}
  rounded
  fullWidth
  iframeUrl={getOpenStreetMap(
    parseFloat(airportData.latitude),
    parseFloat(airportData.longitude)
  )}
>
  <ul class="list-disc">
    <li class="list-item font-bold">
      {airportData.name}
    </li>
    <li class="list-item">
      ICAO: <span class="font-bold">{airportData.icao}</span>
    </li>
    <li class="list-item">
      IATA: <span class="font-bold">
        {airportData.iata.length > 0 ? airportData.iata : "N/A"}</span
      >
    </li>
    <li class="list-item">
      City: <span class="font-bold">{airportData.city}</span>
    </li>
    <li class="list-item">
      {`${airportData.country === "US" ? "State" : "Region"}:`}
      <span class="font-bold">{airportData.region}</span>
    </li>
    <li class="list-item">
      Country: <span class="font-bold"
        >{getCountryByCode(airportData.country)}</span
      >
    </li>
    <li class="list-item">
      Elevation: <span class="font-bold">{airportData.elevation_ft} ft</span>
    </li>
  </ul>
</Card>
