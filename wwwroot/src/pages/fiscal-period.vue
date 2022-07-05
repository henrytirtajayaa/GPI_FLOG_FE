<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Fiscal Period</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']" v-if="isSave" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Period"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Period">Period</label>
                      <b-form-input name="Period"
                                    type="number"
                                    placeholder="Period"
                                    v-model="form.model.PeriodYear"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="Period-feedback"
                                    @input="onPeriodYearChanged"
                                    :readonly="form.isEdit"
                                    class="text-bold text-center" />
                      <b-form-invalid-feedback id="Period-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="1">
                  <b-form-group>
                    <label for="Months">Months</label>
                    <b-form-input name="Months"
                                  type="text"
                                  placeholder="Months"
                                  v-model="form.model.TotalPeriod"
                                  size="sm"
                                  class="text-center"
                                  readonly />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="StartDate"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="StartDate">Start Date</label>
                      <b-form-input name="StartDate"
                                    type="date"
                                    placeholder="StartDate"
                                    v-model="form.model.StartDate"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    class="text-center"
                                    aria-describedby="StartDate-feedback"
                                    @input="handleGetEndDate"
                                    @change="onDateStartChanged"
                                    :readonly="form.isEdit" />
                      <b-form-invalid-feedback id="StartDate-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="EndDate"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="EndDate">End Date</label>
                      <b-form-input name="EndDate"
                                    type="date"
                                    placeholder="EndDate"
                                    v-model="form.model.EndDate"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="EndDate-feedback"
                                    :readonly="form.isEdit"
                                    class="text-center" />
                      <b-form-invalid-feedback id="EndDate-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <b-alert show :value="true"
                           :variant="form.model.ClosingYear ? 'warning' : 'success'">
                    <font-awesome-icon :icon="['fas', 'exclamation']" />&nbsp; {{form.model.ClosingYear ? 'PERIOD ALREADY CLOSED' : 'PERIOD ENTRY STILL OPEN'}}
                  </b-alert>
                </b-col>
              </b-row>
              <b-row>
                <div id="table-responsive">
                <table id="table-sub">
                  <thead>
                  <th class="text-sm-center">Year</th>
                  <th class="text-sm-center">Period</th>
                  <th class="text-sm-center">Start Date</th>
                  <th class="text-sm-center">End Date</th>
                  <th class="text-sm-center">Purchasing</th>
                  <th class="text-sm-center">Sales</th>
                  <th class="text-sm-center">Inventory</th>
                  <th class="text-sm-center">Financial</th>
                  <th class="text-sm-center">Fixed Asset</th>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in detail">
                      <td>
                        {{item.year}}
                      </td>
                      <td>
                        {{item.PeriodIndex}}
                      </td>
                      <td>
                        {{item.PeriodStartCaption}}
                      </td>
                      <td>
                        {{item.PeriodEndCaption}}
                      </td>
                      <td>
                        <input type="checkbox"
                               class="text-center"
                               v-model="item.IsClosePurchasing"
                               :disabled="form.model.FiscalHeaderId==null"
                               style="margin-top:5px;" />
                      </td>
                      <td>
                        <input type="checkbox"
                               class="text-center"
                               v-model="item.IsCloseSales"
                               :disabled="form.model.FiscalHeaderId==null"
                               style="margin-top:5px;" />
                      </td>
                      <td>
                        <input type="checkbox"
                               class="text-center"
                               v-model="item.IsCloseInventory"
                               :disabled="form.model.FiscalHeaderId==null"
                               style="margin-top:5px;" />
                      </td>
                      <td>
                        <input type="checkbox"
                               class="text-center"
                               v-model="item.IsCloseFinancial"
                               :disabled="form.model.FiscalHeaderId==null"
                               style="margin-top:5px;" />
                      </td>
                      <td>
                        <input type="checkbox"
                               class="text-center"
                               v-model="item.IsCloseAsset"
                               :disabled="form.model.FiscalHeaderId==null"
                               style="margin-top:5px;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12">
        <b-card>
          <DataGrid ref="gridFiscalPeriod"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.fiscal_header.data"
                    :info="this.$store.state.features.company.fiscal_header.listInfo"
                    :baseUrl="this.$store.state.features.company.fiscal_header.baseUrl"
                    :actGetData="handleGetFiscalPeriod"
                    :actCreate="onFormCreate"
                    :actEditRow="handleEdit"
                    :actDeleteRow="handleDelete"
                    addTableClasses="table-bordered"
                    :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                    :isEdit="this.$store.state.roleaccess.AllowEdit"
                    :isDelete="this.$store.state.roleaccess.AllowDelete"
                    responsive
                    items-per-page-select
                    loading
                    hover
                    sorter
                    pagination
                    column-filter
                    :caption="caption"></DataGrid>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import VueElementLoading from 'vue-element-loading'
  import moment from "moment";
  import config from "../static/config";
  import loginServices from '../services/loginservices'

  export default {
    name: 'FiscalPeriod',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        caption: 'Fiscal Period',
        blockLoader: false,
        isForm: false,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            label: 'Period',
            key: 'PeriodYear',
            _classes: 'text-center',
            width: '200px',
            filter_number: true,
          },
          {
            label: 'Months',
            key: 'TotalPeriod',
            _classes: 'text-center',
            width: '150px',
            filter: false,
          },
          {
            label: 'Start Date',
            key: 'StartDate',
            _classes: 'text-center',
            filter_date: true,
            width: '100px;'
          },
          {
            label: 'End Date',
            key: 'EndDate',
            _classes: 'text-center',
            filter_date: true,
            width: '100px;'
          },
          {
            label: 'Closed Year',
            key: 'ClosingYear',
            _classes: 'text-center',
            filter_select: true,
            width: '120px;',
            filter_select_options: [
              { key: false, value: 'OPEN' },
              { key: true, value: 'CLOSED' }
            ]
          },
        ],
        alert: '',
        ErrorMessage: '',
        CurrentPeriodYear: moment().format("YYYY"),
        FiscalHeaderId: "",
        showFiscalDetail: false,
        menu: false,
        ListRefAccount: [],
        alert: "",
        ErrorMessage: "",
        isShowAccount: false,
        selectfield: "",
        AllPurchasing: null,
        AllSales: null,
        AllFinancial: null,
        AllFixedAsset: null,
        AllInventory: null,
        detail: [],
        paginationDetail: {
          rowsPerPage: -1
        },
        form: {
          valid: false,
          isEdit: false,
          isShow: false,
          display: {
            EndDate: ""
          },
          model: {
            FiscalHeaderId: null,
            PeriodYear: "",
            TotalPeriod: 12,
            StartDate: new Date().toISOString().substr(0, 10),
            EndDate: "",
            ClosingYear: false,
            FiscalDetails: []
          },
        }
      }
    },
     computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridFiscalPeriod != null) {
        await this.$refs.gridFiscalPeriod.doRefresh()
      }
    },
    methods: {
      async handleGetEndDate() {
        this.form.model.EndDate = this.handleNextDate(
          this.form.model.StartDate,
          this.form.model.TotalPeriod,
          "value"
        );

        this.form.display.EndDate = config.FORMAT.formatDate(
          this.form.model.EndDate
        );
      },
      async onDateStartChanged() {
        this.handleShowDetail();
      },
      async handleShowDetail() {
        this.showFiscalDetail = true;

        this.handleFiscalDetails();
      },
      async onPeriodYearChanged() {
        if (this.form.isShow) {
          this.form.model.StartDate = moment(
            this.form.model.PeriodYear + "-01-01", 'YYYY-MM-DD'
          ).format("YYYY-MM-DD");
          this.form.model.EndDate = moment(
            this.form.model.PeriodYear + "-12-31", 'YYYY-MM-DD'
          ).format("YYYY-MM-DD");
          this.form.display.EndDate = moment(
            this.form.model.PeriodYear + "-12-31", 'YYYY-MM-DD'
          ).format("DD-MM-YYYY");
          this.form.model.FiscalDetails = [];

          this.handleFiscalDetails();
        }
      },
      handleNextDate(startdate, period, type) {
        this.menu = false;
        var lastDays = null;
        var day = moment(String(startdate)).format("DD");
        if (day == "01") {
          lastDays = moment(startdate).add(period - 1, "months");
          lastDays = moment(lastDays).endOf("month");
        } else {
          lastDays = moment(startdate).add(period, "months");
          lastDays = moment(lastDays).add(-1, "days");
        }
        if (type == "value") {
          return moment(String(lastDays)).format("YYYY-MM-DD");
        } else {
          return moment(String(lastDays)).format("DD-MM-YYYY");
        }
      },
      showLoader(val) {
        if (!val) {
          setTimeout(() => {
            this.blockLoader = false;
          }, 500);
        } else {
          this.blockLoader = val;
        }
      },
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: (toastTitle != '' ? toastTitle : 'Confirmation'),
          variant: (style != '' ? style : 'info'),
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetFiscalPeriod(url) {
        await this.$store.dispatch('features/company/fiscal_header/actGetFiscalHeader', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        var arrPeriod = []
        this.$store.state.features.company.fiscal_header.data.forEach(function (row, index) {
          arrPeriod.push(parseInt(row.PeriodYear))
        })
        var maxPeriod = Math.max(...arrPeriod)
        this.ErrorMessage = ''
        this.form.isShow = true;
        this.showFiscalDetail = true;
        this.form.model.FiscalHeaderId = null;
        if (arrPeriod.length == 0) {
          this.form.model.PeriodYear = moment().format("YYYY")
        } else {
          this.form.model.PeriodYear = maxPeriod + 1;
        }
        this.form.model.TotalPeriod = 12;
        this.form.model.StartDate = moment(
          this.form.model.PeriodYear + "-01-01"
        ).format("YYYY-MM-DD");
        this.form.model.EndDate = moment(
          this.form.model.PeriodYear + "-12-31"
        ).format("YYYY-MM-DD");
        this.form.display.EndDate = moment(
          this.form.model.PeriodYear + "-12-31"
        ).format("DD-MM-YYYY");
        this.form.model.ClosingYear = false;
        this.form.model.FiscalDetails = [];

        this.handleFiscalDetails();
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
      },
      async handleFiscalDetails() {
        var response = null;
        var detailData = this.$store.state.features.company.fiscal_detail.data;
        var initialDate = this.form.model.StartDate;
        var arrDetail = [];
        this.detail = [];
        if (this.form.isEdit == true && detailData.length > 0) {
          detailData.forEach(function (row, index) {
            var data = {
              FiscalDetailId: row.FiscalDetailId,
              FiscalHeaderId: row.FiscalHeaderId,
              year: moment(String(row.PeriodStart)).format("YYYY"),
              PeriodIndex: row.PeriodIndex,
              PeriodStart: row.PeriodStart,
              PeriodStartCaption: moment(String(row.PeriodStart)).format(
                "DD-MM-YYYY"
              ),
              PeriodEnd: row.PeriodEnd,
              PeriodEndCaption: moment(String(row.PeriodEnd)).format(
                "DD-MM-YYYY"
              ),
              IsClosePurchasing: row.IsClosePurchasing,
              IsCloseSales: row.IsCloseSales,
              IsCloseInventory: row.IsCloseInventory,
              IsCloseFinancial: row.IsCloseFinancial,
              IsCloseAsset: row.IsCloseAsset
            };
            arrDetail.push(data);
          });
        } else {
          for (var i = 1; i <= this.form.model.TotalPeriod; i++) {
            var data = {
              FiscalDetailId: "00000000-0000-0000-0000-000000000000",
              FiscalHeaderId:
                response != null ? response.data.FiscalHeaderId : "",
              year: moment(String(initialDate)).format("YYYY"),
              PeriodIndex: i,
              PeriodStart: moment(String(initialDate)).format("YYYY-MM-DD"),
              PeriodStartCaption: moment(String(initialDate)).format(
                "DD-MM-YYYY"
              ),
              PeriodEnd: this.handleNextDate(initialDate, 1, "value"),
              PeriodEndCaption: this.handleNextDate(initialDate, 1),
              IsClosePurchasing: false,
              IsCloseSales: false,
              IsCloseInventory: false,
              IsCloseFinancial: false,
              IsCloseAsset: false
            };
            arrDetail.push(data);
            initialDate = moment(initialDate).add(1, "months");
          }
        }
        this.detail = arrDetail;
      },
      async handleStatus(e) {
        if (this.form.model.InActive) {
          this.$bvModal.msgBoxConfirm('Are you sure?')
            .then(value => {
              if (value) {
                this.form.model.InActive = value;
              }
            })
            .catch(err => {
              // An error occurred
            })
        }
      },
      async handleEdit(row) {
        this.ErrorMessage = '';
        this.showFiscalDetail = true;
        this.form.model.FiscalHeaderId = row.FiscalHeaderId;
        this.form.model.PeriodYear = row.PeriodYear;
        this.form.model.TotalPeriod = row.TotalPeriod;
        this.form.model.StartDate = moment(String(row.StartDate)).format(
          "YYYY-MM-DD"
        );

        this.form.model.EndDate = row.EndDate
        this.form.display.EndDate = row.EndDate;
        this.form.model.ClosingYear = (row.ClosingYear == 'OPEN' ? false : true);
        this.form.model.FiscalDetails = [];

        await this.$store.dispatch(
          "features/company/fiscal_detail/actGetFiscalDetail",
          this.form.model
        );

        this.form.isEdit = true;
        this.isForm = true
        this.handleFiscalDetails();
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        })
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/fiscal_header/actDeleteFiscalHeader",
          row
        );

        var response = this.$store.state.features.company.fiscal_header.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridFiscalPeriod.doRefresh();
          this.resetForm();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal.msgBoxConfirm('Are you sure?', {
          title: 'Delete Confirmation', size: 'sm', buttonSize: 'sm',
          okVariant: 'blue', centered: true,
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
        })
          .then(ok => {
            if (ok) {
              this.doDelete(row);
            }
          })
          .catch(err => {
            // An error occurred
          })
      },
      async onSubmit() {
        this.showLoader(true);
        this.form.model.FiscalDetails = this.detail
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/fiscal_header/actUpdateFiscalHeader",
            this.form.model
          );
          var response = this.$store.state.features.company.fiscal_header
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridFiscalPeriod.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/fiscal_header/actCreateFiscalHeader",
            this.form.model
          );

          var response = this.$store.state.features.company.fiscal_header.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridFiscalPeriod.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>

<style scoped>
#table-responsive{
  width:100%;
  overflow-x:auto;
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
      text-align: center !important;
      height: 20px !important;
    }

    #table-sub td {
      border: 1px solid rgb(165,165,165);
      padding: 1px !important;
      font-size: 12px;
      text-transform: uppercase;
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

    #table-sub tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    #table-sub tr:hover {
      background-color: #ddd;
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

  @media only screen and (max-width: 1024px) {
    #table-sub th {
      border: 1px solid #ddd;
      padding: 5px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center !important;
      height: 20px !important;
    }

    #table-sub td {
      border: 1px solid rgb(165,165,165);
      padding: 1px !important;
      font-size: 10px;
      text-transform: uppercase;
      text-align: center;
      height: 20px !important;
    }

    #table-sub .v-input {
      font-size: 12px !important;
    }

    #table-sub td .v-text-field {
      font-size: 10px !important;
      padding: 5px 5px;
      margin-top: 1px;
    }
  }
</style>
