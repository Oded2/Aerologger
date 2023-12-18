<script>
  import {
    formatDuration,
    formatDateTime,
    maxLen,
    formatDateStr,
  } from "../../hooks.client.js";
  import { hrefs } from "$lib/index.js";
  import FloatElement from "$lib/components/FloatElement.svelte";
  import ShareModal from "$lib/components/ShareModal.svelte";
  import AirportCard from "$lib/components/AirportCard.svelte";
  import Title from "$lib/components/Title.svelte";
  import Container from "$lib/components/Container.svelte";
  import Card from "$lib/components/Card.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  export let data;
  const { log, profile, ref, url } = data;
  const profileRef = hrefs.profile.link.replace("slug", profile.username);
  const min = 200;
  url.searchParams.delete("ref");

  let notesExpand = false;

  function formatDateTimeStr(
    string = "",
    options = { month: "long", day: "numeric", year: "numeric" }
  ) {
    const date = new Date(string);
    return formatDateTime(date, options);
  }
</script>

<main>
  <Container>
    <div class="text-center">
      <h1 class="text-4xl">{log.dep.city} to {log.des.city}</h1>
      <h3 class="text-2xl">
        {formatDateStr(log.depDate)}
      </h3>
      <h4 class="text-xl">
        Logged by: <a href={profileRef} class="link">{profile.display_name}</a>
      </h4>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-12 text-xl mt-5 gap-4">
      <div class="col-span-5 mb-5">
        <Card actions={false} title="Plane Information" wider>
          <ul class="list-disc">
            <li class="list-item">
              Manufacturer: <span class="capitalize font-bold">
                {log.plane.make}</span
              >
            </li>
            <li class="list-item">
              Model: <span class="capitalize font-bold">
                {log.plane.model}</span
              >
            </li>
            <li class="list-item">
              Tail Number: <span class="font-bold">
                {log.tail.length > 0 ? log.tail : "N/A"}</span
              >
            </li>
          </ul>
        </Card>
      </div>
      <div class="col-span-7 mb-5">
        <Card actions={false} title="Flight Information" wider>
          <ul class="list-disc">
            <li class="list-item font-bold">
              {log.dep.icao} to {log.des.icao}
            </li>
            <li class="list-item">
              Time of Departure: <span class="font-bold">
                {formatDateTimeStr(log.depDate, {
                  month: "long",
                  day: "numeric",
                })}</span
              >
            </li>

            <li class="list-item">
              Time of Arrival: <span class="font-bold">
                {formatDateTimeStr(log.desDate, {
                  month: "long",
                  day: "numeric",
                })}</span
              >
            </li>
            <li class="list-item">
              Total Duration: <span class="font-bold">
                {formatDuration(
                  new Date(log.depDate),
                  new Date(log.desDate)
                )}</span
              >
            </li>
            <li class="list-item">
              Date Logged: <span class="font-bold"
                >{formatDateTimeStr(log.created_at)}</span
              >
            </li>
          </ul>
        </Card>
      </div>
      {#if log.notes.length > 0}
        <div class="col-span-full mb-5">
          <Card fullWidth actions={false} rounded title="Notes">
            {#if log.notes.length > min}
              <FormInput type="checkbox" text="Expand" bind:value={notesExpand}
              ></FormInput>
            {/if}
            <p class:whitespace-pre-wrap={notesExpand}>
              {notesExpand ? log.notes : maxLen(log.notes, min)}
            </p>
            <div class="mt-5">
              <button
                class="btn btn-primary"
                onclick="notesOptions.showModal()"
              >
                Options
              </button>
            </div>
          </Card>
        </div>
      {/if}
      <div
        class="{log.dep.icao === log.des.icao
          ? 'col-span-full'
          : 'col-span-6'} mb-5"
      >
        <AirportCard
          airportData={log.dep}
          cardTitle={log.dep.icao === log.des.icao
            ? "Airport Information"
            : "Departure Airport Information"}
        />
      </div>
      {#if log.dep.icao !== log.des.icao}
        <div class="col-span-6 mb-5">
          <AirportCard
            airportData={log.des}
            cardTitle="Arrival Airport Information"
            icon="plane-arrival"
          />
        </div>
      {/if}
    </div>
  </Container>
</main>

<ShareModal
  id="share"
  {url}
  shareText={`Check out this flight from ${log.dep.city} to ${log.des.city}`}
>
  <a
    href="data:text/json;charset=utf-8,{JSON.stringify(log)}"
    download="{`log ${log.id}`}.json"
    class="btn btn-secondary w-full">Export Log as JSON</a
  ></ShareModal
>

<FloatElement>
  {#if log.public}
    <button class="btn btn-primary me-3" onclick="share.showModal()"
      ><i class="fa-solid fa-share-from-square" /> Share</button
    >
  {/if}
  {#if ref}
    <a href={ref} class="btn btn-secondary"
      ><i class="fa-solid fa-rotate-left" /> Return</a
    >
  {/if}
</FloatElement>

<Title title={`${log.dep.city} to ${log.des.city}`}></Title>

<Modal
  id="notesOptions"
  title={`${log.dep.city} to ${log.des.city} Note Options`}
>
  <div class="my-3">
    <button
      class="btn btn-primary"
      on:click={() => navigator.clipboard.writeText(log.notes)}>Copy</button
    >
    <a
      href="data:text;charset=utf-8,{log.notes}"
      download="{`log ${log.id} notes`}.txt"
      class="btn btn-outline btn-primary">Export as TXT</a
    >
  </div>
</Modal>
