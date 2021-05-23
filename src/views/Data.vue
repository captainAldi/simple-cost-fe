<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <h1>Data</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <DataCost
            :allCostData="allCostData" 
            :summaryData="summaryData"
            :headers="headers" 
            :meta="meta"
            :dataTableLoading="dataTableLoading"
            @per_page="handlePerPage" 
            @pagination="handlePagination" 
            @searchName="handleSearchName"
            @searchPicTeam="handleSearchPicTeam"
            @searchLokasi="handleSearchLokasi" 
            @searchTipe="handleSearchTipe"
          
            @sort="handleSort"
            @refresh="handleRefreshData"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'dataCost',
  components: {
    DataCost: () => import( /* webpackChunkName: "dataPkgData" */ '@/components/DataCost.vue'),
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      allCostData: [],
      summaryData: {},

      headers: [
        {
          text: 'Nama Server',
          align: 'start',
          value: 'nama_server',
        },
        {
          text: 'Lokasi',
          align: 'start',
          value: 'lokasi_server',
        },
        {
          text: 'Tipe',
          align: 'start',
          value: 'tipe_server',
        },
        { text: 'PIC Team', value: 'pic_team_server' },
        { text: 'Total ($)', value: 'total_cost' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Updated At', value: 'updated_at' },

        { text: 'Actions', value: 'action', sortable: false },
      ],
      meta: [],
      dataTableLoading: true,

      current_page: 1, 
      per_page: 10, 
      sortBy: 'updated_at',
      sortByDesc: true,

      searchName: '',
      searchPicTeam: '',
      searchLokasi: '',
      searchTipe: '',
    }
  },

  mounted() {
    this.loadData()
  },

  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),
  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
      setDialog : 'dialog/set'
    }),

    async loadData() {
      try {
        
        this.dataTableLoading = true

        let config = {
          // headers: {
          //   'Authorization': this.user.api_token
          // },
          params: {
            page: this.current_page,
            per_page: this.per_page,
            sortby: this.sortBy,
            sortbydesc: this.sortByDesc ? 'DESC':'ASC',

            nama_server: this.searchName,
            tipe_server: this.searchTipe,
            pic_team_server: this.searchPicTeam,
            lokasi_server: this.searchLokasi,
          }
        }

        const response = await axios.get(this.api_url + '/get-all-cost', config)

        let getData = response.data.data

        this.allCostData = getData.SemuaCost.data

        this.summaryData = {
          totalCost: getData.TotalCost,
          totalPlatform: getData.TotalPlatform
        }

        this.meta = {
          total: getData.SemuaCost.total,
          current_page: getData.SemuaCost.current_page,
          per_page: getData.SemuaCost.per_page,
          last_page: getData.SemuaCost.last_page,
        }

        this.dataTableLoading = false

        if (getData.SemuaCost.data.length > 0) {
            this.setAlert({
              status : true,
              color  : 'success',
              text  : 'Data Berhasil di Ambil',
            })
          } else {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Data Tidak Ada !',
            })
          }

      } catch (error) {
        this.dataTableLoading = false

        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })
      }
    },

    handlePerPage(val) {
      this.per_page = val 
      this.loadData()
    },

    handlePagination(val) {
        this.current_page = val
        this.loadData()
    },

    handleSearchName(val) {
        this.current_page = '1' 
        this.searchName = val
        this.loadData()
    },

    handleSearchPicTeam(val) {
        this.current_page = '1' 
        this.searchPicTeam = val
        this.loadData()
    },

    handleSearchLokasi(val) {
        this.current_page = '1' 
        this.searchLokasi = val
        this.loadData()
    },

    handleSearchTipe(val) {
        this.current_page = '1' 
        this.searchTipe = val
        this.loadData()
    },

    handleSort(val) {
        this.sortBy = val.sortBy
        this.sortByDesc = val.sortDesc

        this.loadData()
    },

    handleRefreshData() {
      this.loadData()
    }

  }
}
</script>

<style>

</style>