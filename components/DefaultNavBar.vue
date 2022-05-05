<template>
  <nav
    class="fixed w-full z-30 top-0 bg-gray-50 text-gray-500"
    :class="{ shadow: showMenu }"
  >
    <div
      class="max-w-screen-xl mx-auto py-2 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between"
    >
      <div class="flex items-center justify-between">
        <nuxt-link
          class="no-underline hover:no-underline text-xl py-2 font-bold flex items-center flex-wrap"
          to="/"
        >
          <!-- <img class="w-10 h-auto inline-block" src="/icon.png" /> -->
          D_D | Contract Factory
          <!-- Rocket Ownership -->
        </nuxt-link>
        <div class="block lg:hidden">
          <button
            class="flex items-center px-3 py-2 border rounded"
            aria-label="show menu button"
            @click="showMenu = !showMenu"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div
        class="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block text-sm"
      >
        <div
          class="list-reset lg:flex justify-end flex-1 items-center"
          @click.prevent="showMenu = false"
        >
          <!-- <div v-for="menuItem in menuItems" :key="menuItem.route">
            <nuxt-link
              :to="menuItem.route"
              class="block py-2 lg:px-4 no-underline hover:text-underline"
              :class="{
                'font-bold': Object.is(
                  currentRoute,
                  menuItem.name === 'Home' ? 'index' : menuItem.name
                ),
              }"
            >
              {{ menuItem.name }}
            </nuxt-link>
          </div> -->
          <WalletConnect class="py-2" />
        </div>
      </div>
      <div
        v-show="showMenu"
        class="w-full block flex-grow lg:flex lg:items-center lg:w-auto lg:hidden text-sm"
      >
        <div
          class="list-reset lg:flex justify-end flex-1 items-center"
          @click.prevent="showMenu = false"
        >
          <!-- <div v-for="menuItem in menuItems" :key="`mobile-${menuItem.route}`">
            <nuxt-link
              :to="menuItem.route"
              class="block py-2 lg:px-4 no-underline hover:text-underline"
              :class="{
                'font-bold': Object.is(
                  currentRoute,
                  menuItem.name === 'Home' ? 'index' : menuItem.name
                ),
              }"
            >
              {{ menuItem.name }}
            </nuxt-link>
          </div> -->
          <WalletConnect />
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'DefaultNavBar',
  data() {
    return {
      showMenu: false,
      menuItems: [
        {
          name: 'Home',
          route: '/',
        },
        {
          name: 'Create Contract',
          route: '/create-contract',
        },
      ],
    }
  },
  computed: {
    currentRoute() {
      return this.$nuxt.$route.params.uid || this.$nuxt.$route.name
    },
  },
}
</script>
