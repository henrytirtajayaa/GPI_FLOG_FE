<template>
  <div>
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <div class="row">
      <b-col md="8" style="vertical-align:bottom;">
        <span class="table-title">{{caption}}</span>
      </b-col>
      <b-col md="4">
        <div class="form-inline justify-content-sm-end" >
          <xlsx-workbook v-if="resultData.length > 0">
            <xlsx-sheet
              :collection="resultData"
              v-for="sheet in sheets"
              :key="sheet.name"
              :sheet-name="sheet.name"
            />
            <xlsx-download :filename="filename">
              <b-button variant="success" style="margin:2px;" size="sm" rounded ><font-awesome-icon :icon="['fas', 'file-excel']" />&nbsp;Download</b-button>
            </xlsx-download>
          </xlsx-workbook>
          <b-button variant="" style="margin:2px;" size="sm" rounded @click="onCloseClick()">
            <font-awesome-icon :icon="['fas', 'window-close']" />&nbsp;Close
          </b-button>
        </div>
      </b-col>
    </div>
    <div style="width:100%;overflow-y: auto;">
    <table id="table-sub">
      <thead>
        <tr>
          <th class="text-left" v-for="(row, index) in Columns">{{row.Column}}</th>
        </tr>
      </thead>
      <tbody class="position-relative">
        <tr v-for="(row, index) in resultData">
          <td v-for="(child, index2) in row">{{row[index2]}}</td>
        </tr>
      </tbody>
      <slot name="caption" />
    </table>
    </div>  
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading"
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from "vue-xlsx"
  import moment from "moment"

export default {
  name: "DefaultGrid",
  components: {
    VueElementLoading,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
    moment
  },
  props: {
    caption: "",
    disableNewButton: { type:Boolean, default : false},
    actResultClose: { type: Function },
    resultData: {
      type: Array,
      default: () => []
    },
    Columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      blockLoader: false,
      sheetName: null,
      sheets: [{ name: this.caption }],
      filename: this.caption + moment().format('DDMMYYYY') + ".xlsx"
    }
  },
  methods:{
    onCloseClick() {
      this.actResultClose();
    },
  }
}
</script>
<style scoped>
.writeofflimit {
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}

#table-sub {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#table-sub th {
  border: 1px solid #ddd;
  padding: 5px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  height: 20px !important;
}

#table-sub td {
  border: 1px solid rgb(165, 165, 165);
  padding: 5px !important;
  font-size: 12px;
  text-align: center;
  height: 20px !important;
}

#table-sub .v-input {
  font-size: 12px !important;
}

#table-sub td .v-text-field {
  font-size: 12px !important;
  padding: 5px 5px;
  margin-top: 1px;
}

#table-sub tr {
}

#table-sub tr:hover {
}

#table-sub th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #f0f3f5;
}

.btn-xsmall {
  height: 20px;
  width: 20px;
}
.table-title {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  font-size: 13pt;
  font-weight: bold;
  color: #004d40;
  vertical-align: bottom;
}
</style>