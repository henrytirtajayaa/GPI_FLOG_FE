<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />

    <b-row>
      <b-col sm="6">
        <b-form @submit.stop.prevent="handleSubmit(onSubmitCloseMonth)" v-if="isCloseMonth">
          <b-card>
            <div slot="header">
              <!-- BEGIN HEADER -->
              <span class="font-weight-bold">Close Period</span>
              <small>summarize all chart of account balance</small>
              <!-- END HEADER -->
              <div right style="float:right;">
                <b-button-toolbar key-nav size="sm">
                  <b-button-group size="sm" class="mx-1">
                    <b-button variant="outline-danger" @click="switchMode">
                      <i
                        class="fa fa-toggle-on"
                        variant="green"
                        v-b-tooltip.hover
                        title="Unclose Period"
                      />&nbsp;
                      <span class="text-uppercase">Unclose mode</span>
                    </b-button>
                  </b-button-group>
                </b-button-toolbar>
              </div>
            </div>
            <b-row>
              <b-col sm="3">
                <b-form-group>
                  <label for="PeriodMonth">Period Of</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        :disabled="!actionButton.AllowEdit"
                        v-model="form.model.PeriodIndex"
                        size="sm"
                        :options="listClosePeriodIndex"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-index-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="3">
                <b-form-group>
                  <label for="PeriodYear">Year</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        @change="onChangePeriodYear"
                        :disabled="!actionButton.AllowEdit"
                        v-model="form.model.PeriodYear"
                        size="sm"
                        :options="listClosePeriodYear"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-year-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-button v-if="this.listClosePeriodYear != undefined && this.listClosePeriodIndex != undefined"
                  class="mt-4" pill
                  @click="onSubmitCloseMonth"
                  variant="primary"
                  v-b-tooltip.hover
                  title="Submit Close Period"
                >
                  <font-awesome-icon :icon="['fas', 'key']" />&nbsp;Submit Close Period
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-form>

        <b-form @submit.stop.prevent="handleSubmit(onSubmitUnCloseMonth)" v-if="!isCloseMonth">
          <b-card pill class="bg-light">
            <div slot="header">
              <!-- BEGIN HEADER -->
              <span class="font-weight-bold">Unclose Period</span>
              <small>reopen input for following period</small>
              <!-- END HEADER -->
              <div right style="float:right;">
                <b-button-toolbar key-nav size="sm">
                  <b-button-group size="sm" class="mx-1">
                    <b-button variant="outline-primary" @click="switchMode">
                      <i class="fa fa-toggle-off" v-b-tooltip.hover title="Close Period" />&nbsp;
                      <span class="text-uppercase">Close mode</span>
                    </b-button>
                  </b-button-group>
                </b-button-toolbar>
              </div>
            </div>
            <b-row>
              <b-col sm="3">
                <b-form-group>
                  <label for="PeriodMonth">Period Of</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        :disabled="!actionButton.AllowEdit"
                        v-model="form.model.PeriodIndex"
                        size="sm"
                        :options="listUnclosePeriodIndex"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-index-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="3">
                <b-form-group>
                  <label for="PeriodYear">Year</label>
                  <b-input-group prepend>
                    <b-input-group>
                      <b-form-select
                        :disabled="!actionButton.AllowEdit"
                        v-model="form.model.PeriodYear"
                        size="sm"
                        :options="listUnclosePeriodYear"
                        plain
                        class="form-control font-weight-bold"
                        aria-describedby="period-year-feedback"
                      ></b-form-select>
                    </b-input-group>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-button pill
                  class="mt-4" v-if="this.listUnclosePeriodYear != undefined && this.listUnclosePeriodIndex != undefined"
                  @click="onSubmitUncloseMonth"
                  variant="danger"
                  v-b-tooltip.hover
                  title="Submit UnClose Period"
                >
                  <font-awesome-icon :icon="['fas', 'unlock']" />&nbsp;Submit Unclose Period
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
  name: "StatementClosePeriod",
  layout: "dashboard",
  components: {
    VueElementLoading
  },
  data() {
    return {
      isCloseMonth:true,
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowPosting: false,
        AllowVoid: false
      },
      tabularStep: 0,
      minCalendarDate: moment().format("YYYY-01-01"),
      maxCalendarDate: moment()
        .endOf("month")
        .format("YYYY-MM-DD"),
      dateFormatString: "DD/MM/YYYY",
      isTabMain: true,
      formCaption: "Close Period",
      blockLoader: false,
      isForm: false,
      perPage: 10,
      listClosePeriodYear: [],
      listClosePeriodIndex: [],
      listUnclosePeriodYear: [],
      listUnclosePeriodIndex: [],
      form: {
        valid: false,
        isEdit: false,
        model: {
          CurrencyCode : '',
          PeriodYear: 2020,
          PeriodIndex : 0,
          AccountId : '',          
        },
      }
    };
  },
  watch: {
    "form.model.PeriodYear"(newVal) {},
  },
  async mounted() {
    //GET CLOSING PARAMS
    await this.handleGetPeriod();

  },
  computed: {
    
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
    async switchMode(){
      if(this.isCloseMonth){
        if(this.listUnclosePeriodYear != undefined && this.listUnclosePeriodIndex != undefined){
            this.form.model.PeriodYear = this.listUnclosePeriodYear[0].value;            
            this.form.model.PeriodIndex = this.listUnclosePeriodIndex[this.listUnclosePeriodIndex.length-1];
        }     

        this.isCloseMonth = false;
      }else{
        if(this.listClosePeriodYear != undefined && this.listClosePeriodIndex != undefined){
            this.form.model.PeriodYear = this.listClosePeriodYear[0].value;            
            this.form.model.PeriodIndex = this.listClosePeriodIndex[0];
        }
        this.isCloseMonth = true;
      }
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async handleGetPeriod(url) {
      await this.$store.dispatch(
        "features/finance/glclosing/period/actGetData",
        "GetClosingPeriod?"
      );

      let periods = this.$store.state.features.finance.glclosing.period.data;

      this.listClosePeriodYear = [], this.listClosePeriodIndex = [];
      if(periods != null){
          this.listClosePeriodYear.push({value:periods.PeriodYear, text:periods.PeriodYear});
          this.listClosePeriodIndex = periods.PeriodIndexs;
          
          if(this.isCloseMonth){
            this.form.model.PeriodYear = periods.PeriodYear;            
            this.form.model.PeriodIndex = periods.PeriodIndexs[0];
          }
      }else{
          if(this.isCloseMonth){
            this.form.model.PeriodYear = 0;            
            this.form.model.PeriodIndex = 0;
          }
      }

      await this.$store.dispatch(
        "features/finance/glclosing/period/actGetUnclosePeriod",
        "GetUnclosingPeriod?"
      );

      let unperiods = this.$store.state.features.finance.glclosing.period.dataUnclose;
    
      this.listUnclosePeriodYear = [], this.listUnclosePeriodIndex = [];
      if(unperiods != null){
          this.listUnclosePeriodYear.push({value:unperiods.PeriodYear, text:unperiods.PeriodYear});          
          this.listUnclosePeriodIndex = unperiods.PeriodIndexs;

          if(!this.isCloseMonth){
            this.form.model.PeriodYear = unperiods.PeriodYear;            
            this.form.model.PeriodIndex = unperiods.PeriodIndexs[this.listUnclosePeriodIndex.length-1];
          }
      }else{
          
          if(!this.isCloseMonth){
            this.form.model.PeriodYear = 0;            
            this.form.model.PeriodIndex = 0;
          }
      }

      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async onChangePeriodYear() {
      
    },
    
    async onFormClose() {
      this.ErrorMessage = "";
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      this.form.model.CurrencyCode = '';
      this.form.model.PeriodYear = 2020;
      this.form.model.PeriodIndex = 0;
      this.form.model.AccountId = "";

      this.actionButton.AllowSave = true;
      this.actionButton.AllowEdit = true;
      this.actionButton.AllowPosting = false;
      this.actionButton.AllowVoid = false;

      this.$nextTick(() => {
        //this.$refs.observerCtg.reset();
      });
    },

    async onSubmitCloseMonth(){
        this.$bvModal
          .msgBoxConfirm("Close Period Of " + this.form.model.PeriodIndex + "/" + this.form.model.PeriodYear + " ?", {
            title: "Close Period Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: 'YES',
            cancelTitle: 'NO',
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false,
          })
          .then(ok => {
            if (ok) {
              this.doSubmitCloseMonth();
            }
          })
          .catch(err => {
            // An error occurred
          });
    },
    async doSubmitCloseMonth() {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/glclosing/period/actSubmitClose",
        this.form.model
        );
        var response = this.$store.state.features.finance.glclosing.period
            .resultCreate;

        if (response.status != 200) {
            this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Update failed !"
            );
        } else {
            await this.handleGetPeriod();

            this.handleToast("Confirmation", "success", response.data.Message);
        }

      this.showLoader(false);
    },
    
    async onSubmitUncloseMonth(){
        this.$bvModal
          .msgBoxConfirm("Un-Close Period Of " + this.form.model.PeriodIndex + "/" + this.form.model.PeriodYear + " ?", {
            title: "Unclose Period Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: 'YES',
            cancelTitle: 'NO',
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false,
          })
          .then(ok => {
            if (ok) {
              this.doSubmitUnCloseMonth();
            }
          })
          .catch(err => {
            // An error occurred
          });
    },
    async doSubmitUnCloseMonth() {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/glclosing/period/actSubmitUnclose",
        this.form.model
        );
        var response = this.$store.state.features.finance.glclosing.period
            .resultCreate;

        if (response.status != 200) {
            this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Update failed !"
            );
            
        } else {
            await this.handleGetPeriod();

            this.handleToast("Confirmation", "success", response.data.Message);
        }

      this.showLoader(false);
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