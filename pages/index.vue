<template>
  <div>
    <section v-if="!user" class="flex h-screen">
      <div class="m-auto text-gray-500">
        <h1 class="text-7xl font-extralight md:text-9xl">
          Gain true ownership of your NFT collection by owning your own smart
          contracts*
        </h1>
        <p class="mb-6 text-sm">
          *Without having to learn how to program any code.
        </p>
      </div>
    </section>
    <section
      v-else-if="user && (!generatedContracts || !generatedContracts.length)"
      class="flex h-screen"
    >
      <div class="m-auto text-center text-gray-500">
        <h2 class="text-7xl md:text-9xl mb-6 font-extralight">
          Ready to own your first smart contract?
        </h2>
        <nuxt-link
          class="bg-white hover:bg-transparent border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
          to="/create-contract"
        >
          Start New Contract
        </nuxt-link>
      </div>
    </section>
    <section v-else-if="user && generatedContracts" class="pt-20">
      <div>
        <h2
          class="text-7xl text-gray-500 font-extralight mb-4"
          style="padding-top: 24px"
        >
          Select a contract
        </h2>
        <ul class="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-10 md:gap-y-6">
          <li
            v-for="(contract, index) in generatedContracts"
            :key="index"
            class="shadow bg-white rounded-lg mb-6 md:mb-0"
          >
            <div class="flex flex-col justify-between h-full px-2 py-3">
              <div class="pb-3">
                <p class="text-xl font-bold text-gray-500 overflow-scroll">
                  {{ contract[2] }}
                </p>
              </div>
              <div class="flex justify-between text-gray-500">
                <nuxt-link
                  :to="`/edit-contract/${contract[3]}`"
                  class="bg-white border py-2 px-2 w-auto rounded shadow-md hover:shadow-none"
                >
                  Edit
                </nuxt-link>
                <nuxt-link
                  :to="`/create-nft/${contract[3]}`"
                  class="bg-white border py-2 px-2 w-auto rounded shadow-md hover:shadow-none"
                >
                  Create NFT
                </nuxt-link>
              </div>
            </div>
          </li>
        </ul>
        <p class="text-center pb-6 md:py-6"><span>or</span></p>
        <div class="text-center mb-8">
          <nuxt-link
            class="bg-white hover:bg-transparent border text-gray-500 py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
            to="/create-contract"
          >
            Create new contract
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import abi from '~/static/abi.json'

export default {
  name: 'IndexPage',
  computed: {
    ...mapState({
      user: (state) => state.user.accountAddress,
      factoryAddress: (state) => state.factoryAddress,
      generatedContracts: (state) => state.user.contracts,
    }),
  },
  async mounted() {
    if (this.$web3Modal.cachedProvider) await this.setContract()
  },
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        const provider = await this.$web3Modal.connect()
        const instance = new ethers.providers.Web3Provider(provider)
        const signer = instance.getSigner()
        const currentAddress = await signer.getAddress()
        const factoryContract = new ethers.Contract(
          this.factoryAddress,
          abi,
          signer
        )
        this.$store.commit(
          'user/SET_CONTRACTS',
          await factoryContract.getUserContracts(currentAddress)
        )
      } else {
        console.log('No cached provider')
      }
    },
  },
}
</script>
