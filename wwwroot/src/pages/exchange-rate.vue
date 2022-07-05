<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Exchange Rate</span>
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
                <b-col sm="4" lg="2">
                  <validation-provider
                    name="ExchangeRate"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="ExchangeRateCode">Exchange Rate Code</label>
                      <b-form-input
                        name="ExchangeRateCode"
                        type="text"
                        placeholder="Exchange Rate Code"
                        v-model="form.model.ExchangeRateCode"
                        size="sm"
                        :state="validateState(validationContext)"
                        aria-describedby="ExchangeRateCode-feedback"
                        :readonly="form.isEdit"
                      />
                      <b-form-invalid-feedback
                        id="ExchangeRateCode-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider
                    name="Description"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="ExchangeRateCode">Description</label>
                      <b-form-input
                        name="Description"
                        type="text"
                        placeholder="Description"
                        v-model="form.model.Description"
                        size="sm"
                        :state="validateState(validationContext)"
                        aria-describedby="Description-feedback"
                      />
                      <b-form-invalid-feedback
                        id="Description-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3" lg="2">
                  <validation-provider
                    name="Currency Code"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="CurrencyCode">Currency Code</label>
                      <b-form-select
                        id="CurrencyCode"
                        name="CurrencyCode"
                        size="sm"
                        v-model="form.model.CurrencyCode"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="listCurrencyCode"
                        :disabled="form.isEdit"
                        aria-describedby="CurrencyCode-feedback"
                      />
                      <b-form-invalid-feedback
                        id="CurrencyCode-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3" lg="2">
                  <validation-provider
                    name="Rate Type"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="RateType">Rate Type</label>
                      <b-form-select
                        id="RateType"
                        name="RateType"
                        size="sm"
                        v-model="form.model.RateType"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="listRateType"
                        :disabled="form.isEdit"
                        aria-describedby="RateType-feedback"
                      />
                      <b-form-invalid-feedback
                        id="RateType-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3" lg="2">
                  <validation-provider
                    name="Expired Period"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="ExpiredPeriod">Expired Period</label>
                      <b-form-select
                        id="ExpiredPeriod"
                        name="ExpiredPeriod"
                        size="sm"
                        v-model="form.model.ExpiredPeriod"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="listExpiredPeriod"
                        aria-describedby="ExpiredPeriod-feedback"
                        @change="handleGetExpiredDate()"
                      />
                      <b-form-invalid-feedback
                        id="ExpiredPeriod-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3" lg="2">
                  <validation-provider
                    name="Calculation Type"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="CalculationType">Calculation Type</label>
                      <b-form-select
                        id="CalculationType"
                        name="CalculationType"
                        size="sm"
                        v-model="form.model.CalculationType"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="listCalculationType"
                        :disabled="form.isEdit"
                        aria-describedby="CalculationType-feedback"
                      />
                      <b-form-invalid-feedback
                        id="CalculationType-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-card>
                <div slot="header">
                  <b-row>
                    <b-col sm="3">
                      <validation-provider name="Date" v-slot="validationContext">
                        <b-form-group>
                          <label for="Date">Date</label>
                          <b-form-input
                            name="Date"
                            type="date"
                            placeholder="Date"
                            v-model="formDetail.model.RateDate"
                            size="sm"
                            :state="validateState(validationContext)"
                            aria-describedby="Date-feedback"
                            @change="handleGetExpiredDate()"
                          />
                          <b-form-invalid-feedback
                            id="Date-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col sm="3">
                      <validation-provider name="Expired Date" v-slot="validationContext">
                        <b-form-group>
                          <label for="ExpiredDate">Expired Date</label>
                          <b-form-input
                            name="ExpiredDate"
                            type="date"
                            placeholder="ExpiredDate"
                            v-model="formDetail.model.ExpiredDate"
                            size="sm"
                            :state="validateState(validationContext)"
                            aria-describedby="ExpiredDate-feedback"
                          />
                          <b-form-invalid-feedback
                            id="ExpiredDate-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col sm="2">
                      <validation-provider name="Rate" v-slot="validationContext">
                        <b-form-group>
                          <label for="Rate">Rate</label>
                          <money
                            v-model="formDetail.model.RateAmount"
                            v-bind="moneyOptions"
                            size="sm"
                            class="currency-money-field"
                          ></money>
                          <b-form-invalid-feedback
                            id="Rate-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col></b-col>
                    <b-col sm="3" lg="3">
                      <b-form-group>
                        <b-button
                          style="margin-top:30px;"
                          variant="success"
                          @click="onAddClick()"
                          size="sm"
                        >
                          <font-awesome-icon :icon="['fas', 'plus-square']" danger />&nbsp;Add To Sequence
                        </b-button>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>
                <b-row>
                  <table id="table-sub">
                    <thead>
                      <th class="text-sm-center" width="8%"></th>
                      <th class="text-sm-center">Date</th>
                      <th class="text-sm-center">Expired Date</th>
                      <th class="text-sm-center">Rate</th>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in itemDetails" v-bind:key="index">
                        <td>
                          <b-button-group>
                            <b-button size="sm" @click="deleteRateDetail(index)">
                              <font-awesome-icon :icon="['fas', 'trash']" style="color:red;" />
                            </b-button>
                            <b-button size="sm" @click="handleEditDetail(index)">
                              <font-awesome-icon :icon="['fas', 'edit']" />
                            </b-button>
                          </b-button-group>
                        </td>
                        <td>{{item.RateDate}}</td>
                        <td>{{item.ExpiredDate}}</td>
                        <td>{{item.RateAmount}}</td>
                      </tr>
                    </tbody>
                  </table>
                </b-row>
              </b-card>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid
            ref="gridExchangeRate"
            :fields="headerFields"
            :items="this.$store.state.features.company.exchange_rate_header.data"
            :info="this.$store.state.features.company.exchange_rate_header.listInfo"
            :baseUrl="this.$store.state.features.company.exchange_rate_header.baseUrl"
            :actGetData="handleGetExchangeRate"
            :actCreate="onFormCreate"
            :actEditRow="handleEdit"
            :actDeleteRow="handleDelete"
            addTableClasses="table-bordered"
            :disableNewButton="!this.$store.state.roleaccess.AllowNew || !showCreateNewButton"
            :isEdit="this.$store.state.roleaccess.AllowEdit"
            :isDelete="this.$store.state.roleaccess.AllowDelete"
            responsive
            items-per-page-select
            loading
            hover
            sorter
            pagination
            column-filter
            :caption="caption"
          ></DataGrid>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import DataGrid from "@/components/Tables/DataGrid";
import VueElementLoading from "vue-element-loading";
import config from "../static/config";
import moment from "moment";
import loginServices from "../services/loginservices";

export default {
  name: "Company",
  layout: "dashboard",
  components: {
    DataGrid,
    VueElementLoading
  },
  data: () => {
    return {
      caption: "Exchange Rate",
      blockLoader: false,
      isForm: false,
      listCurrencyCode: [],
      listRateType: [],
      listExpiredPeriod: [],
      listCalculationType: [],
      itemDetails: [],
      //DataGrid HEADERS Declarations, you can
      headerFields: [
        {
          key: "ExchangeRateCode",
          label: "Exchange Code",
          classes: "text-center",
          width: 150
        },
        {
          key: "Description",
          label: "Description"
        },
        {
          key: "CurrencyCode",
          label: "Currency",
          width: 120
        },
        {
          key: "ExpiredPeriod",
          label: "Expired Period",
          _classes: "text-center",
          width: 150,
          filter_select: true,
          filter_select_options: [
            { key: "DAILY", value: "DAILY" },
            { key: "WEEKLY", value: "WEEKLY" },
            { key: "MONTHLY", value: "MONTHLY" }
          ]
        }
      ],
      moneyOptions: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        decimalLength: 2,
        masked: false,
        allowBlank: false,
        min: 0
      },
      alert: "",
      ErrorMessage: "",
      formDetail: {
        model: {
          ExchangeRateDetailId: null,
          RateDate: "",
          ExpiredDate: "",
          RateAmount: ""
        }
      },
      FunctionalCurrency: "",
      showCreateNewButton: true,
      form: {
        valid: false,
        isEdit: false,
        model: {
          ExchangeRateHeaderId: null,
          ExchangeRateCode: "",
          Description: "",
          CurrencyCode: "",
          RateType: "",
          ExpiredPeriod: "",
          CalculationType: "",
          Status: "",
          ExchangeRateDetails: []
        }
      }
    };
  },
  async mounted() {
    await this.$store.dispatch(
      "features/company/financial_setup/actGet",
      "FinancialSetup?"
    );

    if (this.$refs.gridExchangeRate != null) {
      await this.$refs.gridExchangeRate.doRefresh();
    }
    await this.populateRef();
  },
  computed: {
    isSave() {
      return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
    }
  },
  methods: {
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
        title: toastTitle != "" ? toastTitle : "Confirmation",
        variant: style != "" ? style : "info",
        //toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: false
      });
    },
    async handleGetExchangeRate(url) {
      await this.$store.dispatch(
        "features/company/exchange_rate_header/actGetData",
        url
      );
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    async onFormCreate() {
      this.ErrorMessage = "";
      this.form.model.ExchangeRateHeaderId = null;
      this.form.model.ExchangeRateCode = "";
      this.form.model.Description = "";
      this.form.model.CurrencyCode = "";
      this.form.model.RateType = "";
      this.form.model.ExpiredPeriod = "";
      this.form.model.CalculationType = "";
      this.form.model.Status = 1;
      this.itemDetails = [];
      this.resetForm();
      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );
      var FinancialSetup = this.$store.state.features.company.financial_setup
        .listInfo;
      if (FinancialSetup.Count > 0) {
        this.form.isEdit = false;
        this.isForm = true;
      } else {
        this.handleToast(
          "Confirmation",
          "danger",
          "Please Input Financial Setup"
        );
      }
    },
    async handleStatus(e) {
      if (this.form.model.InActive) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?")
          .then(value => {
            if (value) {
              this.form.model.InActive = value;
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    },
    async handleEdit(row) {
      this.ErrorMessage = "";
      this.isForm = true;
      this.form.model.ExchangeRateHeaderId = row.ExchangeRateHeaderId;
      this.form.model.ExchangeRateCode = row.ExchangeRateCode;
      this.form.model.Description = row.Description;
      this.form.model.CurrencyCode = row.CurrencyCode;
      this.form.model.RateType = row.RateType;
      this.form.model.ExpiredPeriod = row.ExpiredPeriod;
      this.form.model.CalculationType = row.CalculationType;
      this.form.model.Status = row.Status;

      var ExchangeDetail = await this.$store.dispatch(
        "features/company/exchange_rate_detail/actGetData",
        this.form.model
      );
      if (ExchangeDetail.status == 200) {
        var arr = [];
        ExchangeDetail.data.GetExchangeRateDetail.forEach(function(row, index) {
          arr.push({
            ExchangeRateDetailId: row.ExchangeRateDetailId,
            ExchangeRateHeaderId: row.ExchangeRateHeaderId,
            RateDate: row.RateDate,
            ExpiredDate: row.ExpiredDate,
            RateAmount: new Intl.NumberFormat("de-DE", {
              minimumFractionDigits: 2
            }).format(row.RateAmount),
            RateAmountValue: row.RateAmount,
            Status: row.status
          });
        });
        this.itemDetails = arr;
      }
      this.form.isEdit = true;
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async handleGetExpiredDate() {
      var ExpiredDate = null;

      if (this.form.model.ExpiredPeriod != "") {
        if (this.formDetail.model.RateDate != undefined) {
          if (this.form.model.ExpiredPeriod == "DAILY") {
            ExpiredDate = moment(
              this.formDetail.model.RateDate
            ).add(1, 'days');
          } else if (this.form.model.ExpiredPeriod == "WEEKLY") {
            ExpiredDate = moment(
              this.formDetail.model.RateDate
            ).add(7, "days");
          } else if (this.form.model.ExpiredPeriod == "MONTHLY") {
            ExpiredDate = moment(
              this.formDetail.model.RateDate,
              "yyyy-MM-dd"
            ).add(30, "days");
          } else if (this.form.model.ExpiredPeriod == "YEARLY") {
            ExpiredDate = moment(
              this.formDetail.model.RateDate,
              "yyyy-MM-dd"
            ).add(365, "days");
          }
          this.formDetail.model.ExpiredDate = moment(
            String(ExpiredDate)
          ).format("YYYY-MM-DD");
          console.log(ExpiredDate);
        }
      }
    },
    async onAddClick() {
      if (
        this.formDetail.model.RateDate == "" ||
        this.formDetail.model.ExpiredDate == "" ||
        this.formDetail.model.RateAmount <= 0
      ) {
        this.handleToast(
          "Confirmation",
          "danger",
          "Date must not empty and Rate must not 0."
        );
      } else {
        if (this.formDetail.model.arrRow != null) {
          this.itemDetails[
            this.formDetail.model.arrRow
          ].RateDate = config.FORMAT.formatDate(this.formDetail.model.RateDate);
          this.itemDetails[
            this.formDetail.model.arrRow
          ].ExpiredDate = config.FORMAT.formatDate(
            this.formDetail.model.ExpiredDate
          );
          this.itemDetails[
            this.formDetail.model.arrRow
          ].RateAmount = new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2
          }).format(this.formDetail.model.RateAmount);
          this.itemDetails[
            this.formDetail.model.arrRow
          ].RateAmountValue = this.formDetail.model.RateAmount;
        } else {
          this.itemDetails.push({
            RateDate: config.FORMAT.formatDate(this.formDetail.model.RateDate),
            ExpiredDate: config.FORMAT.formatDate(
              this.formDetail.model.ExpiredDate
            ),
            RateAmount: new Intl.NumberFormat("de-DE", {
              minimumFractionDigits: 2
            }).format(this.formDetail.model.RateAmount),
            RateAmountValue: this.formDetail.model.RateAmount
          });
        }
        this.formDetail.model.arrRow = null;
        this.formDetail.model.RateAmount = "0,00";
        this.formDetail.model.RateDate = "";
        this.formDetail.model.ExpiredDate = "";
      }
    },
    async deleteRateDetail(index) {
      this.$bvModal
        .msgBoxConfirm("Remove this rate ?", {
          title: "Delete Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-1 border-bottom-0",
          footerClass: "p-1 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.itemDetails.splice(index, 1);

            this.formDetail.model.arrRow = null;
            this.formDetail.model.RateAmount = "0,00";
            this.formDetail.model.RateDate = "";
            this.formDetail.model.ExpiredDate = "";
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async handleEditDetail(index) {
      this.formDetail.model.arrRow = index;
      this.formDetail.model.ExchangeRateDetailId = this.itemDetails[
        index
      ].ExchangeRateDetailId;
      this.formDetail.model.RateDate = config.FORMAT.formatDate(
        this.itemDetails[index].RateDate
      );
      this.formDetail.model.RateAmount = this.itemDetails[index].RateAmount;
      this.formDetail.model.ExpiredDate = config.FORMAT.formatDate(
        this.itemDetails[index].ExpiredDate
      );
    },
    async handleDeleteDetail(row) {
      var okToDelete = false;
      this.$swal
        .fire({
          title: "Remove this level ?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          confirmButtonColor: "#d33",
          cancelButtonColor: "grey",
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            //Do remove row
            this.itemDetails.splice(row, 1);

            this.itemDetails = this.itemDetails.sort(function(a, b) {
              return a[0] - b[0];
            });

            //Reorder array index
            let indexNo = 1;
            for (var i = 0; i < this.itemDetails.length; i++) {
              this.itemDetails[i]["Index"] = i;
              this.itemDetails[i]["Level"] = indexNo;
              indexNo++;
            }
          }
        });
    },
    async validateForm() {
      let valid = true;

      if (this.itemDetails.length < 1) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Exchange rate details can not empty !"
        );
      }

      return valid;
    },
    async onSubmit() {
      if (await this.validateForm()) {
        this.showLoader(true);
        var arr = [];
        this.itemDetails.forEach(function(row, index) {
          arr.push({
            ExchangeRateDetailId: row.ExchangeRateDetailId,
            ExchangeRateHeaderId: row.ExchangeRateHeaderId,
            RateDate: config.FORMAT.formatDate2(row.RateDate),
            ExpiredDate: config.FORMAT.formatDate2(row.ExpiredDate),
            RateAmount: row.RateAmountValue,
            Status: 1
          });
        });

        this.form.model.ExchangeRateDetails = arr;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.exchange_rate_header
            .resultUpdate;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.IsRowForm = false;
            this.isForm = false;
            this.ErrorMessage = "";
            this.handleToast("Confirmation", "success", "Successfully updated");

            this.$refs.gridExchangeRate.doRefresh();
            this.isForm = false;
          }
        } else {
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actCreate",
            this.form.model
          );
          var response = this.$store.state.features.company.exchange_rate_header
            .resultCreate;
          if (response.status != 200) {
            this.isForm = false;
            this.IsRowForm = false;
            this.ErrorMessage = response.data.ErrorDescription;
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.IsRowForm = false;
            this.ErrorMessage = "";
            this.handleToast("Confirmation", "success", "Successfully saved");

            this.$refs.gridExchangeRate.doRefresh();
            this.isForm = false;
          }
        }

        this.showLoader(false);
      }
    },
    async populateRef() {
      //LOAD FINANCIAL SETUP
      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );

      var financialSetup = this.$store.state.features.company.financial_setup
        .data;

      if (Array.isArray(financialSetup) && financialSetup.length) {
        if (financialSetup != undefined) {
          financialSetup = financialSetup[0];

          this.FunctionalCurrency = financialSetup.FuncCurrencyCode;
        }
      } else {
        this.FunctionalCurrency = "";
      }

      let functionalCurrency = this.FunctionalCurrency;

      //IF FUNCTIONAL CURRENCY NOT SET, THEN DISABLE new button
      if (this.FunctionalCurrency == "") this.showCreateNewButton = false;

      var arrRate = [];
      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.RATE_TYPE
      );
      this.$store.state.features.finance.constants.data.forEach(function(
        row,
        index
      ) {
        arrRate.push({ value: row.RateType, text: row.Caption });
      });
      this.listRateType = arrRate;

      var arrCurrency = [];
      await this.$store.dispatch(
        "features/company/currency/actGetCurrency",
        null
      );
      this.$store.state.features.company.currency.data.forEach(function(
        row,
        index
      ) {
        if (
          row.CurrencyCode != functionalCurrency &&
          functionalCurrency != ""
        ) {
          arrCurrency.push({ value: row.CurrencyCode, text: row.CurrencyCode });
        }
      });
      this.listCurrencyCode = arrCurrency;

      this.listExpiredPeriod = ["DAILY", "WEEKLY", "MONTHLY"];

      var arrCalc = [];
      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.CALC_METHOD
      );
      this.$store.state.features.finance.constants.data.forEach(function(
        row,
        index
      ) {
        arrCalc.push({ value: row.CalcMethod, text: row.Caption });
      });
      this.listCalculationType = arrCalc;
    },
    async doDelete(row) {
      await this.$store.dispatch(
        "features/company/exchange_rate_header/actDelete",
        row
      );

      var response = this.$store.state.features.company.exchange_rate_header
        .resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.$refs.gridExchangeRate.doRefresh();

        this.handleToast("Confirmation", "success", "Successfully deleted");
      }
    },
    async handleDelete(row) {
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
            this.doDelete(row);
          }
        })
        .catch(err => {
          // An error occurred
        });
    }
  }
};
</script>

<style scoped>
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
  border: 1px solid rgb(165, 165, 165);
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
</style>
