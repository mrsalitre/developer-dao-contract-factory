<template>
  <button
    v-if="address == null"
    class="bg-gray-100 p-3 hover:bg-gray-300 w-full md:w-auto rounded mt-10 md:mt-2 lg:mt-0"
    @click="connectWallet()"
  >
    Connect Wallet
  </button>
  <button
    v-else
    class="bg-gray-100 p-3 hover:bg-gray-300 w-full md:w-auto rounded mt-10 md:mt-2 lg:mt-0"
    @click="disconnectWallet()"
  >
    Disconnect Wallet
  </button>
</template>
<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'
export default {
  name: 'WalletConnect',
  data() {
    return {
      instance: null,
      provider: null,
    }
  },
  computed: {
    ...mapState({ address: (state) => state.user.accountAddress }),
  },
  async mounted() {
    if (this.$web3Modal.cachedProvider) await this.connectWallet()
  },
  methods: {
    async connectWallet() {
      try {
        this.instance = await this.$web3Modal.connect()
        this.provider = new ethers.providers.Web3Provider(this.instance)
        
        const network = await this.provider.getNetwork()
        await this.checkNetwork(Number(network.chainId))

        const resolver = await this.provider.lookupAddress(
          this.instance.selectedAddress
        )

        this.$store.commit('user/SET_ACCOUNT_ENS', resolver)
        this.$store.commit(
          'user/SET_ACCOUNT_ADDRESS',
          this.instance.selectedAddress
        )

        this.instance.on('accountsChanged', async (accounts) => {
          const resolver = await this.provider.lookupAddress(accounts[0])
          this.$store.commit('user/SET_ACCOUNT_ADDRESS', accounts[0])
          this.$store.commit('user/SET_ACCOUNT_ENS', resolver)
        })

        this.instance.on('chainChanged', (chainID) => {
          this.checkNetwork(Number(chainID))
        })
      } catch (error) {
        console.log(error)
      }
    },
    async disconnectWallet() {
      try {
        await this.$web3Modal.clearCachedProvider()

        this.provider = null
        this.instance = null

        this.$store.commit('user/CLEAR')
      } catch (error) {
        console.log(error)
      }
    },
    checkNetwork(chainID) {
      return new Promise((resolve, reject) => {
        if (chainID === 4) {
          resolve()
        } else {
          alert('Please change to Rinkeby to continue')
          reject(new Error('wrong network'))
        }
      })
    },
  },
}
</script>
