export const state = () => ({
  accountAddress: null,
  accountENS: null,
  contracts: null,
})

export const mutations = {
  SET_ACCOUNT_ADDRESS(state, address) {
    state.accountAddress = address
  },
  SET_ACCOUNT_ENS(state, ENS) {
    state.accountENS = ENS
  },
  SET_CONTRACTS(state, contracts) {
    state.contracts = contracts
  },
  CLEAR(state) {
    state.accountAddress = null
    state.accountENS = null
    state.contracts = null
  },
}
