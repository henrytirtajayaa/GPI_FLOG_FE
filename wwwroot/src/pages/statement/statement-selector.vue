<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />

    <b-row>
      <b-col sm="8">
        <b-form @submit.stop.prevent="handleSubmit(onSubmitCloseMonth)" >
          <b-card>
            <div slot="header">
              <!-- BEGIN HEADER -->
              <span class="font-weight-bold">Financial Statement</span>
              <small>select period of accounting</small>
              <!-- END HEADER -->
              <div right style="float:right;">
                <b-button-toolbar key-nav size="sm">
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select size="sm"
                        v-model="form.model.StatementType"
                        :options="[{value:'BS' , text:'BALANCE SHEET'},{value:'PL', text:'INCOME STATEMENT'}, {value:'CF', text:'CASH FLOW'}]"
                        plain
                        class="form-control font-weight-bold bg-success text-light"
                        aria-describedby="statement-type-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-button-toolbar>
              </div>
            </div>
            <b-row>
              <b-col sm="8">
                <b-form-group>
                  <label for="ReportType">Type of Statement</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        v-model="form.model.ReportKey"
                        size="sm"
                        :options="ReportType"
                        plain
                        value-field="ReportKey"
                        text-field="ReportName"
                        class="form-control font-weight-bold "
                        aria-describedby="report-type-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="2">
                <b-form-group>
                  <label for="PeriodMonth">Period Of</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        v-model="form.model.PeriodIndex"
                        size="sm"
                        :options="PeriodMonth"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-index-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="2">
                <b-form-group>
                  <label for="PeriodYear">Year</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        @change="onChangePeriodYear"
                        v-model="form.model.PeriodYear"
                        size="sm"
                        :options="listPeriodYear"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-year-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>              
              <b-col sm="3">
                <b-button 
                  @click="onCreateStatement" class="font-weight-bold"
                  variant="warning"
                  v-b-tooltip.hover
                  title="Open Statement"
                >
                  <i class="fa fa-star"/>&nbsp;OPEN
                </b-button>
              </b-col>
            </b-row>  
          </b-card>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>    

<script>
import VueElementLoading from "vue-element-loading";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from "../../services/loginservices";

export default {
  name: "StatementSelector",
  layout: "dashboard",
  components: {
    VueElementLoading
  },
  data() {
    return {
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowPosting: false,
        AllowVoid: false
      },
      dateFormatString: "DD/MM/YYYY",
      isTabMain: true,
      formCaption: "Financial Statement",
      blockLoader: false,
      isForm: false,
      perPage: 10,
      listStatement: [
        {StatementType : 'BS', ReportKey:'BS', ReportName : 'BALANCE SHEET', Path : '/nofpage/statement/bs'},
        {StatementType : 'BS', ReportKey:'TB', ReportName : 'TRIAL BALANCE', Path : '/nofpage/statement/tb'},
        {StatementType : 'PL', ReportKey:'PL', ReportName : 'PROFIT LOSS', Path : '/nofpage/statement/pl'},
        {StatementType : 'CF', ReportKey:'CF', ReportName : 'CASH FLOW', Path : '/nofpage/statement/cf'},
      ],
      listPeriodIndex : [],
      listPeriodYear:[],
      form: {
        valid: false,
        isEdit: false,
        model: {
          StatementType : 'BS',
          ReportKey: 'BS',
          BranchCode: '',
          PeriodYear: moment().format("YYYY"),
          PeriodIndex : 0,         
        },
      }
    };
  },
  watch: {
    "form.model.PeriodYear"(newVal) {},
    "form.model.StatementType"(newVal) {
      if(newVal=='BS'){
        this.form.model.ReportKey = 'BS'
      }else if(newVal == 'PL'){
        this.form.model.ReportKey = 'PL'
      }else if(newVal=='CF'){
        this.form.model.ReportKey = 'CF'
      }
    },
  },
  async mounted() {
    //GET CLOSING PARAMS
    await this.handleGetPeriod();

  },
  computed: {
    ReportType(){
      return this.listStatement.filter(x=>x.StatementType==this.form.model.StatementType)
    },
    PeriodMonth(){
      if(this.listPeriodIndex != undefined){
        let myPeriod = this.listPeriodIndex.filter(x=>x.PeriodYear == this.form.model.PeriodYear);
        if(myPeriod[0] != undefined){
          return myPeriod[0].PeriodIndexs;
        }else{
          return [];
        }    
      }else{
        return [];
      }        
    }
  },
  methods: {
    showLoader(val) {
      if (!val) {
        setTimeout(() => {
          this.blockLoader = false;
        }, 300);
      } else {
        this.blockLoader = val;
      }
    },
    handleToast(toastTitle, style, message) {
      this.$bvToast.toast(message, {
        title: toastTitle != "" ? toastTitle : "Confirmation",
        variant: style != "" ? style : "info",
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      });
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async handleGetPeriod(url) {
      await this.$store.dispatch(
        "features/finance/glstatement/report/actGetPeriod",
        "GetGLStatementPeriod?"
      );

      let periods = this.$store.state.features.finance.glstatement.report.periods;

      this.listPeriodYear = [], this.listPeriodIndex = [];
      if(periods != null){
        
          this.listPeriodYear = periods.ClosedYears;
          this.listPeriodIndex = periods.Periods;
          
          this.form.model.PeriodYear = periods.ClosedYears[periods.ClosedYears.length-1];  

          let myPeriod = this.listPeriodIndex.filter(x=>x.PeriodYear==this.form.model.PeriodYear);

          if(myPeriod[0] != undefined){
            this.form.model.PeriodIndex = myPeriod[0].PeriodIndexs[myPeriod[0].PeriodIndexs.length-1];        
          }
          
      }

    },
    async onChangePeriodYear() {
      
    },
    
    async onCreateStatement(){
      let report = this.listStatement.filter(x=>x.ReportKey == this.form.model.ReportKey);

      let routeData = this.$router.resolve(
      {
        path: report[0].Path, //'/nofpage/statement/tb', 
        query: {
          'PeriodIndex': this.form.model.PeriodIndex, 
          'PeriodYear' : this.form.model.PeriodYear, 
          'BranchCode' : this.form.model.BranchCode }
      });
      
      var newWindow = window.open('', '_blank');
      newWindow.location.assign(routeData.href);
    },
    
  }
};
</script>

<style scoped>
#table-category thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-category tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-category tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-layout thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-layout tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-layout tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}
</style>