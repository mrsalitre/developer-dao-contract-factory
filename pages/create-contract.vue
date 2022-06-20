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
            <label class="text-xl font-bold text-gray-500">Image</label>
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
          <div class="flex flex-wrap">
            <div class="w-full md:w-2/3 pb-4 md:pb-0">
              <label for="contract_name" class="text-xl font-bold text-gray-500"
                >Name</label
              >
              <input
                id="contract_name"
                v-model="collectionName"
                type="text"
                class="border w-full rounded py-2 px-3"
              />
            </div>
            <div class="w-full md:w-1/3 md:pl-2 pb-4">
              <label
                for="contract_symbol"
                class="text-xl font-bold text-gray-500"
                >Symbol</label
              >
              <input
                id="contract_symbol"
                v-model="shortName"
                type="text"
                class="border w-full rounded py-2 px-3"
                name="first_name"
              />
            </div>
          </div>
          <div class="flex flex-col justify-between h-full pb-4 md:pb-0">
            <label
              for="contract_description"
              class="text-xl font-bold text-gray-500"
              >Description</label
            >
            <textarea
              id="contract_description"
              v-model="description"
              type="text"
              class="border w-full rounded py-2 px-3 h-48 md:h-full"
            ></textarea>
          </div>
        </div>
        <div class="flex flex-col justify-between h-full md:mt-2 col-span-4">
          <div class="flex flex-wrap">
            <div class="w-full md:w-3/4 pb-4 md:pb-0">
              <label
                for="contract_owner"
                class="text-xl font-bold text-gray-500"
                >Payee´s Address</label
              >
              <input
                id="contract_owner"
                v-model="royaltiesAddress"
                type="text"
                class="border w-full rounded py-2 px-3"
              />
            </div>
            <div class="w-full md:w-1/4 md:pl-2 pb-4 md:pb-0">
              <label
                for="contract_royalties"
                class="text-xl font-bold text-gray-500"
                >Royalties</label
              >
              <div class="flex items-center border rounded py-2 px-3">
                <input
                  id="contract_royalties"
                  v-model.number="royalties"
                  class="appearance-none bg-transparent border-none w-full mr-3 focus:outline-none"
                  type="number"
                />
                <span class="flex-shrink-0 text-sm" type="button"> % </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 col-span-4">
          <button
            class="bg-white hover:bg-transparent border mx-0 mb-0 py-2 px-2 w-full rounded shadow-md hover:shadow-none"
            @click="createGasLessContract()"
          >
            {{ creatingContract ? 'Creating Contract...' : 'Create Contract' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import abi from '~/static/abi.json'
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
    chainId: 4,
    verifyingContract: '0x3424E811eaeeD59CE5Fb7A09EA3473f8c27896eE',
  },
  primaryType: 'ForwardRequest',
  message: {}
};

export default {
  name: 'CreateContract',
  data() {
    return {
      collectionName: '',
      shortName: '',
      description: '',
      royalties: 3,
      royaltiesAddress: '',
      previewImage: '',
      rawImage: undefined,
      contractURI: '',
      creatingContract: false,
      contractDeploy: null,
      DDContractFactory: null,
      forwarderContract: null,
      provider: null,
      signer: null,
    }
  },
  mounted() {
    this.setContract()
    this.royaltiesAddress = this.user
  },
  computed: {
    ...mapState({
      user: (state) => state.user.accountAddress,
      factoryAddress: (state) => state.factoryAddress,
      forwarder: (state) => state.forwarderAddress,
    }),
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
  methods: {
    async setContract() {
      if (this.$web3Modal.cachedProvider) {
        try {
          const instance = await this.$web3Modal.connect()
          this.provider = new ethers.providers.Web3Provider(instance)
          this.signer = this.provider.getSigner()

          // const network = await this.provider.getNetwork();
          // if (network.chainId !== 4) throw new Error(`Must be connected to Rinkeby`);

          this.forwarderContract = new ethers.Contract(this.forwarder, ForwarderAbi, this.provider);

          this.DDContractFactory = new ethers.Contract(
            this.factoryAddress,
            abi,
            this.signer
          )
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log('No cached provider')
        this.$router.push("/")
      }
    },
    async createGasLessContract() {
      this.creatingContract = true
      try {
        ethers.utils.getAddress(this.royaltiesAddress)
        await this.uploadContractDataToIPFS()

        const nonce = await this.forwarderContract.getNonce(this.user).then(nonce => nonce.toString());

        // Encode meta-tx request
        const factoryInterface = new ethers.utils.Interface(abi);
        const data = factoryInterface.encodeFunctionData('createDDERC721', [
          this.collectionName,
          this.shortName,
          this.contractURI,
          "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE"
        ]);
        const request = {
          from: this.user,
          to: this.factoryAddress,
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
          this.creatingContract = false
          this.$router.push(`/confirm/${txHash}`)
        } else {
          await this.createCustomContract()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async createCustomContract() {
      this.creatingContract = true
      try {
        ethers.utils.getAddress(this.royaltiesAddress)
        if (!this.contractURI) {
          await this.uploadContractDataToIPFS()
        }
        this.contractDeploy = await this.DDContractFactory.createDDERC721(
          this.collectionName,
          this.shortName,
          this.contractURI,
          "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE"
        )
        const response = await this.contractDeploy.wait()
        this.creatingContract = false
        this.$router.push(`/confirm/${response.transactionHash}`)
      } catch (error) {
        console.log(error)
        this.creatingContract = false
      }
    },
    async uploadContractDataToIPFS() {
      const imageCID = await this.addToIpfs(this.rawImage)
      const image = `https://ipfs.io/ipfs/${imageCID}`
      const royalties = this.royalties * 100
      const metaObj = {
        name: this.collectionName,
        description: this.description,
        image,
        seller_fee_basis_points: royalties,
        fee_recipient: this.royaltiesAddress,
      }
      const jsonObj = JSON.stringify(metaObj)
      const CID = await this.addToIpfs(jsonObj)
      this.contractURI = `https://ipfs.io/ipfs/${CID}`
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
