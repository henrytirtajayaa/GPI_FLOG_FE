<template>
  <div>
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <b-row>
          <b-col sm="12">
            <b-card>         
              <FilteringForm :SmartviewId="SmartviewId" :caption="Page" :Columns="field" v-if="form.isForm&&!form.isResult" :actFormClose="onFormClose" :actFormFilter="onFormFilter"></FilteringForm>
              <DefaultGrid :caption="Page" :Columns="columns" :data="DefaultData" v-if="!form.isForm&&!form.isResult" :actFilter="onFormSearch"></DefaultGrid>
              <ResultGrid :caption="Page" v-if="form.isResult" :Columns="columns" :actResultClose="onResult" :resultData="resultData"></ResultGrid>
             </b-card>
        </b-col>
    </b-row>
  </div>
</template>
<script>
  import DefaultGrid from '@/components/Smartview/DefaultGrid';
  import FilteringForm from '@/components/Smartview/FilteringForm';
  import ResultGrid from '@/components/Smartview/ResultGrid';
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../../services/loginservices'

  export default {
    name: 'smartview',
    layout: 'smartview',
    components: {
     VueElementLoading,
     DefaultGrid,
     FilteringForm,
     ResultGrid
    },
    props: {
      DefaultData: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Array,
        default: () => []
      },
      Page: '',
      SmartviewId: ''
    },
    data: () => {
      return {
        blockLoader: false,
        caption: 'Table Tes',
        form:{
          isForm: false,
          isResult: false
        },
        field: Array(),
        resultData: []
      }
    },
    methods:{
      onFormSearch(){
        this.form.isForm = true
        var field = Array()
        this.columns.forEach(function (row, index) {
          field.push({value: row.Column, text:row.Column})
        });
        this.field = field
      },
      onFormClose(){
        this.form.isForm = false
      },
      onFormFilter(data){
        this.resultData = data
        this.form.isResult = true  
      },
      onResult(){
        this.form.isResult = false  
        this.form.isForm = false
      }
    }
  }
</script>

<style>
@media only screen and (max-width: 1024px) {
  .row .writeofflimit {
    font-size: 10px;
    text-align: right;
    padding-right: 5px;
  }

  #table-sub {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  .row #table-sub th {
    border: 1px solid #ddd;
    padding: 5px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    height: 20px !important;
  }

  .row #table-sub td {
    border: 1px solid rgb(165, 165, 165);
    padding: 5px !important;
    font-size: 10px;
    text-align: center;
    height: 20px !important;
  }

  .row #table-sub .v-input {
    font-size: 10px !important;
  }

  .row #table-sub td .v-text-field {
    font-size: 10px !important;
    padding: 5px 5px;
    margin-top: 1px;
  }

  #table-sub tr {
  }

  #table-sub tr:hover {
  }

  .row #table-sub th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #f0f3f5;
  }

  .row .btn-xsmall {
    height: 20px;
    width: 20px;
  }
  .row .table-title {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size: 10pt;
    font-weight: bold;
    color: #004d40;
    vertical-align: bottom;
  }
}
</style>

