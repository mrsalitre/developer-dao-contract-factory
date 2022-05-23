<template>
  <section class="pt-20">
    <div>
      <nuxt-link to="/" class="underline text-gray-500">back</nuxt-link>
      <h2 class="text-7xl text-gray-500 font-extralight">Create Contract</h2>
      <div
        class="mt-4 shadow bg-white rounded-lg px-2 py-3 text-gray-500 md:grid md:grid-cols-4 md:gap-2"
      >
        <div class="col-auto pb-4 md:pb-0">
          <div class="flex flex-col justify-between h-full">
            <label for="first_name" class="text-xl font-bold text-gray-500"
              >Image</label
            >
            <label
              v-if="!previewImage"
              class="flex flex-col w-full h-48 border-4 rounded border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
            >
              <div class="flex flex-col items-center justify-center my-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p
                  class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
                >
                  Select a photo
                </p>
              </div>
              <input type="file" class="hidden" @change="uploadImage($event)" />
            </label>
            <img
              v-else
              :src="previewImage"
              alt=""
              class="h-48 rounded cursor-pointer object-cover"
              @click="previewImage = null"
            />
            <!-- <div
                id="first_name"
                type="text"
                class="border h-full rounded py-2 px-3"
                name="first_name"
              /> -->
          </div>
        </div>
        <div class="flex flex-col justify-between h-full col-span-3">
          <div class="flex flex-wrap">
            <div class="w-full md:w-2/3 pb-4 md:pb-0">
              <label for="first_name" class="text-xl font-bold text-gray-500"
                >Name</label
              >
              <input
                id="first_name"
                v-model="collectionName"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              />
            </div>
            <div class="w-full md:w-1/3 md:pl-2 pb-4">
              <label for="first_name" class="text-xl font-bold text-gray-500"
                >Symbol</label
              >
              <input
                id="first_name"
                v-model="shortName"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              />
            </div>
          </div>
          <div class="flex flex-col justify-between h-full pb-4 md:pb-0">
            <label for="first_name" class="text-xl font-bold text-gray-500"
              >Description</label
            >
            <textarea
              id="first_name"
              v-model="description"
              type="text"
              class="border w-full rounded py-2 px-3 h-48 md:h-full"
              name="first_name"
            ></textarea>
          </div>
        </div>
        <div class="flex flex-col justify-between h-full md:mt-2 col-span-4">
          <div class="flex flex-wrap">
            <div class="w-full md:w-3/4 pb-4 md:pb-0">
              <label for="first_name" class="text-xl font-bold text-gray-500"
                >Payee´s Address</label
              >
              <input
                id="first_name"
                v-model="royaltiesAddress"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              />
            </div>
            <div class="w-full md:w-1/4 md:pl-2 pb-4 md:pb-0">
              <label for="first_name" class="text-xl font-bold text-gray-500"
                >Royalties</label
              >
              <div class="flex items-center border rounded py-2 px-3">
                <input
                  v-model="royalties"
                  class="appearance-none bg-transparent border-none w-full mr-3 focus:outline-none"
                  type="text"
                  placeholder="Jane Doe"
                  aria-label="Full name"
                />
                <span class="flex-shrink-0 text-sm" type="button"> % </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 col-span-4">
          <button
            class="bg-white border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
          >
            Create Contract
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import abi from '~/static/generatedAbi.json'

export default {
  name: 'CreateContract',
  data() {
    return {
      collectionName: '',
      shortName: '',
      description: '',
      royalties: 3,
      royaltiesAddress: '',
      collectionUrl: '',
      previewImage: '',
      rawImage: undefined,
      contractURI: '',
      creatingContract: false,
      contractDeployed: null,
      DDContractFactory: null,
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.accountAddress,
      factoryAddress: (state) => state.factoryAddress,
    }),
    computedRoyalties() {
      return this.royalties * 100
    },
  },
  watch: {
    royalties(val) {
      if (val >= 0 && val <= 100) {
        this.royalties = val
      } else {
        this.royalties = 0
      }
    },
  },
  mounted() {
    this.setContract()
    this.royaltiesAddress = this.user
  },
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        const provider = await this.$web3Modal.connect()
        const instance = new ethers.providers.Web3Provider(provider)
        const signer = instance.getSigner()
        this.DDContractFactory = new ethers.Contract(
          this.factoryAddress,
          abi,
          signer
        )
      } else {
        console.log('No cached provider')
      }
    },
    async createCustomContract() {
      this.creatingContract = true
      try {
        ethers.utils.getAddress(this.royaltiesAddress)
        await this.uploadContractDataToIPFS()
        this.contractDeployed = await this.DDContractFactory.deployERC721(
          this.collectionName,
          this.shortName,
          this.$store.state.user.accountAddress,
          this.contractURI
        )
        const response = await this.contractDeployed.wait()
        this.creatingContract = false
        this.$router.push(`/confirm/${response.transactionHash}`)
      } catch (error) {
        this.creatingContract = false
      }
    },
    async uploadContractDataToIPFS() {
      const imageCID = await this.addToIpfs(this.rawImage)
      const image = `https://ipfs.io/ipfs/${imageCID}`
      // const image =
      //   'https://firebasestorage.googleapis.com/v0/b/yoruba-dao-db.appspot.com/o/ordersImages%2Fb3ZJEyra1qSg03dVxQon%2Fb3ZJEyra1qSg03dVxQon?alt=media&token=8f922c3f-9fb9-4a32-b149-0c711cb39da4'
      const royalties = this.computedRoyalties
      const metaObj = {
        name: this.collectionName,
        description: this.description,
        image,
        external_link: `${this.collectionUrl}`,
        seller_fee_basis_points: royalties,
        fee_recipient: this.royaltiesAddress,
      }
      const jsonObj = JSON.stringify(metaObj)
      const CID = await this.addToIpfs(jsonObj)
      this.contractURI = `https://ipfs.io/ipfs/${CID}`
      console.log(this.contractURI)
    },
    async addToIpfs(content) {
      const CID = await this.$ipfs(content)
      return CID
    },
    uploadImage(e) {
      this.rawImage = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(this.rawImage)
      reader.onload = (e) => {
        this.previewImage = e.target.result
      }
    },
  },
}
</script>
