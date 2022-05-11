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
          Ready for your first smart contract?
        </h2>
        <nuxt-link
          class="bg-transparent border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
          to="/create-contract"
        >
          Start new contract
        </nuxt-link>
      </div>
    </section>
    <section v-else-if="user && generatedContracts" class="pt-20">
      <div>
        <h2 class="text-7xl text-gray-500 font-extralight">Select a contract</h2>
        <ul class="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:gap-10">
          <li
            v-for="(contract, index) in generatedContracts"
            :key="index"
            class="mt-4 shadow bg-white rounded-lg"
          >
            <div
              class="flex flex-col justify-between h-full  px-2 py-3"
            >
              <div class="pb-3">
                <p class="text-xl font-bold text-gray-500 overflow-scroll">{{ contract[0] }}</p>
              </div>
              <div class="flex justify-between">
                    <nuxt-link
                      :to="`/edit-contract/${contract[2]}`"
                      class="bg-white border py-2 px-2 w-auto rounded shadow-md hover:shadow-none"
                    >
                      Edit
                    </nuxt-link>
                    <nuxt-link
                      :to="`/create-nft/${contract[2]}`"
                      class="bg-white border py-2 px-2 w-auto rounded shadow-md hover:shadow-none"
                    >
                      Create NFT
                    </nuxt-link>
                  </div>
            </div>
          </li>
        </ul>
        <!-- <ul class="md:grid md:grid-cols-2 lg:grid-cols-3 md:col-gap-8 md:row-gap-10">
            <li v-for="(contract, index) in generatedContracts" :key="index" class="shadow">
              <nuxt-link :to="`/collection-gallery/${contract[2]}`">
                  <div>
                    <span>{{ contract[0] }}</span>
                  </div>
                  <div class="col-auto">
                    <nuxt-link
                      :to="`/edit-generated-721/${contract[2]}`"
                      class="bg-white border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
                    >
                      Edit
                    </nuxt-link>
                    <nuxt-link
                      :to="`/create-nft/${contract[2]}`"
                      class="bg-white border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
                    >
                      Create NFT
                    </nuxt-link>
                  </div>
              </nuxt-link>
            </li>
          </ul> -->
        <p class="text-center py-6"><span>or</span></p>
        <div class="text-center">
          <nuxt-link
            class="bg-white border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
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
  async mounted() {
    if (this.$web3Modal.cachedProvider) await this.setContract()
  },
  computed: {
    ...mapState({
      user: (state) => state.user.accountAddress,
      factoryAddress: (state) => state.factoryAddress,
      generatedContracts: (state) => state.user.contracts,
    }),
  },
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        const provider = await this.$web3Modal.connect()
        const instance = new ethers.providers.Web3Provider(provider)
        const signer = instance.getSigner()
        const currentAddress = await signer.getAddress()
        const factoryContract = new ethers.Contract(
          '0xF9D86FCe2af1d294778f0F866c86762A71B06572',
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
