import { create } from 'ipfs-http-client'

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export default ({ app }, inject) => {
  inject('ipfs', async (file) => {
    const added = await ipfs.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    })
    return added.cid.toString()
  })
}
