<template>
  <section class="pt-20">
    <div>
      <nuxt-link to="/" class="underline text-gray-500">back </nuxt-link>
      <h2 class="text-7xl text-gray-500 font-extralight">Create NFT</h2>
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
          </div>
        </div>
        <div class="flex flex-col justify-between h-full col-span-3">
          <div class="pb-4">
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
            <div class="w-full pb-4 md:pb-0">
              <label for="first_name" class="text-xl font-bold text-gray-500"
                >Properties</label
              >
              <div
                v-for="(propertie, index) in properties"
                :key="index"
                class="grid grid-cols-5 gap-2 pb-2"
              >
                <input
                  id="first_name"
                  v-model="properties[index].trait_type"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  name="first_name"
                  placeholder="Name (eg. Technique)"
                />
                <input
                  id="first_name"
                  v-model="properties[index].value"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  name="first_name"
                  placeholder="Value (eg. Accuarela)"
                />
                <button
                  class="bg-white border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
                  @click="removePropertie(index)"
                >
                  Remove
                </button>
              </div>
              <div class="grid grid-cols-5 gap-2">
                <input
                  id="first_name"
                  v-model="propertieName"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  name="first_name"
                  placeholder="Name (eg. Technique)"
                />
                <input
                  id="first_name"
                  v-model="propertieValue"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  name="first_name"
                  placeholder="Value (eg. Accuarela)"
                />
                <button
                  class="bg-white border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
                  @click="addProperties()"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 col-span-4">
          <button
            class="bg-white border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
          >
            Create NFT
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import abi from '~/static/generatedAbi.json'

export default {
  name: 'CreateNft',
  data() {
    return {
      name: '',
      description: '',
      copies: 1,
      properties: [],
      propertieName: '',
      propertieValue: '',
      contractURI: [],
      rawImage: undefined,
      previewImage: '',
      previewVideo: '',
      rawVideo: undefined,
      rawCover: null,
      previewCover: null,
      creatingContract: false,
      startHausFactoryContract: undefined,
    }
  },
  computed: {
    ...mapState({
      currentAccount: (state) => state.user.accountAddress,
    }),
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
      } else {
        console.log('No cached provider')
      }
    },
    async uploadNFTDataToIPFS() {
      console.log('holis')
      if (this.previewImage) {
        let image = `https://ipfs.io/ipfs/${await this.addToIpfs(
          this.rawImage
        )}`
        let metaObj = {
          name: this.name,
          description: this.description,
          image,
          attributes: this.properties,
        }
        const jsonObj = JSON.stringify(metaObj)
        const CID = await this.addToIpfs(jsonObj)
        // this.contractURI = []
        this.contractURI.push(`https://ipfs.io/ipfs/${CID}`)
        metaObj = {}
        image = undefined
      } else if (this.previewVideo) {
        let image = `https://ipfs.io/ipfs/${await this.addToIpfs(
          this.rawVideo
        )}`
        let cover = `https://ipfs.io/ipfs/${await this.addToIpfs(
          this.rawCover
        )}`
        let metaObj = {
          name: this.name,
          description: this.description,
          image,
          cover,
          attributes: this.properties,
        }
        const jsonObj = JSON.stringify(metaObj)
        const CID = await this.addToIpfs(jsonObj)
        this.contractURI.push(`https://ipfs.io/ipfs/${CID}`)
        metaObj = {}
        image = undefined
        cover = undefined
      }
    },
    async addToIpfs(content) {
      const CID = await this.$ipfs(content)
      return CID
    },
    uploadImage(e) {
      console.log(e.target.files[0].type)
      if (
        e.target.files[0].type === 'image/jpeg' ||
        e.target.files[0].type === 'image/png'
      ) {
        this.rawImage = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(this.rawImage)
        reader.onload = (e) => {
          this.previewImage = e.target.result
        }
      } else if (
        e.target.files[0].type === 'video/mp3' ||
        e.target.files[0].type === 'video/mp4'
      ) {
        this.rawVideo = e.target.files[0]
        this.previewVideo = URL.createObjectURL(e.target.files[0])
      }
    },
    uploadCover(e) {
      console.log(e.target.files[0].type)
      this.rawCover = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(this.rawCover)
      reader.onload = (e) => {
        this.previewCover = e.target.result
      }
    },
    async createCustomContract() {
      this.creatingContract = true
      try {
        await this.setContract()
        await this.uploadNFTDataToIPFS()
        this.contractDeployed = await this.startHausFactoryContract.mint(
          this.contractURI
        )
        const response = await this.contractDeployed.wait()
        this.creatingContract = false
        this.$router.push(`/confirm/${response.transactionHash}`)
      } catch (error) {
        this.creatingContract = false
        this.contractURI = []
      }
    },
    addProperties() {
      this.properties.push({
        trait_type: this.propertieName,
        value: this.propertieValue,
      })
      this.propertieName = ''
      this.propertieValue = ''
    },
    removePropertie(index) {
      this.properties.splice(index, 1)
    },
  },
}
</script>
