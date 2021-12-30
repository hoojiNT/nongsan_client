/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from '@/store/modules/auth.module'

// import { reject } from 'core-js/fn/promise'
Vue.use(Vuex)
const apiURL = 'http://localhost:5000/'
export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
  },
  getters: {},
  mutations: {},
  actions: {
    // login({ commit }, user) {
    //   return new Promise((resolve, reject) => {
    //     commit('auth_request')
    //     const url = `${apiURL}Authenticate/Login`
    //     axios({ url, data: user, method: 'POST' })
    //       .then(resp => {
    //         const { token, user } = resp.data
    //         localStorage.setItem('token', token)
    //         axios.defaults.headers.common['Authorization'] = token
    //         commit('auth_success', token, user)
    //         resolve(resp)
    //       })
    //       .catch(err => {
    //         commit('auth_error')
    //         localStorage.removeItem('token')
    //         reject(err)
    //       })
    //   })
    // },
    // register({ commit }, user) {
    //   return new Promise((resolve, reject) => {
    //     commit('auth_request')
    //     axios({ url: `${apiURL}Authenticate/register`, data: user, method: 'POST' })
    //       .then(resp => {
    //         const { user, token } = resp.data
    //         localStorage.setItem('token', token)
    //         axios.defaults.headers.common['Authorization'] = token
    //         commit('auth_success', token, user)
    //         resolve(resp)
    //       })
    //       .catch(err => {
    //         commit('auth_error', err)
    //         localStorage.removeItem('token')
    //         reject(err)
    //       })
    //   })
    // },
    // logout({ commit }) {
    //   return new Promise(resolve => {
    //     commit('logout')
    //     localStorage.removeItem('token')
    //     delete axios.defaults.headers.common['Authorization']
    //     resolve()
    //   })
    // },
  },
  modules: {
    supplier: () => import('@/store/modules/supplier.module'),
    auth: auth,
  },
})
