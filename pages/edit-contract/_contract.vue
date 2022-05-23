<template>
  <section class="pt-20">
    <div>
      <nuxt-link to="/" class="underline text-gray-500">back </nuxt-link>
      <h2 class="text-7xl text-gray-500 font-extralight">Edit Contract</h2>
      <!-- <div class="md:grid md:grid-cols-1 md:gap-10"> -->
      <div
        class="mt-4 shadow bg-white rounded-lg px-2 py-3 text-gray-500 md:grid md:grid-cols-4 md:gap-2"
      >
        <div class="col-auto">
          <div class="flex flex-col justify-between h-full">
            <label for="first_name" class="text-xl font-bold text-gray-500"
              >Image</label
            >
            <label
              v-if="!previewImage"
              class="flex flex-col w-full h-36 border-4 rounded border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
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
              class="h-36 rounded cursor-pointer object-cover"
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
          <div class="py-2 md:py-0 md:pb-2">
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
          <div class="flex flex-col justify-between h-full">
            <label for="first_name" class="text-xl font-bold text-gray-500"
              >Description</label
            >
            <textarea
              id="first_name"
              v-model="description"
              type="text"
              class="border w-full h-full rounded py-2 px-3"
              name="first_name"
            ></textarea>
          </div>
        </div>
        <div class="mt-3 col-span-4">
          <button
            class="bg-white border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
          >
            Update
          </button>
        </div>
      </div>
      <!-- <form
          class="mt-4 shadow bg-white rounded-lg px-2 py-3 text-gray-500 flex flex-wrap"
        >
          <div
            v-if="!previewImage"
            class="flex items-center justify-center w-full md:w-1/3 md:pr-2"
          >
            <label
              class="flex flex-col w-36 h-36 border-4 rounded-xl border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
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
          </div>
          <div
            v-else
            class="flex items-center justify-center w-full md:w-1/3 md:pr-2"
          >
            <img
              class="w-36 h-36 object-cover rounded-sm cursor-pointer"
              :src="previewImage"
              alt="your image"
              @click="previewImage = ''"
            />
          </div>
          <div class="w-full md:w-2/3">
            <div class="my-3">
              <label for="first_name" class="font-semibold">Name</label>
              <input
                id="first_name"
                v-model="collectionName"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              />
            </div>
            <div>
              <label for="first_name" class="font-semibold">Description</label>
              <textarea
                id="first_name"
                v-model="description"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              ></textarea>
            </div>
          </div>
        </form> -->
      <!-- </div> -->
    </div>
  </section>
</template>

<script>
import { ethers } from 'ethers'
import abi from '~/static/generatedAbi.json'

export default {
  name: 'EditContract',
  data() {
    return {
      collectionName: '',
      shortName: 'SH',
      description: '',
      royalties: 0,
      royaltiesAddress: '',
      collectionUrl: '',
      previewImage: '',
      rawImage: undefined,
      contractURI: '',
      creatingContract: false,
      contractDeployed: null,
      startHausFactoryContract: null,
      properties: [],
      propertieName: '',
      propertieValue: '',
      approvedList: [],
    }
  },
  computed: {
    computedRoyalties() {
      return this.royalties * 100
    },
  },
  watch: {
    royalties(val) {
      if (val >= 0 && val <= 100) {
        console.log(val >= 1)
        this.royalties = val
      } else {
        this.royalties = 0
      }
    },
  },
  mounted() {
    this.setContract()
  },
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        const provider = await this.$web3Modal.connect()
        const instance = new ethers.providers.Web3Provider(provider)
        const signer = instance.getSigner()
        this.startHausFactoryContract = new ethers.Contract(
          this.$route.params.contract,
          abi,
          signer
        )
        const contractData = await this.startHausFactoryContract.contractURI()
        const { data } = await this.$axios.get(contractData)
        console.log(data)
        this.collectionName = data.name
        this.description = data.description
        this.previewImage = data.image || data.image_url
        this.royalties = data.seller_fee_basis_points / 100
        this.royaltiesAddress = data.fee_recipient
        this.collectionUrl = data.external_link
        this.approvedList = data.approvedUser
      } else {
        console.log('No cached provider')
      }
    },
    async updateCustomContract() {
      this.creatingContract = true
      try {
        await this.uploadContractDataToIPFS()
        for (const iterator of this.properties) {
          this.approveOwner(iterator, true)
        }
        this.contractDeployed =
          await this.startHausFactoryContract.setContractURI(this.contractURI)
        const response = await this.contractDeployed.wait()
        this.creatingContract = false
        this.$router.push(`/confirm/${response.transactionHash}`)
      } catch (error) {
        console.log(error)
        this.creatingContract = false
      }
    },
    async approveOwner(address, approve) {
      this.contractApproved =
        await this.startHausFactoryContract.setApprovalForAll(address, approve)
      await this.contractApproved.wait()
    },
    async uploadContractDataToIPFS() {
      let addressArray = []
      if (this.properties) {
        addressArray = [...addressArray, ...this.properties]
      }
      if (this.approvedList) {
        addressArray = [...addressArray, ...this.approvedList]
      }
      let image = this.previewImage
      if (this.rawImage) {
        const imageCID = await this.addToIpfs(this.rawImage)
        image = `https://ipfs.io/ipfs/${imageCID}`
      }
      const royalties = this.computedRoyalties
      const metaObj = {
        name: this.collectionName,
        description: this.description,
        image,
        external_link: `${this.collectionUrl}`,
        seller_fee_basis_points: royalties,
        fee_recipient: this.royaltiesAddress,
        approvedUser: addressArray,
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
    async addProperties() {
      try {
        await ethers.utils.getAddress(this.propertieName)
        this.properties.push(this.propertieName)
        this.propertieName = ''
      } catch (error) {
        console.log(error)
      }
    },
    async removePropertie(index) {
      await this.approveOwner(this.approvedList[index], false)
      this.approvedList.splice(index, 1)
    },
    removeNoLoadedPropertie(index) {
      this.properties.splice(index, 1)
    },
  },
}
</script>
