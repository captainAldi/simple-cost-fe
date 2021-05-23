<template>
  <div>
    <v-container fluid>
      <h1>Home</h1>
      
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
              Jumlah Biaya untuk Semua Server dalam USD
            </v-card-subtitle>
            <v-card-text>
              <center>
                <h1>$ {{allCost.TotalCost}}</h1>
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
              Jumlah Semua Platform yang Ada
            </v-card-subtitle>
            <v-card-text>
              <center>
                <h1>{{allCost.TotalPlatform}}</h1>
              </center>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
        >
          <v-card
            elevation="2"
          >
            <v-card-title>
              Top 10
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
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',

  components: {
    BarChart: () => import( /* webpackChunkName: "BarChart" */ '@/components/BarChart.vue'),
  },

  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      allCost: [],

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
      }
    }
  },

  mounted() {
    this.getTotalSummaryCost()
  },

  methods: {

    async getTotalSummaryCost() {
      try {

        const response = await axios.get(this.api_url + '/get-total-summary-cost/')

        this.allCost = response.data.data

        this.dataChart = {
          labels: this.allCost.NamaPlatform,
          datasets: [{
            label: "USD",
            data: this.allCost.TotalCostPlatform,
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
