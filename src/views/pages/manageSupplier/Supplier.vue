<template>
  <v-data-table :headers="headers" :items="suppliers" sort-by="id" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>NHÀ CUNG CẤP</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> New Item </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-col>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Tên NCC"></v-text-field>
                  </v-row>
                  <v-row col="12">
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="SĐT"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-model="editedItem.address" label="Địa chỉ"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                  </v-row>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                  </v-col> -->
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
const apiURL = common._API_URL + 'api/Supplier/'
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
      { text: 'Tên NCC', value: 'name' },
      { text: 'SĐT', value: 'phone' },
      { text: 'Địa chỉ', value: 'address' },
      { text: 'Email', value: 'email' },
      { text: 'Chức năng', value: 'actions', sortable: false },
    ],
    suppliers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      phone: '',
      address: '',
      email: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      phone: '',
      address: '',
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
        .get(`${apiURL}GetAllSupplier`)
        .then(res => {
          if (res.data != null && res?.status === 200) {
            // commit('setAllCustomer', res.data)
            this.suppliers = res.data
          }
        })
        .catch(err => console.log(err))
    },

    editItem(item) {
      console.log('editItem: ', item)
      this.editedIndex = this.suppliers.indexOf(item)
      console.log(this.suppliers.indexOf(item))
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.suppliers.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.suppliers.splice(this.editedIndex, 1)
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
          .put(`${apiURL}UpdateSupplier/`, edtItm)
          .then(res => {
            if (res.status === 200) {
              console.log('editedIndex:: ', edtIdx)
              console.log('this.editedItem:: ', edtItm)
              Object.assign(this.suppliers[edtIdx], edtItm)
            }
          })
          .catch(err => console.log(err))
      } else {
        axios
          .post(`${apiURL}InsertSupplier/`, edtItm)
          .then(res => {
            if (res.status === 200) {
              this.suppliers.push(edtItm)
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
