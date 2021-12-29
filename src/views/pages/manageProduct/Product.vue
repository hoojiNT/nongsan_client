<template>
  <v-data-table :headers="headers" :items="products" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>NÔNG SẢN</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" >
                <v-icon color="white">mdi-plus</v-icon>
                New Item 
            </v-btn>
            
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Import </v-btn>
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Export</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-col>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Tên NS"></v-text-field>
                  </v-row>
                  <v-row col="12">
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.price" label="Giá bán"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.originalPrice" label="Giá vốn"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field  label="Tồn kho"></v-text-field>
                  </v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field  label="Đặt hàng"></v-text-field>
                  </v-col>
                </v-col>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"> Are you sure you want to delete this item? </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"> OK </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import common from '@/common/common'
import axios from 'axios'
const apiURL = common._API_URL + 'api/Product/'
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Mã',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'Tên NS', value: 'name' },
      { text: 'Giá bán', value: 'price' },
      { text: 'Giá vốn', value: 'originalPrice' },
      { text: 'Tồn kho', value: 'email' },
      { text: 'Chức năng', value: 'actions', sortable: false },
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      name: '',
      price: '',
      originalPrice: '',
      email: '',
    },
    defaultItem: {
      id: '',
      name: '',
      price: '',
      originalPrice: '',
      email: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      axios
        .get(`${apiURL}GetAllProduct`)
        .then(res => {
          if (res.data != null && res?.status === 200) {
            // commit('setAllCustomer', res.data)
            this.products = res.data
          }
        })
        .catch(err => console.log(err))
    },

    editItem(item) {
      console.log('editItem: ', item)
      this.editedIndex = this.products.indexOf(item)
      console.log(this.products.indexOf(item))
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.products.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save() {
      const edtIdx = this.editedIndex
      let edtItm = this.editedItem
      if (edtIdx > -1) {
        axios
          .put(`${apiURL}UpdateProduct/`, edtItm)
          .then(res => {
            if (res.status === 200) {
              console.log('editedIndex:: ', edtIdx)
              console.log('this.editedItem:: ', edtItm)
              Object.assign(this.products[edtIdx], edtItm)
            }
          })
          .catch(err => console.log(err))
      } else {
        axios
          .post(`${apiURL}InsertProduct/`, edtItm)
          .then(res => {
            if (res.status === 200) {
              this.products.push(edtItm)
            }
          })
          .catch(err => console.log(err))
      }
      this.close()
    },
  },
}
</script>

<style></style>
