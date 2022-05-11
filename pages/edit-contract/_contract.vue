<template>
  <p>test</p>
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
    async createCustomContract() {
      this.creatingContract = true
      try {
        ethers.utils.getAddress(this.royaltiesAddress)
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
