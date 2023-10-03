<script>
  export let CreditCard = "";
  export let sumOfDigits = "";
  function reverseString(str) {
    str += "";
    let splitString = str.toString().split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
  }
  const doubleCardDemo = (card) => {
    if (card == "") {
      return;
    }
    let start = 1;
    card = reverseString(card);
    let finishedCard = "";
    for (let i in card) {
      let p = card[i];

      if (start % 2 == 0) {
        p = p * 2;
        if (p > 9) {
          p -= 9;
        }
        finishedCard += p;
      } else [(finishedCard += p)];
      start += 1;
    }

    finishedCard = reverseString(finishedCard);
    return finishedCard;
  };
  $: doubledCard = doubleCardDemo(CreditCard);
  $: if (!doubledCard) {
    doubledCard = "";
  }
</script>

<div class="mt-4 bg-body-tertiary rounded-3 shadow-lg">
  <div class="container-fluid px-5 py-4">
    <h1 class="display-5 fw-bold">How does this work?</h1>
    <h3 class="col-md-8 fs-4">
      <h4>
        This method is called the Luhn algorithm, here is a demonstration of how
        it works.
      </h4>
      <br />
      <h4>
        First, take all the digits of your credit card, and double every second
        digit from the right. If the digit is above 9, then you subtract 9 from
        it.
      </h4>
      <h4>Digits of your card:</h4>
      {#if !CreditCard}
        <h4>&nbsp;</h4>
      {/if}
      <h4 class="letter-spaced">{CreditCard}</h4>

      <h4>
        Every second digit from your card, doubled, starting from the right and
        subtracted by 9 if it's over 9:
      </h4>
      {#if !CreditCard}
        <h4>&nbsp;</h4>
      {/if}
      <h4 class="letter-spaced">{doubledCard}</h4>
      <h4>Take the sum of every digit, even the unchanged ones:</h4>
      {#if !CreditCard}
        <h4>&nbsp;</h4>
      {:else}
        <h4>{sumOfDigits}</h4>
      {/if}

      <h4>
        If the number is divisable by 10, then it's valid, otherwise it is
        invalid.
      </h4>
    </h3>
  </div>
</div>
