<template>
  <div>
    <section v-if="!user" class="flex h-screen">
      <div class="m-auto text-gray-500">
      <h1 class="text-7xl md:text-9xl">
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
        <h2 class="text-7xl md:text-9xl mb-6">
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
    <!-- <section v-else-if="user && (!generatedContracts || !generatedContracts.length)" class="py-8 md:py-12 text-gray-500">
        <div class="text-center space-y-2">
          <h2 class="text-7xl md:text-9xl mb-6">
            Ready for your first contract?
          </h2>
          <nuxt-link
            class="bg-transparent border py-2 px-2 w-full md:w-auto rounded shadow-md hover:shadow-none"
            to="/create-contract"
          >
            Start new contract
          </nuxt-link>
    </div>
    </section> -->
    <section v-else-if="user && generatedContracts">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xl-8 col-lg-6 select-contract-content">
            <h2 class="custom-h2-1">Select a contract</h2>
            <div>
              <ul class="nav flex-column select-contract-list">
                <li
                  v-for="(contract, index) in generatedContracts"
                  :key="index"
                  class="nav-item"
                >
                  <nuxt-link
                    :to="`/collection-gallery/${contract[2]}`"
                    class="nav-link"
                  >
                    <div class="row justify-content-between">
                      <div class="col-6">
                        <span>{{ contract[0] }}</span>
                        <p v-if="contract[1] == 'ERC-721'">Unique [ERC-721]</p>
                        <p v-else>Serial [ERC-1155]</p>
                      </div>
                      <div class="col-auto">
                        <nuxt-link
                          :to="
                            contract[1] == 'ERC-721'
                              ? `/edit-generated-721/${contract[2]}`
                              : ''
                          "
                          class="btn custom-button-3 text-decoration-none"
                        >
                          Edit
                        </nuxt-link>
                        <nuxt-link
                          :to="`/create-nft/${contract[2]}`"
                          class="btn custom-button-1 text-decoration-none"
                        >
                          Create NFT
                        </nuxt-link>
                      </div>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <p class="text-divider"><span>or</span></p>
            <div class="text-center">
              <nuxt-link
                class="btn custom-button-1 new-contract-button"
                to="/create-contract-collection"
              >
                Create new contract
              </nuxt-link>
            </div>
          </div>
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
