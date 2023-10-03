<script>
  import Modal from "./Modal.svelte";
  import { simplifyString } from "../hooks.client.js";
  export let questions = [];
  let showModal = false;
  let currentImg = "";
  let correctTotal = 0;
  for (let i of questions) {
    if (i.isCorrect) {
      correctTotal++;
    }
  }
  const percent = parseInt((correctTotal / questions.length) * 100);
  function fullScreenImage(imageUrl) {
    currentImg = imageUrl;
    toggleModal();
  }
  function toggleModal() {
    showModal = !showModal;
  }
</script>

<Modal {showModal} on:click={toggleModal}>
  <div class="d-flex justify-content-center h-100">
    <img src={currentImg} alt="Question" class="img-fluid" />
  </div>
</Modal>
<main>
  <div class="container-fluid pt-3 pb-5 px-xl-5">
    <div>
      <h1 class="font-google-quicksand fw-bold text-center display-3">
        Theory Result: <span
          class:text-danger={percent < 86}
          class:text-success={percent >= 86}
          >{percent >= 86 ? "Pass" : "Fail"}</span
        >
      </h1>
      <h4 class="font-google-quicksand fw-bld text-center">{percent}%</h4>
    </div>
    <div class="font-google-quicksand fw-600 fs-4 px-sm-4 px-md-5 rounded">
      <div class="row border-bottom py-3 mt-4 fw-bold d-none d-xl-flex fs-3">
        <div class="col">Question</div>
        <div class="col">User's Answer</div>
        <div class="col">Correct Answer</div>
        <div class="col-5">Answers</div>
      </div>
      {#each questions as question, index}
        <div class="row border-bottom border-dark mb-5">
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            Question ({index + 1})
          </div>
          <div class="col-xl border-xl-start border-xl-end">
            {question["question"]}
            <div class="d-flex justify-content-center py-2">
              {#if question["image"]}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img
                  on:click={() => fullScreenImage(question["image"])}
                  src={question["image"]}
                  alt="Question"
                  class="img-fluid question shadow-sm"
                />
              {/if}
            </div>
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            User's Answer
          </div>
          <div
            class="col-xl border-xl-start border-xl-end text-dark"
            class:bg-danger-subtle={!question["isCorrect"]}
            class:bg-success-subtle={question["isCorrect"]}
          >
            {question["user"]}
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            Correct Answer
          </div>
          <div class="col-xl border-xl-start border-xl-end">
            {question["correct"]}
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">Answers</div>
          <div class="col-xl-5 border-xl-start border-xl-end fs-5 py-2">
            {#each question["answers"] as answer}
              <ul>
                <li
                  class:bg-danger-subtle={simplifyString(answer) ==
                    simplifyString(question["user"]) && !question["isCorrect"]}
                  class:bg-success-subtle={simplifyString(answer) ==
                    simplifyString(question["correct"])}
                  class:text-dark={simplifyString(answer) ==
                    simplifyString(question["user"]) ||
                    simplifyString(answer) ==
                      simplifyString(question["correct"])}
                >
                  {answer}
                </li>
              </ul>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  img.question {
    cursor: pointer;
    transition: 0.5s;
  }
  img.question:hover {
    cursor: pointer;
    scale: 105%;
  }
</style>
