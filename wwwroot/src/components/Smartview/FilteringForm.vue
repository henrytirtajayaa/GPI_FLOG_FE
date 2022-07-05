<template>
  <div>
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <div class="row">
      <b-col md="8" style="vertical-align:bottom;">
        <span class="table-title">Filter {{caption}}</span>
      </b-col>
      <b-col md="4">
        <div class="form-inline justify-content-sm-end" v-if="!disableNewButton">
          <b-button variant="" style="margin:2px;" size="sm" rounded @click="onCloseClick()">
            <font-awesome-icon :icon="['fas', 'window-close']" />&nbsp;Back
          </b-button>
        </div>
      </b-col>
    </div>
    <div left style="float:left;"  class="mb-1">
      <b-input-group prepend>
        <b-form-select id="Field"
            name="Field"
            size="sm"
            :plain="true"
            :options="Columns"
            v-model="form.model.Field"
         />
        &nbsp;
        <b-form-select id="Field"
            name="Field"
            size="sm"
            :plain="true"
            :options="[{value:'Between',text:'Between'},{value:'Contains',text:'Contains'}]"
            v-model="form.model.Filter"
         />
        &nbsp;
        <b-form-input size="sm" placeholder="Parameter 1"
            v-model="form.model.Param1">
        </b-form-input>
        &nbsp;
        <b-form-input size="sm" placeholder="Parameter 2"
            v-model="form.model.Param2" v-if="form.model.Filter=='Between'">
        </b-form-input>
        &nbsp;
        <b-button variant="outline-secondary"
                  v-b-tooltip.hover
                  title="Add Filter Criteria" size="sm"
                  @click="handleAdd">
                  <font-awesome-icon :icon="['fas', 'plus']" />
        </b-button>
        &nbsp;
        <b-button variant="outline-secondary"
                  v-b-tooltip.hover
                  title="Reset" size="sm"
                  @click="handleReset">
                  <font-awesome-icon :icon="['fas', 'times']" />
        </b-button>
      </b-input-group>
    </div>
    <div left style="float:left;"  class="mb-1 ml-3" >
      <b-input-group prepend>
        <b-button variant="blue" size="sm" rounded @click="onFilterClick()"
         v-b-tooltip.hover  title="Run the following criteria(s)" >
            <font-awesome-icon :icon="['fas', 'search']" />&nbsp;GO
          </b-button>
      </b-input-group>
    </div>
    <table id="table-sub">
      <thead>
        <tr>
          <th class="text-center" style="vertical-align: middle;">
           <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
          </th>
          <th class="text-left">FIELD NAME</th>
          <th class="text-left" width="200px"></th>
          <th class="text-left">PARAMETER 1</th>
          <th class="text-left">PARAMETER 2</th>
        </tr>
      </thead>
      <tbody class="position-relative">
        <tr v-for="(row, index) in form.List">
          <td>
              <b-button
              variant="outline-danger"
              pill @click="Delete(index)"
              size="sm">
              <font-awesome-icon :icon="['fas', 'trash']"
               />
              </b-button>
          </td>
          <td>{{row.Field}}</td>
          <td>{{row.Filter}}</td>
          <td>{{row.Param1}}</td>
          <td>{{row.Param2}}</td>
        </tr>
      </tbody>
      <slot name="caption" />
    </table>
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
    actFormClose: { type: Function },
    actFormFilter: { type: Function },
    Columns: {
      type: Array,
      default: () => []
    },
    SmartviewId: ''
  },
  data() {
    return {
      blockLoader: false,
      form:{
        List: Array(),
        model:{
          Field: '',
          filter: 'Contains',
          Param1: '',
          Param2: ''
        }
      }
    }
  },
  methods:{
    handleReset(){
      this.form.List = []
    },
    onCloseClick() {
      this.actFormClose();
    },
    async Delete(index) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?", {
            title: "Delete Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "blue",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0"
          })
          .then(ok => {
            if (ok) {
              this.form.List.splice(index, 1);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
    async onFilterClick(){
        var model = {
          SmartviewId: this.SmartviewId,
          Filter: this.form.List
        }
        await this.$store.dispatch(
          "features/report/smart_view/actGetResultSmartview",
          model
        );
        var resultData = this.$store.state.features.report.smart_view.resultSmartview.Smartviews
        this.actFormFilter(resultData);
    },
    async handleAdd(){
      this.form.List.push({Field: this.form.model.Field, Filter: this.form.model.Filter, Param1: this.form.model.Param1, Param2: this.form.model.Param2})
      this.resetForm()
    },
    resetForm(){
      this.form.model.Field = ''
      this.form.model.Filter = 'Contains'
      this.form.model.Param1 = ''
      this.form.model.Param2 = ''
    }
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