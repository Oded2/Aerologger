<script>
  import { getOpenStreetMap, getCountryByCode } from "../hooks.client.js";
  export let airportData = {};
  export let cardTitle = "";
  export let icon = "",
    iconType = "solid";
</script>

<div class="card shadow h-100">
  <div class="card-header text-center">
    <h3>
      <i class="fa-{iconType} fa-{icon}" />
      {cardTitle}
    </h3>
  </div>
  <div class="card-body">
    <ul class="list-group list-group-flush">
      <li class="list-group-item fw-bold">
        {airportData.name}
      </li>
      <li class="list-group-item">
        ICAO: <span class="fw-bold">{airportData.icao}</span>
      </li>
      <li class="list-group-item">
        IATA: <span class="fw-bold">
          {airportData.iata.length > 0 ? airportData.iata : "N/A"}</span
        >
      </li>
      <li class="list-group-item">
        City: <span class="fw-bold">{airportData.city}</span>
      </li>
      <li class="list-group-item">
        {`${airportData.country === "US" ? "State" : "Region"}:`}
        <span class="fw-bold">{airportData.region}</span>
      </li>
      <li class="list-group-item">
        Country: <span class="fw-bold"
          >{getCountryByCode(airportData.country)}</span
        >
      </li>
      <li class="list-group-item">
        Elevation: <span class="fw-bold">{airportData.elevation_ft} ft</span>
      </li>
    </ul>
  </div>
  <div class="card-footer">
    <iframe
      src={getOpenStreetMap(
        parseFloat(airportData.latitude),
        parseFloat(airportData.longitude)
      )}
      frameborder="0"
      title="Open Street Map"
    />
  </div>
</div>

<style>
  iframe {
    width: 100%;
    height: 400px;
  }
</style>
