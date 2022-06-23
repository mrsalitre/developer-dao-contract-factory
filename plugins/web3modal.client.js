import Vue from 'vue'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        137: 'https://polygon-rpc.com/',
      },
    },
  },
}

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
})

Object.defineProperty(Vue.prototype, '$web3Modal', { value: web3Modal })
