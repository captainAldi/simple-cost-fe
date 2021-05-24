<template>
  <div>
    <v-container fluid>
      <!-- Alert Jika Gagal -->
      <v-alert 
        :type="alertObject.type"
        v-model="alertObject.status"
        dismissible
      >
        <li
          v-for="(value, key) of alertObject.message"
          :key="key"
        >
          <template v-for="item in value"> {{item}} </template>
        </li>
      </v-alert>

      <!-- Form Search -->

      <v-expansion-panels class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-header>FILTERS</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  dense
                  clearable
                  v-model="nama_server"
                  label="Nama Server ..."
                  @input="searchByName"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  dense
                  clearable
                  v-model="pic_team_server"
                  label="PIC Team ..."
                  @input="searchByPicTeam"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  dense
                  clearable
                  v-model="lokasi_server"
                  label="Lokasi Server ..."
                  @input="searchByLokasi"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  filled
                  dense
                  clearable
                  v-model="tipe_server"
                  label="Tipe Server ..."
                  @input="searchByTipe"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-select
                  filled
                  @change="loadPerPage"
                  v-model="meta.per_page"
                  :items="itemsPerPage"
                  label="Per Page"
                ></v-select>
              </v-col>
            </v-row>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Summary -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Summary</v-expansion-panel-header>
          <v-expansion-panel-content>

            <v-row>
              <v-col
                cols="12"
                lg="6"
                md="6"
              >
                <v-card
                  elevation="2"
                >
                  <v-card-title>
                    Total Cost
                  </v-card-title>
                  <v-card-subtitle>
                    Jumlah Biaya untuk Server dalam USD
                  </v-card-subtitle>
                  <v-card-text>
                    <center>
                      <h1>$ {{summaryData.totalCost}}</h1>
                    </center>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                lg="6"
                md="6"
              >
                <v-card
                  elevation="2"
                >
                  <v-card-title>
                    Total Platform
                  </v-card-title>
                  <v-card-subtitle>
                    Jumlah Platform sesuai Filter
                  </v-card-subtitle>
                  <v-card-text>
                    <center>
                      <h1>{{summaryData.totalPlatform}}</h1>
                    </center>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>


      <!-- Table -->
      <v-data-table
        :headers="headers"
        :items="allCostData"
        :loading="dataTableLoading"
        
        must-sort
        hide-default-footer
        class="elevation-4 mt-5"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        
        item-key="index"
      >

        <!-- Untuk Judul / Bagian Atas -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Cost Server</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              dark
              @click="$emit('refresh')"
              small
              class="ma-2"
            >
              <v-icon>
                mdi-reload
              </v-icon>
            </v-btn>

            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

            <!-- <v-btn
              dark
              small
              color="red lighten-1" 
              @click="exportPDF"
              class="ma-2"
            >
              <v-icon dark>mdi-file-pdf-outline</v-icon>
            </v-btn> -->

            <v-dialog
              v-model="dialogForm"
              max-width="800px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="ma-2"
                  v-bind="attrs"
                  v-on="on"
                  small
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.nama_server"
                          label="Nama Server"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.lokasi_server"
                          label="Lokasi Server"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.tipe_server"
                          label="Tipe Server"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.pic_team_server"
                          label="PIC Team"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <hr>
                    <br>

                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <label>Detail Item</label>
                        <div
                          v-for="(input, index) in editedItem.cost_details"
                          :key="`phoneInput-${index}`"
                          class="input wrapper flex items-center"
                        >
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="input.nama_item"
                                label="Nama Item"
                                required
                              ></v-text-field>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="3"
                            >
                              <v-text-field
                                v-model="input.harga_item"
                                label="Harga ($)"
                                required
                              ></v-text-field>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="3"
                            >
                              <!-- Add Svg Icon-->
                              <v-btn
                                color="green"
                                @click="addFieldCostDetail(input.nama_item, input.harga_item, editedItem.cost_details)"
                                small
                                class="mt-4"
                                icon
                              >
                                <v-icon>
                                  mdi-plus-circle-outline
                                </v-icon>
                              </v-btn>

                              <!-- Remove Svg Icon-->
                              <v-btn
                                color="red"
                                v-show="editedItem.cost_details.length > 1"
                                @click="removeFieldCostDetail(index, editedItem.cost_details)"
                                small
                                class="mt-4"
                                icon
                              >
                                <v-icon>
                                  mdi-close-circle-outline
                                </v-icon>
                              </v-btn>

                            </v-col>
                          </v-row>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeFormDialog"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="saveFormDialog"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>



        <!-- Untuk Kolom Nama Server -->
        <template
          v-slot:[`item.nama_server`]="{ item }"
        >
          {{item.nama_server}}
        </template>

        <!-- Untuk Kolom Lokasi  -->
        <template
          v-slot:[`item.lokasi_server`]="{ item }"
        >
          {{item.lokasi_server}}
        </template>

        <!-- Untuk Kolom Tipe -->
        <template
          v-slot:[`item.tipe_server`]="{ item }"
        >
          {{item.tipe_server}}
        </template>

        <!-- Untuk Kolom Total -->
        <template
          v-slot:[`item.total`]="{ item }"
        >
          {{item.total}}
        </template>

        <!-- Untuk Kolom Created At -->
        <template
          v-slot:[`item.created_at`]="{ item }"
        >
          {{item.created_at}}
        </template>

        <!-- Untuk Kolom Updated At -->
        <template
          v-slot:[`item.updated_at`]="{ item }"
        >
          {{item.updated_at}}
        </template>

        <!-- Untuk Kolom Action -->
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            color="red"
            @click="editItem(item)"
            small
            class="ma-2"
            icon
          >
            <v-icon>
              mdi-file-document-multiple-outline
            </v-icon>
          </v-btn>

          <v-btn
            small
            class="mx-2"
            icon
            color="pink" 
            @click="deleteData(item)"
          >
              <v-icon dark>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="$emit('refresh')">Reset</v-btn>
        </template>
      </v-data-table>

      <v-pagination
        v-model="meta.current_page"
        :length="meta.last_page"
        :total-visible="6"
        @input="changePage"
        class="mt-3"
      ></v-pagination>

    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import axios from 'axios'

export default {
  name: 'dataCost',
  props: {
    allCostData: {
        type: Array,
        required: true
    },
    summaryData: {
        type: Object,
        required: true
    },
    headers: {
        type: Array,
        required: true
    },
    meta: {
        required: true
    },
    dataTableLoading: {
        required: true
    },
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      allCost: [],

      nama_server: '',
      pic_team_server: '',
      lokasi_server: '',
      tipe_server: '',

      page: '1',

      itemsPerPage: [
        '1',
        '5',
        '10',
        '15',
        '20'
      ],

      alertObject: {
        type: 'success',
        message: {},
        status: false
      },

      sortBy: null, 
      sortDesc: false,

      dialogForm: false,
      editedIndex: -1,
      editedItem: {
        nama_server: "",
        lokasi_server: "",
        tipe_server: "",
        pic_team_server: "",
        cost_details: [
          {
              "nama_item": "",
              "harga_item": 0
          },
        ]
      },
      defaultItem: {
        nama_server: "",
        lokasi_server: "",
        tipe_server: "",
        pic_team_server: "",
        cost_details: [
          {
              "nama_item": "",
              "harga_item": 0
          },
        ]
      },

    }
  },

  mounted() {

  },

  watch: {
    sortBy() {
      this.$emit('sort', {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc
      })
    },

    sortDesc() {
      this.$emit('sort', {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc
      })
    },

    dialogForm (val) {
      val || this.closeFormDialog()
    },
  },

  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
      setDialog : 'dialog/set'
    }),

    showDetail(item) {
      this.$router.push(`/admin/hasil-pkg/${item}`)
    },

    loadPerPage() {
      this.$emit('per_page', this.meta.per_page)
    },

    changePage(val) {
      this.$emit('pagination', val)
    },

    searchByName: _.debounce(function (e) {
      this.$emit('searchName', e)
    }, 500),

    searchByPicTeam: _.debounce(function (e) {
      this.$emit('searchPicTeam', e)
    }, 500),

    searchByLokasi: _.debounce(function (e) {
      this.$emit('searchLokasi', e)
    }, 500),

    searchByTipe: _.debounce(function (e) {
      this.$emit('searchTipe', e)
    }, 500),

    async deleteData(e) {
      const sw = await this.$swal.fire({
        title: 'Are you sure?',
        text: `Delete "${e.nama_server}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      
      if (sw.value) {
        try {
          
          this.setDialog({
            status : true,
          })
          
          // let config = {
          //   headers: {
          //     'Authorization': this.user.api_token
          //   }
          // }

          const response = await axios.delete(this.api_url + '/delete-cost/' + e.id)

          this.setDialog({
            status : false,
          })

          this.$emit('refresh')

          this.setAlert({
            status : true,
            color  : 'success',
            text  : response.data.message,
          })
          

        } catch (error) {
          this.setAlert({
            status : true,
            color  : 'error',
            text  : error.response.data,
          })
        }
      } 

    },

    async exportPDF() {
      try {
        
        this.setDialog({
          status : true,
        })
        
        let config = {
          headers: {
            'Authorization': this.user.api_token,
          },
          responseType: 'blob',
        }

        const response = await axios.get(`${this.api_url}/admin/cetak/pkg`, config)

        const downloadUrl = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));

        // Get Date Time
        let dateTimeNow = new Date()

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `hasil-pkg-${dateTimeNow.getDate()}${dateTimeNow.getMonth()}${dateTimeNow.getFullYear()}-${dateTimeNow.getHours()}${dateTimeNow.getMinutes()}.pdf`); //any other name + extension
        document.body.appendChild(link);
        link.click();
        link.remove();  

        this.setDialog({
          status : false,
        })

      } catch (error) {
        this.setDialog({
          status : false,
        })
        
        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })
      }
    },

    editItem (item) {
      this.editedIndex = this.allCostData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogForm = true
    },

    closeFormDialog () {
      this.dialogForm = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async saveFormDialog(e) {
      e.preventDefault()

      if (this.editedIndex > -1) {
        // Jika Edit
        // Object.assign(this.allCostData[this.editedIndex], this.editedItem)
        try {

          this.setDialog({
            status : true,
          })
          
          // let config = {
          //   headers: {
          //     'Authorization': this.user.api_token,
          //     'Content-Type': 'multipart/form-data',
          //   }, 
          // }

          let formData = new FormData()

          formData.append('nama_server', this.editedItem.nama_server)
          formData.append('lokasi_server', this.editedItem.lokasi_server)
          formData.append('tipe_server', this.editedItem.tipe_server)
          formData.append('pic_team_server', this.editedItem.pic_team_server)
          formData.append('_method', 'PATCH')

          for (let i = 0; i < this.editedItem.cost_details.length; i++) {
            for (let key of Object.keys(this.editedItem.cost_details[i])) {
              console.log('hello...', this.editedItem.cost_details[i][key]);
              formData.append(`item_detail[${i}][${key}]`, this.editedItem.cost_details[i][key]);
            }
          }
          


          const response = await axios.post(this.api_url + '/update-cost/' + this.editedItem.id, formData)

          this.setDialog({
            status : false,
          })

          this.setAlert({
            status : true,
            color  : 'success',
            text  : response.data.message,
          })

          this.$emit('refresh')

        } catch (error) {
          
          this.setDialog({
            status : false,
          })

          if (error.response.status === 422) {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Inputan tidak Valid !',
            })
          } else {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Internal Server Error !',
            })
          }

          this.alertObject.status = true
          this.alertObject.type = 'error'
          this.alertObject.message = error.response.data

        } 
      } else {
        // Jika Tambah Baru
        // this.allCostData.push(this.editedItem)

        try {

          this.setDialog({
            status : true,
          })
          
          // let config = {
          //   headers: {
          //     'Authorization': this.user.api_token,
          //     'Content-Type': 'multipart/form-data',
          //   }, 
          // }

          let formData = new FormData()

          formData.append('nama_server', this.editedItem.nama_server)
          formData.append('lokasi_server', this.editedItem.lokasi_server)
          formData.append('tipe_server', this.editedItem.tipe_server)
          formData.append('pic_team_server', this.editedItem.pic_team_server)

          for (let i = 0; i < this.editedItem.cost_details.length; i++) {
            for (let key of Object.keys(this.editedItem.cost_details[i])) {
              console.log('hello...', this.editedItem.cost_details[i][key]);
              formData.append(`item_detail[${i}][${key}]`, this.editedItem.cost_details[i][key]);
            }
          }


          const response = await axios.post(this.api_url + '/create-cost', formData)

          this.setDialog({
            status : false,
          })

          this.setAlert({
            status : true,
            color  : 'success',
            text  : response.data.message,
          })

          this.$emit('refresh')

        } catch (error) {
          
          this.setDialog({
            status : false,
          })

          if (error.response.status === 422) {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Inputan tidak Valid !',
            })
          } else {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Internal Server Error !',
            })
          }

          this.alertObject.status = true
          this.alertObject.type = 'error'
          this.alertObject.message = error.response.data

        } 

      }
      // Tutup Dialog
      this.closeFormDialog()
    },

    addFieldCostDetail(nama, harga, fieldType) {
      fieldType.push(
        { 
          nama_item: "",
          harga_item: 0
        }
      );
    },
    removeFieldCostDetail(index, fieldType) {
      fieldType.splice(index, 1);
    },

  }
}
</script>

<style>

</style>