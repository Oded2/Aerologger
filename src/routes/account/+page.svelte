<script>
  import hrefs from "../../data/hrefs.json";
  import { getUserDetails } from "../../hooks.client.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  export let data;
  const api = data.sbApi;
  const user = getUserDetails(api);
  onMount(async () => {
    (await user) ? false : goto(hrefs.login.home.link);
  });
  let newEmail = "",
    newFname,
    newLname;
</script>

<!-- <Modal showModal={showEmail} on:click={toggleEmail}>
    <div class="p-sm-5 mx-sm-5 text-center">
      <h1 class="font-google-quicksand fw-bold">Edit email</h1>
      <h4 class="font-google-quicksand fw-600">Current email: {values.email}</h4>
      <input
        type="email"
        class="form-control fs-4"
        placeholder="Type your new email here"
        bind:value={newValues.email}
        disabled={toChange.email}
      />
      <button
        class="btn btn-primary fs-4 font-google-quicksand fw-bold w-100 my-2"
        on:click={updateEmail}
        disabled={toChange.email}>Confirm</button
      >
    </div>
  </Modal>
  
  <Modal showModal={showName} on:click={toggleName}>
    <div class="p-sm-5 mx-sm-5 text-center">
      <h1 class="font-google-quicksand fw-bold">Edit name</h1>
      <h4 class="font-google-quicksand fw-600">
        Current name: {values.fname}
        {values.lname}
      </h4>
      <div class="row">
        <div class="col-md">
          <input
            type="text"
            class="form-control fs-4"
            placeholder="Type your new first name here"
            bind:value={newValues.fname}
            disabled={toChange.name}
          />
        </div>
        <div class="col-md">
          <input
            type="text"
            class="form-control fs-4"
            placeholder="Type your new last name here"
            bind:value={newValues.lname}
            disabled={toChange.name}
          />
        </div>
      </div>
      <button
        class="btn btn-primary fs-4 font-google-quicksand fw-bold w-100 my-2"
        on:click={updateName}
        disabled={toChange.name}>Confirm</button
      >
    </div>
  </Modal> -->
<main>
  {#await user}
    <h1>Loading...</h1>
  {:then user}
    <div class="container my-5">
      <div class="font-google-gabarito">
        <h1>Welcome back, <span class="text-primary">{user.fname}</span>.</h1>
        <h3>
          Looking for your logbook? <a href="/" class="text-reset">Click Here</a
          >.
        </h3>
      </div>
      <div class="card shadow my-5">
        <div class="card-header">
          <span class="font-google-quicksand">Account Settings</span>
        </div>
        <div class="card-body fs-2 font-google-quicksand">
          <div class="row mb-3 text-center">
            <div class="col-lg-3 fw-bold">Email</div>
            <div class="col-lg-6 fw-500">{user.email}</div>

            <div class="col-lg-3">
              <button
                class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                ><i class="fa-solid fa-pen-to-square" /> Edit</button
              >
            </div>
          </div>
          <div class="row mb-3 pt-3 text-center border-top">
            <div class="col-lg-3 fw-bold">Name</div>
            <div class="col-lg-6 fw-500">{user.fname} {user.lname}</div>

            <div class="col-lg-3">
              <button
                class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                ><i class="fa-solid fa-pen-to-square" /> Edit</button
              >
            </div>
          </div>
          <div class="pt-3 text-center border-top">
            <a
              href={hrefs.passwordreset.home.link}
              class="btn btn-outline-danger font-google-quicksand fw-bold fs-4 w-100"
              >Reset Password</a
            >
          </div>
        </div>
      </div>
    </div>
  {/await}
</main>
<!-- <main>
  <div class="container my-5">
    {#await user}
      <h1>Loading data...</h1>
    {:then userDetails}
      <h1 class="font-google-gabarito">
        Welcome back, <span class="text-primary">{userDetails.fname}</span>
      </h1>
      <div class="card shadow">
        <div class="card-header fs-6"><span>AeroLogger</span></div>
        <div class="card-body">
          <div class="row mb-2 border-bottom pb-2">
            <div class="col-md">
              <h3>Email</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.email}</h3>
            </div>
          </div>
          <div class="row mb-2 pb-2 border-bottom">
            <div class="col-md">
              <h3>First Name</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.fname}</h3>
            </div>
          </div>
          <div class="row mb-2 pb-2 border-bottom">
            <div class="col-md">
              <h3>Last Name</h3>
            </div>
            <div class="col-md">
              <button
                class="btn btn-outline-primary btn-lg w-100 font-google-gabarito"
                >Edit</button
              >
            </div>
            <div class="col-md text-center">
              <h3>{userDetails.lname}</h3>
            </div>
          </div>
          <div>
            <a
              href="/"
              class="btn btn-outline-danger btn-lg w-100 font-google-gabarito"
              >Reset Password</a
            >
          </div>
        </div>
      </div>
    {/await}
  </div>
</main> -->
