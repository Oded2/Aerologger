<script>
  import {
    formatDuration,
    formatDateTime,
    maxLen,
  } from "../../hooks.client.js";
  import hrefs from "$lib/hrefs.json";
  import FloatElement from "$lib/components/FloatElement.svelte";
  import ShareModal from "$lib/components/ShareModal.svelte";
  import AirportCard from "$lib/components/AirportCard.svelte";
  import Offcanvas from "$lib/components/Offcanvas.svelte";
  export let data;
  const { log, profile, ref, url } = data;
  const isPlane = log.type === "airplane";
  const profileRef = hrefs.explore.profile.link.replace(
    "slug",
    profile.username
  );
  const min = 200;
  url.searchParams.delete("ref");
  function formatDateTimeStr(string = "") {
    const date = new Date(string);
    return formatDateTime(date);
  }
</script>

<ShareModal
  id="share"
  {url}
  shareText={`Check out this flight from ${log.dep.city} to ${log.des.city}`}
>
  <a
    href="data:text/json;charset=utf-8,{JSON.stringify(log)}"
    download="{`log ${log.id}`}.json"
    class="btn btn-dark w-100">Export Log as JSON</a
  ></ShareModal
>

<main>
  <div class="container py-5">
    <div class="font-google-gabarito">
      <div class="text-center">
        <h1>{log.dep.city} to {log.des.city}</h1>
        <h2>
          Logged by: <a href={profileRef} class="text-reset"
            >{profile.display_name}</a
          >
        </h2>
      </div>
      <div class="row fs-3 mt-5">
        <div class="col-lg-5 mb-5">
          <div class="card shadow h-100">
            <div class="card-header text-center">
              <h3>
                <i class="fa-solid fa-plane-circle-exclamation" /> Plane Information
              </h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  Type: <span class="text-capitalize text-aerologger"
                    >{log.type}</span
                  >
                </li>
                <li class="list-group-item">
                  Manufacturer: <span class="text-capitalize text-aerologger">
                    {log.plane.manufacturer}</span
                  >
                </li>
                <li class="list-group-item">
                  Model: <span class="text-capitalize text-aerologger">
                    {log.plane.model}</span
                  >
                </li>
                <li class="list-group-item">
                  Tail Number: <span class=" text-aerologger">
                    {log.identification.length > 1
                      ? log.identification
                      : "None"}</span
                  >
                </li>
              </ul>
            </div>
            {#if log.type !== "other"}
              <div class="card-footer">
                <button
                  class="btn btn-primary w-100"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#aircraftinfo">Advanced</button
                >
              </div>
            {/if}
          </div>
        </div>
        <div class="col-lg-7 mb-5">
          <div class="card shadow h-100">
            <div class="card-header text-center">
              <h3>
                <i class="fa-solid fa-plane" /> Flight Information
              </h3>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item fw-bold">
                  {log.dep.icao} to {log.des.icao}
                </li>
                <li class="list-group-item">
                  Time of Departure: <span class="text-aerologger">
                    {formatDateTimeStr(log.depDate)}</span
                  >
                </li>

                <li class="list-group-item">
                  Time of Arrival: <span class="text-aerologger">
                    {formatDateTimeStr(log.desDate)}</span
                  >
                </li>
                <li class="list-group-item">
                  Total Duration: <span class="text-aerologger">
                    {formatDuration(
                      new Date(log.depDate),
                      new Date(log.desDate)
                    )}</span
                  >
                </li>
                <li class="list-group-item">
                  Date Logged: <span class="text-aerologger"
                    >{formatDateTimeStr(log.created_at)}</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-12 mb-5">
          <div class="card fs-5">
            <div class="card-body">
              <h4 class="card-title">Notes</h4>
              <p class="card-text white-space-prewrap">
                {maxLen(log.notes, min)}
              </p>
              <button
                class="btn btn-primary"
                data-bs-toggle="offcanvas"
                data-bs-target="#notes">Expand / Options</button
              >
            </div>
          </div>
        </div>
        <div
          class="{log.dep.icao === log.des.icao
            ? 'col-lg-12'
            : 'col-lg-6'} mb-5"
        >
          <AirportCard
            airportData={log.dep}
            cardTitle={log.dep.icao === log.des.icao
              ? "Airport Information"
              : "Departure Airport Information"}
            icon="plane-departure"
          />
        </div>
        {#if log.dep.icao !== log.des.icao}
          <div class="col-lg-6 mb-5">
            <AirportCard
              airportData={log.des}
              cardTitle="Arrival Airport Information"
              icon="plane-arrival"
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<FloatElement>
  {#if log.public}
    <button
      class="btn btn-primary btn-lg me-3"
      data-bs-toggle="modal"
      data-bs-target="#share"
      ><i class="fa-solid fa-share-from-square" /> Share</button
    >
  {/if}
  {#if ref}
    <a href={ref} class="btn btn-secondary btn-lg"
      ><i class="fa-solid fa-rotate-left" /> Return</a
    >
  {/if}
</FloatElement>

<Offcanvas header="Aircraft Information" id="aircraftinfo">
  <div class="mb-3">
    <a
      href="data:text/json;charset=utf-8,{JSON.stringify(log.plane)}"
      download="{`log ${log.id} aircraft info`}.json"
      class="btn btn-outline-primary">Export as JSON</a
    >
  </div>
  <ul class="font-google-quicksand py-2 fs-4">
    <li>
      Manufacturer: <span class="fw-bold">
        {log.plane.manufacturer ?? "---"}</span
      >
    </li>
    <li>
      Model: <span class="fw-bold"> {log.plane.model ?? "---"}</span>
    </li>
    {#if isPlane}
      <li>
        Engine Type: <span class="fw-bold"
          >{log.plane.engine_type ?? "---"}</span
        >
      </li>

      <li>
        Engine Thrust: <span class="fw-bold"
          >{log.plane.engine_thrust_lb_ft
            ? parseFloat(log.plane.engine_thrust_lb_ft).toLocaleString()
            : "---"} LBF</span
        >
      </li>

      <li>
        Max Speed: <span class="fw-bold"
          >{log.plane.max_speed_knots
            ? parseFloat(log.plane.max_speed_knots).toLocaleString()
            : "---"} Knots</span
        >
      </li>
      <li>
        Cruise Speed: <span class="fw-bold"
          >{log.plane.cruise_speed_knots
            ? parseFloat(log.plane.cruise_speed_knots).toLocaleString()
            : "---"} Knots</span
        >
      </li>
      <li>
        Ceiling: <span class="fw-bold"
          >{log.plane.ceiling_ft
            ? parseFloat(log.plane.ceiling_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
    {:else}
      <li>
        Max Speed: <span class="fw-bold"
          >{log.plane.max_speed_sl_knots ?? "---"} Knots</span
        >
      </li>
      <li>
        Cruise Speed: <span class="fw-bold"
          >{log.plane.cruise_speed_sl_knots ?? "---"} Knots</span
        >
      </li>
      <li>
        Cruise Time: <span class="fw-bold"
          >{log.plane.cruise_time_min ?? "---"} Minutes</span
        >
      </li>
      <li>
        Fuel Capacity: <span class="fw-bold"
          >{log.plane.fuel_capacity_gallons ?? "---"} Gallons</span
        >
      </li>
      <li>
        Storage Width: <span class="fw-bold"
          >{log.plane.storage_width_ft
            ? parseFloat(log.plane.storage_width_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
      <li>
        Gross External Loads: <span class="fw-bold"
          >{log.plane.gross_external_load_lbs
            ? parseFloat(log.plane.gross_external_load_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </li>
    {/if}

    {#if isPlane}
      <li>
        Takeoff Ground Run: <span class="fw-bold">
          {log.plane.takeoff_ground_run_ft
            ? parseFloat(log.plane.takeoff_ground_run_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
      <li>
        Landing Ground Roll: <span class="fw-bold">
          {log.plane.landing_ground_roll_ft
            ? parseFloat(log.plane.landing_ground_roll_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
      <li>
        Gross Weight: <span class="fw-bold"
          >{log.plane.gross_weight_lbs
            ? parseFloat(log.plane.gross_weight_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </li>
      <li>
        Empty Weight: <span class="fw-bold"
          >{log.plane.empty_weight_lbs
            ? parseFloat(log.plane.empty_weight_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </li>
      <li>
        Wing Span: <span class="fw-bold"
          >{log.plane.wing_span_ft
            ? parseFloat(log.plane.wing_span_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
    {:else}
      <li>
        External Load Limit: <span class="fw-bold"
          >{log.plane.external_load_limit_lbs
            ? parseFloat(log.plane.external_load_limit_lbs).toLocaleString()
            : "---"} lbs</span
        >
      </li>
      <li>
        Rotor Type: <span class="fw-bold">{log.plane.rotor_type}</span>
      </li>
      <li>
        Rotor Diameter: <span class="fw-bold"
          >{log.plane.main_rotor_diameter_ft
            ? parseFloat(log.plane.main_rotor_diameter_ft).toLocaleString()
            : "---"} ft</span
        >
      </li>
      <li>
        Blades: <span class="fw-bold"
          >{log.plane.num_blades
            ? parseFloat(log.plane.num_blades).toLocaleString()
            : "---"}</span
        >
      </li>
      <li>
        Blade Material: <span class="fw-bold"
          >{log.plane.blade_material ?? "---"}</span
        >
      </li>
    {/if}
    <li>
      Length: <span class="fw-bold"
        >{log.plane.length_ft
          ? parseFloat(log.plane.length_ft).toLocaleString()
          : "---"} ft</span
      >
    </li>
    <li>
      Height: <span class="fw-bold"
        >{log.plane.height_ft
          ? parseFloat(log.plane.height_ft).toLocaleString()
          : "---"} ft</span
      >
    </li>

    <li>
      Range: <span class="fw-bold"
        >{log.plane.range_nautical_miles
          ? parseFloat(log.plane.range_nautical_miles).toLocaleString()
          : "---"} Nautical Miles</span
      >
    </li>
  </ul>
</Offcanvas>
<svelte:head>
  <title>{`${log.dep.city} to ${log.des.city}`}</title>
</svelte:head>

<Offcanvas id="notes" header={`${log.dep.city} to ${log.des.city} Notes`}>
  <div class="mb-3">
    <button
      class="btn btn-primary"
      on:click={() => navigator.clipboard.writeText(log.notes)}>Copy</button
    >
    <a
      href="data:text;charset=utf-8,{log.notes}"
      download="{`log ${log.id} notes`}.txt"
      class="btn btn-outline-primary">Export as TXT</a
    >
  </div>
  <div><p class="fs-5 white-space-prewrap">{log.notes}</p></div>
</Offcanvas>
