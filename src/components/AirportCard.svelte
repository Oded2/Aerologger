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
        ICAO Code: {airportData.icao}
      </li>
      <li class="list-group-item">
        IATA Code: {airportData.iata.length > 0
          ? airportData.iata
          : "Not found"}
      </li>
      <li class="list-group-item">City: {airportData.city}</li>
      <li class="list-group-item">
        Region: {airportData.region}
      </li>
      <li class="list-group-item">
        Country: {getCountryByCode(airportData.country)}
      </li>
      <li class="list-group-item">
        Elevation: {airportData.elevation_ft} ft
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
