<template>
  <v-data-table :headers="headers" :items="products" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>NÔNG SẢN</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                    <v-text-field v-model="editedItem.name" label="Tên sản phẩm"></v-text-field>
                  </v-row>
                  <v-row col="12">
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.price" label="Giá bán"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.originalPrice" label="Giá vốn"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="refExpirationDate"
                        v-model="edate"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.expirationDate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.expirationDate"
                            label="Ngày sản hết hạn"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.expirationDate" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="edate = false"> Cancel </v-btn>
                          <v-btn text color="primary" @click="$refs.refExpirationDate.save(editedItem.expirationDate)">
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="refManufactureDate"
                        v-model="mdate"
                        :close-on-content-click="false"
                        :return-value.sync="editedItem.expirationDate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.dateManufacturingDate"
                            label="Ngày sản sản xuất"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.dateManufacturingDate" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="mdate = false"> Cancel </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.refManufactureDate.save(editedItem.dateManufacturingDate)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Đặt hàng"></v-text-field>
                  </v-col> -->
                  <v-row>
                    <v-combobox label="Nhà cung cấp"></v-combobox>
                    <v-combobox label="Loại sản phẩm"></v-combobox>
                  </v-row>
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
const apiSupplier = common._API_URL + 'api/Supplier/'
const apiCategory = common._API_URL + 'api/Category/'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    mdate: false,
    edate: false,

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
      { text: 'Tồn kho', value: 'expirationDate' },
      { text: 'Chức năng', value: 'actions', sortable: false },
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      price: 0,
      originalPrice: 0,
      detail: '',
      description: '',
      isDiscount: false,
      viewCount: 0,
      discountAmount: 0,
      dateManufacturingDate: '',
      expirationDate: '',
      supplierID: 3,
      categoryID: 3,
    },
    defaultItem: {
      id: 0,
      name: '',
      price: '',
      originalPrice: 0,
      detail: '',
      description: '',
      isDiscount: false,
      viewCount: 0,
      discountAmount: 0,
      editedItem: '',
      expirationDate: '',
      dateManufacturingDate: '',
      supplierID: 3,
      categoryID: 3,
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
      console.log(this.editedItem)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      var itemid = this.editedItem.id
      var edtIdx = this.editedIndex
      console.log('deleteItemConfirm:', itemid)
      axios.delete(`${apiURL}DeleteProduct/?id=${itemid}`).then(res => {
        if (res.status === 200) {
          this.products.splice(edtIdx, 1)
          this.closeDelete()
        }
      })
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
            if (res.status === 400) {
              console.log('editedIndex:: ', edtIdx)
              console.log('this.editedItem:: ', edtItm)
            }
            if (res.status === 200) {
              this.products.push(edtItm)
            }
          })
          .catch(error => {
            if (error.response) {
              // Request made and server responded
              console.log(error.response.data)
              console.log(error.response.status)
              console.log(error.response.headers)
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
          })
      }
      this.close()
    },
  },
}
</script>

<style></style>
