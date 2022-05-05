<template>
  <div>
    <section class="py-8 md:py-12 text-gray-500">
      <h1 class="text-7xl sm:text-9xl">
        Gain true ownership of your NFT collection by owning your own smart
        contract*
      </h1>
      <p class="mb-4">*Without having to learn how to program any code.</p>
      <WalletConnect class="text-2xl md:hidden" />
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
      factoryAddress: (state) => state.factoryAddress,
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
