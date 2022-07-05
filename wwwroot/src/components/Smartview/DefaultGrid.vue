<template>
  <div>
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <div class="row">
      <b-col md="8" style="vertical-align:bottom;">
        <span class="table-title">Preview of {{caption}}</span>
      </b-col>
      <b-col md="4">
        <div class="form-inline justify-content-sm-end" v-if="!disableNewButton">
          <b-button variant="success" style="margin:2px;" size="sm" rounded @click="onSearchClick">
            <font-awesome-icon :icon="['fas', 'search']" />&nbsp;Filter
          </b-button>
        </div>
      </b-col>
    </div>
    <div style="width:100%;overflow-y: auto;">
    <table id="table-sub">
      <thead>
        <tr>
          <th class="text-left" v-for="(row, index) in Columns" v-bind:key="index">{{row.Column}}</th>
        </tr>
      </thead>
      <tbody class="position-relative">
        <tr v-for="(row, index) in data" v-bind:key="index">
          <td class="text-left" v-for="(child, index2) in row">{{row[index2]}}</td>
        </tr>
      </tbody>
      <slot name="caption" />
    </table>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading"

export default {
  name: "DefaultGrid",
  components: {
    VueElementLoading
  },
  props: {
    caption: "",
    disableNewButton: { type:Boolean, default : false},
    actFilter: { type: Function },
    data: {
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
      blockLoader: false
    }
  },
  methods:{
    onSearchClick() {
      this.actFilter();
    },
  },
  mounted() {
    
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