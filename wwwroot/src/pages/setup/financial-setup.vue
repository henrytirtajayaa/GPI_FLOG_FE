<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Financial Setup</span>
                <small>Config</small>
                <div right style="float:right;">
                  <a href="javascript:;"
                     v-if="!form.isEdit && $store.state.roleaccess.AllowEdit"
                     @click="form.isEdit=true"
                     class="btn btn-outline-secondary">
                    <font-awesome-icon :icon="['fas', 'edit']" />&nbsp;Edit
                  </a>
                  <b-button variant="blue" type="submit" v-if="form.isEdit && $store.state.roleaccess.AllowNew">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <a href="javascript:;"
                     v-if="form.isEdit"
                     @click="onCancel"
                     class="btn btn-outline-secondary">
                    <font-awesome-icon :icon="['fas', 'times']" />&nbsp;Cancel
                  </a>
                </div>
              </div>
              <b-row class="mb-3">
                <b-col sm="4" lg="2">
                  <validation-provider name="Functional Currency Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label class="font-weight-bold">Functional Currency Code</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.FuncCurrencyCode"
                                    readonly class="font-weight-bold text-center"
                                    aria-describedby="currency-code-feedback"
                                    :state="validateState(validationContext)"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm"
                                  variant="outline-primary"
                                  @click="onModalSearchCurrency('FuncCurrencyCode')"
                                  v-if="form.isEdit && form.model.FinancialSetupId == null">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="currency-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4" lg="2">
                  <validation-provider name="Default Rate Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Default Rate Type</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.DefaultRateTypeCaption"
                                    readonly
                                    size="sm"
                                    aria-describedby="rate-type-feedback"
                                    :state="validateState(validationContext)"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  v-if="form.isEdit"
                                  size="sm"
                                  @click="onModalSearchRateType('DefaultRateType')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="rate-type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4" lg="2">
                  <validation-provider name="Tax Rate Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Tax Rate Type</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.TaxRateTypeCaption"
                                    :state="validateState(validationContext)"
                                    readonly
                                    size="sm"
                                    aria-describedby="tax-rate-type-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  size="sm"
                                  v-if="form.isEdit"
                                  @click="onModalSearchRateType('TaxRateType')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="tax-rate-type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <hr />
              <b-row>
                <b-col sm="4" lg="2">                  
                    <label>Dept. Segment No</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.DeptSegmentNo"
                                    readonly
                                    size="sm"
                                    aria-describedby="dept-segment-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="outline-primary"
                                  v-if="form.isEdit"
                                  @click="isShowAccountSegment=true"
                                  size="sm">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                        <b-button v-b-tooltip.hover title="times"
                                  variant="outline-danger"
                                  v-if="form.isEdit"
                                  @click="form.model.DeptSegmentNo=''"
                                  size="sm">
                          <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="4" lg="3">
                  <validation-provider name="Checkbook Default Charges Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Checkbook Default Charges Type</label>
                    <b-form-select v-model="form.model.CheckbookChargesType"
                                   size="sm"
                                   :state="validateState(validationContext)"
                                   :disabled="!form.isEdit"
                                   :options="listTransactionType"
                                   aria-describedby="checkbook-charges-feedback">
                    </b-form-select>
                    <b-form-invalid-feedback id="checkbook-charges-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                      <validation-provider
                        name="Container Container Unit Of Measurement"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <label>Container Unit Of Measurement</label>
                        <b-input-group prepend>
                          <b-form-input
                            size="sm"
                            v-model="form.model.UomScheduleCode"
                            class="font-weight-bold text-center"
                            :state="validateState(validationContext)"
                            readonly
                            aria-describedby="UomScheduleCode-feedback"
                          ></b-form-input>
                          <b-input-group-append v-if="form.isEdit">
                            <b-button v-if="$store.state.roleaccess.AllowEdit || $store.state.roleaccess.AllowNew"
                              variant="outline-success"
                              size="sm"
                              @click="onModalSearchUom('UomScheduleCode')"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                            </b-button>
                          </b-input-group-append>
                          <b-form-invalid-feedback
                            id="UomScheduleCode-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-input-group>
                      </validation-provider>
                    </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <!-- Modal -->
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <RateTypeModal ref="dlgRateType" :actSelectedRow="onSelectedRateType"></RateTypeModal>
    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <UomModal ref="dlgUom" :actSelectedRow="onSelectedUom"></UomModal>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowAccountSegment" hide-footer>
        <template v-slot:modal-title>
          Department Segment No
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridAccountSegment"
                      :fields="[{label: 'Segment No', key: 'SegmentNo', align: 'text-center', width:100},
                      {label: 'Description',key: 'Description'}]"
                      :items="this.$store.state.features.company.account_segment.data"
                      :info="this.$store.state.features.company.account_segment.listInfo"
                      :baseUrl="this.$store.state.features.company.account_segment.baseUrl"
                      :actGetData="handleGetAccountSegment"
                      :selectedItem="form.model.DeptSegmentNo"
                      selectedFieldName="SegmentNo"
                      :actSelectRow="handleSelectAccountSegment"
                      addTableClasses="table-bordered"
                      :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                      :isEdit="this.$store.state.roleaccess.AllowEdit"
                      :isDelete="this.$store.state.roleaccess.AllowDelete"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div>

    <!-- Modal -->
  </div>
</template>

<script>
  import VueElementLoading from "vue-element-loading";
  import SelectGrid from "@/components/tables/SelectGrid";
  import loginServices from '@/services/loginservices'
  import {
    AccountModal,
    RateTypeModal,
    CurrencyModal , UomModal
  } from "@/pages/modal/index.js";

  export default {
    name: "FinancialSetup",
    layout: "dashboard",
    components: {
      VueElementLoading,
      SelectGrid,
      AccountModal,
      RateTypeModal,
      CurrencyModal , UomModal
    },
    data() {
      return {
        caption: "Financial Setup",
        isForm: false,
        blockLoader: false,
        isShowAccountSegment: false,
        perPage: 20,
        listTransactionType: [],
        form: {
          valid: false,
          isEdit: false,
          model: {
            FinancialSetupId: null,
            FuncCurrencyCode: "",
            DefaultRateType: "",
            DefaultRateTypeCaption: "",
            TaxRateType: "",
            TaxRateTypeCaption: "",
            UomScheduleCode: "",
            DeptSegmentNo: "",
            CheckbookChargesType: "",
            Status: ""
          }
        }
      };
    },
    async mounted() {
      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.RATE_TYPE
      );

      await this.$store.dispatch(
        "features/company/account_segment/actGetAccountSegment",
        "AccountSegment?"
      );

      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );
      
      // START GET TRANSACTION TYPE
      var arrTransactionType = [];
      await this.$store.dispatch(
        "features/company/transaction_type/actGetData",
        "MSTransactionType?"
      );
      var data = this.$store.state.features.company.transaction_type.data;
      
      data.forEach(function(row){
        arrTransactionType.push({ value: row.TransactionType, text: row.TransactionType });
      });
      this.listTransactionType = arrTransactionType;
      // END GET TRANSACTION TYPE

      this.onBind();
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
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async onBind() {
        var data = this.$store.state.features.company.financial_setup.data;
        data = data[0];
        if (data != undefined) {
          this.form.model.FinancialSetupId = data.FinancialSetupId;
          this.form.model.FuncCurrencyCode = data.FuncCurrencyCode;
          this.form.model.DefaultRateType = data.DefaultRateType;
          this.form.model.TaxRateType = data.TaxRateType;
          this.form.model.DeptSegmentNo = data.DeptSegmentNo;
          this.form.model.CheckbookChargesType = data.CheckbookChargesType;
          this.form.model.UomScheduleCode = data.UomScheduleCode;
          this.form.model.Status = data.Status;

          let rateTypes = this.$store.state.features.finance.constants.data;
          rateTypes.forEach(item => {
            if (item.RateType == data.DefaultRateType) {
              this.form.model.DefaultRateTypeCaption = item.Caption;
            }
            if (item.RateType == data.TaxRateType) {
              this.form.model.TaxRateTypeCaption = item.Caption;
            }
          });
        }
      },
      async onModalSearchCurrency(row) {
        this.$refs.dlgCurrency
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedCurrency(item, modelReff) {
        this.form.model[modelReff] = item.CurrencyCode;
      },
      async onModalSearchRateType(row) {
        this.$refs.dlgRateType
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedRateType(item, modelReff) {
        this.form.model[modelReff] = item.RateType;
        this.form.model[modelReff + "Caption"] = item.Caption;
      },
      async onModalSearchAccount(row) {
        this.$refs.dlgAccount
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedCOA(item, modelReff) {
        this.form.model[modelReff] = item.AccountId;
      },
      async handleGetAccountSegment(url) {
        await this.$store.dispatch(
          "features/company/account_segment/actGetAccountSegment",
          "AccountSegment?"
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleSelectAccountSegment(row) {
        this.form.model.DeptSegmentNo = row.SegmentNo;
        this.isShowAccountSegment = false;
      },
      async onModalSearchUom(row) {
        this.$refs.dlgUom
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedUom(item, modelReff) {
        this.form.model[modelReff] = item.UomScheduleCode;
      },
      async handleSubmit() {
        this.showLoader(true);
      
        if (this.form.model.FinancialSetupId != null) {
      
          await this.$store.dispatch(
            "features/company/financial_setup/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.financial_setup
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
      
          await this.$store.dispatch(
            "features/company/financial_setup/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.financial_setup
            .resultCreate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.handleToast("Confirmation", "success", "Successfully saved");
            this.onBind();
          }
        }

        this.showLoader(false);
      },
      async onCancel() {
        this.form.isEdit = false;
        this.resetForm();
        this.onBind();

      },
      async onSubmit() {
        this.$bvModal
          .msgBoxConfirm("Save your changes ?", {
            title: "Submit Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: "Yes",
            cancelTitle: "No",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0"
          })
          .then(ok => {
            if (ok) {
              this.handleSubmit();
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    }
  };
</script>
