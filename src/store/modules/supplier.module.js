/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import common from '@/common/common'
// import { data } from 'vue-apexcharts'

const apiURL = common._API_URL

const state = {
  allSupplier: [],
  selectedItem: undefined,
  defaultItem: undefined,
}
const actions = {
  loadAllCustomer() {
    axios
      .get(`${apiURL}api/Supplier/GetAllSupplier`)
      .then(res => {
        if (res.data != null && res?.status === 200) {
          commit('setAllCustomer', res.data)
        }
      })
      .catch(err => console.log(err))
  },
  editItem() {},
  delteItem() {},
  save() {},
}
const mutations = {
  setAllCustomer(state, data) {
    state.allSupplier = data
  },
}

const supplier = {
  namespaced: true,
  state,
  actions,
  mutations,
}
export default supplier
