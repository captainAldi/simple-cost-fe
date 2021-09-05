<template>
  <div>
    <v-container fluid>
      <h1>Details</h1>

      <v-row>
        <v-col
          cols="12"
        >
          <v-card
            elevation="2"
          >
            <v-card-title>
              History
            </v-card-title>
            <v-card-subtitle>
              Chart
            </v-card-subtitle>
            <v-card-text>
              <BarChart 
                v-if="isChartLoaded"
                :chartdata="dataChart" 
                :options="optionChart"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          lg="4"
          md="4"
        >
          <v-card
            elevation="2"
            v-if="costDetailData.DataCost"
          >
            <v-card-title>
              {{costDetailData.DataCost.nama_server}}
            </v-card-title>
            <v-card-subtitle>
              Total Cost: <strong>$ {{costDetailData.DataCost.total_cost}}</strong>
              <br>
              Last Updated: <strong>{{costDetailData.DataCost.updated_at}}</strong>
            </v-card-subtitle>
            <v-card-text>
              <ul>
                <li 
                  v-for="value in costDetailData.DataCost.cost_details" 
                  :key="value.id"
                >
                  {{value.nama_item}} - ${{value.harga_item}}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          lg="8"
          md="8"
        >

          <v-data-table
            :headers="historyHeaders"
            :items="costDetailData.HistoryCost"
            :expanded.sync="expanded"
            sort-by="updated_at"
            :single-expand="true"
            :sort-desc="true"
            show-expand
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>History Table</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <ul>
                  <li 
                    v-for="value in item.history_cost_details" 
                    :key="value.id"
                  >
                    {{value.nama_item}} - ${{value.harga_item}}
                  </li>
                </ul>
              </td>
            </template>
          </v-data-table>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DetailCost',
  components: {
    BarChart: () => import( /* webpackChunkName: "BarChart" */ '@/components/BarChart.vue'),
  },
  data() {
    return {
       api_url: process.env.VUE_APP_API_ENDPOINT,

      isChartLoaded: false,
      dataChart: {},
      optionChart: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
      },


      costDetailData: [],

      expanded: [],
      historyHeaders: [
        {
          text: 'Total Cost ($)',
          value: 'total_cost',
        },
        { text: 'Edited By', value: 'edited_by_id' },
        { text: 'Updated At', value: 'updated_at' },
        { text: '', value: 'data-table-expand' },
      ],

    }
  },

  mounted() {
    this.getHistoryCost()
  },

  methods: {

    async getHistoryCost() {
      try {

        let config = {
          headers: {
            'Authorization': this.user.data.token
          },
        }
        
        let idDetail = this.$route.params.idCost
        const response = await axios.get(this.api_url + '/get-history-cost/' + idDetail, config)

        this.costDetailData = response.data.data

        this.dataChart = {
          labels: this.costDetailData.TanggalUpdate,
          datasets: [{
            label: "USD",
            data: this.costDetailData.TotalCost,
            borderWidth: 1,
            backgroundColor: 'rgba(60,141,188,0.9)',
          }]
        }

        this.isChartLoaded = true

      } catch (error) {
        console.log(error)
      }
    }

  }

}
</script>

<style>

</style>