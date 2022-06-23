<template>
  <section>
    <div class="flex h-screen">
      <div class="m-auto text-center text-gray-500">
        <h2 class="text-7xl md:text-9xl mb-6 font-extralight">
          Transaction Confirmed!
        </h2>
        <p>Congratulations! your transaction has been deployed.</p>
        <p class="pb-6">
          <a
            class="underline cursor-pointer hover:text-gray-400"
            :href="`https://polygonscan.com/tx/${$route.params.transaction}`"
            target="_blank"
            >Check on Polygonscan
          </a>
        </p>
        <nuxt-link
          class="bg-white hover:bg-transparent border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
          to="/"
        >
          Go to my contracts
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
import JSConfetti from 'js-confetti'
export default {
  name: 'ConfirmationWindow',
  data() {
    return {
      confetti: null,
    }
  },
  mounted() {
    const confetti = new JSConfetti()
    confetti.addConfetti({
      confettiColors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
      confettiRadius: 10,
      confettiNumber: 60,
    })
  },
}
</script>
