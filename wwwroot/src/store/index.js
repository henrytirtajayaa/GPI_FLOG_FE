import state from './infra/auth/state'
import * as actions from './infra/auth/actions'
import * as mutations from './infra/auth/mutations'
import * as getters from './infra/auth/getters'

export default {
  state,
  getters,
  mutations,
  actions,
  modules: {}
}