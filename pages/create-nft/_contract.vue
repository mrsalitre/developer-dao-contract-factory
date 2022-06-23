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
            <label class="text-xl font-bold text-gray-500">Image</label>
            <label
              v-if="!previewImage && !previewVideo"
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
              <input
                type="file"
                accept="image/*,video/*"
                class="hidden"
                @change="uploadImage($event)"
              />
            </label>
            <img
              v-if="previewImage"
              :src="previewImage"
              alt=""
              class="h-48 rounded cursor-pointer object-cover"
              @click="previewImage = null"
            />
            <video
              v-if="previewVideo"
              autoplay
              :src="previewVideo"
              class="h-48 rounded cursor-pointer object-cover"
              @click="previewVideo = null"
            />
          </div>
        </div>
        <div class="flex flex-col justify-between h-full col-span-3">
          <div class="pb-4">
            <label for="nft_name" class="text-xl font-bold text-gray-500"
              >Name</label
            >
            <input
              id="nft_name"
              v-model="name"
              type="text"
              class="border w-full rounded py-2 px-3"
            />
          </div>
          <div class="flex flex-col justify-between h-full pb-4 md:pb-0">
            <label for="nft_description" class="text-xl font-bold text-gray-500"
              >Description</label
            >
            <textarea
              id="nft_description"
              v-model="description"
              type="text"
              class="border w-full rounded py-2 px-3 h-48 md:h-full"
            ></textarea>
          </div>
        </div>
        <div class="flex flex-col justify-between h-full md:mt-2 col-span-4">
          <div class="flex flex-wrap">
            <div class="w-full pb-4 md:pb-0">
              <label class="text-xl font-bold text-gray-500">Properties</label>
              <div
                v-for="(propertie, index) in properties"
                :key="index"
                class="grid grid-cols-5 gap-2 pb-2"
              >
                <input
                  v-model="properties[index].trait_type"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  placeholder="Name (eg. Technique)"
                />
                <input
                  v-model="properties[index].value"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
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
                  v-model="propertieName"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
                  name="first_name"
                  placeholder="Name (eg. Technique)"
                />
                <input
                  v-model="propertieValue"
                  type="text"
                  class="border rounded py-2 px-3 col-span-2"
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
            class="bg-white hover:bg-transparent border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
            @click="gasLessMint()"
          >
            {{ minting ? 'Creating NFT...' : 'Create NFT' }}
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
import ForwarderAbi from '~/static/forwarderABI.json'

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
]

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' }
]

const TypedData = {
  types: {
    EIP712Domain,
    ForwardRequest,
  },
  domain: {
    name: 'MinimalForwarder',
    version: '0.0.1',
    chainId: 137,
    verifyingContract: '0x300c8f0e2472EB5b17FbA6aF1b654eB65f12A980',
  },
  primaryType: 'ForwardRequest',
  message: {}
};

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
      rawImage: undefined,
      previewImage: '',
      previewVideo: '',
      rawVideo: undefined,
      rawCover: null,
      previewCover: null,
      minting: false,
      listToMint: [],
      DDFactoryContract: undefined,
      forwarderContract: null,
      provider: null,
      signer: null,
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.accountAddress,
      forwarder: (state) => state.forwarderAddress,
    }),
  },
  mounted() {
    this.setContract()
  },
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        const instance = await this.$web3Modal.connect()
        this.provider = new ethers.providers.Web3Provider(instance)
        this.signer = this.provider.getSigner()
        
        this.forwarderContract = new ethers.Contract(this.forwarder, ForwarderAbi, this.provider);

        this.DDFactoryContract = new ethers.Contract(
          this.$route.params.contract,
          abi,
          this.signer
        )
      } else {
        console.log('No cached provider')
        this.$router.push("/")
      }
    },
    async uploadNFTDataToIPFS() {
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
        this.listToMint.push(`https://ipfs.io/ipfs/${CID}`)
        metaObj = {}
        image = undefined
      } else if (this.previewVideo) {
        let image = `https://ipfs.io/ipfs/${await this.addToIpfs(
          this.rawVideo
        )}`
        let metaObj = {
          name: this.name,
          description: this.description,
          image,
          attributes: this.properties,
        }
        const jsonObj = JSON.stringify(metaObj)
        const CID = await this.addToIpfs(jsonObj)
        this.listToMint.push(`https://ipfs.io/ipfs/${CID}`)
        metaObj = {}
        image = undefined
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
    async gasLessMint() {
      this.minting = true
      try {
        await this.uploadNFTDataToIPFS()

        const nonce = await this.forwarderContract.getNonce(this.user).then(nonce => nonce.toString());

        // Encode meta-tx request
        const factoryInterface = new ethers.utils.Interface(abi);
        const data = factoryInterface.encodeFunctionData('safeMint', [
          this.user,
          this.listToMint
        ]);
        const request = {
          from: this.user,
          to: this.$route.params.contract,
          value: 0,
          gas: 1e6,
          nonce,
          data
        };
        const toSign = { ...TypedData, message: request };

        // Directly call the JSON RPC interface, since ethers does not support signTypedDataV4 yet
        // See https://github.com/ethers-io/ethers.js/issues/830
        const signature = await this.provider.send('eth_signTypedData_v4', [this.user, JSON.stringify(toSign)]);

        console.log(JSON.stringify({ request, signature }))

        const valid = await this.forwarderContract.verify(request, signature);

        console.log(valid)

        const response = await fetch('https://api.defender.openzeppelin.com/autotasks/bf6afdc7-7033-4c87-b15b-7baba971e66d/runs/webhook/a149c5ed-8b42-4b6f-89f0-2e2185926fd7/YKVKcfWKRqAJZcmtdBFeHU', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request, signature })
        })

        const jsonResponse = await response.json()
        if (jsonResponse.result) {
          const txHash = JSON.parse(jsonResponse.result).txHash
          this.minting = false
          this.$router.push(`/confirm/${txHash}`)
        } else {
          await this.mintNFT()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async mintNFT() {
      this.minting = true
      try {
        await this.setContract()
        if (!this.listToMint.length) {
          await this.uploadNFTDataToIPFS()
        }
        this.contractDeploy = await this.DDFactoryContract.safeMint(this.user ,this.listToMint)
        const response = await this.contractDeploy.wait()
        this.minting = false
        this.$router.push(`/confirm/${response.transactionHash}`)
      } catch (error) {
        console.log(error)
        this.minting = false
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
