<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Payable Setup</span>
                <small>Config</small>
                <div right style="float:right;">
                  <a
                    href="javascript:;"
                    v-if="!form.isEdit && $store.state.roleaccess.AllowEdit"
                    @click="form.isEdit=true"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />&nbsp;Edit
                  </a>
                  <b-button variant="blue" type="submit" v-if="form.isEdit && $store.state.roleaccess.AllowEdit">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <a
                    href="javascript:;"
                    v-if="form.isEdit"
                    @click="onCancel"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />&nbsp;Cancel
                  </a>
                </div>
              </div>

              <b-row class="mt-3">
                <b-col sm="12">
                  <b-row>
                    <b-col sm="3">
                      <b-form-group>
                        <label for="Aging By Doc Date">Aging Calculation By:</label>
                        <b-form-select
                          size="sm"
                          id="status"
                          name="Aging By Doc Date"
                          :disabled="!form.isEdit"
                          v-model="form.model.AgingByDocdate"
                          :plain="true"
                          :options="[
                                    {
                                        value: true, 
                                        text: 'Document Date'
                                    },
                                    {
                                        value: false,
                                        text: 'Due Date'
                                    }
                                ]"
                        />
                      </b-form-group>
                    </b-col>
                    <b-col sm="3">
                      <validation-provider
                        name="Default Rate Type"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <label>Default Rate Type</label>
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.DefaultRateTypeCaption"
                            readonly
                            size="sm"
                            aria-describedby="rate-type-feedback"
                            :state="validateState(validationContext)"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button
                              variant="outline-primary"
                              v-if="form.isEdit"
                              size="sm"
                              @click="onModalSearchRateType('DefaultRateType')"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                            </b-button>
                          </b-input-group-append>
                          <b-form-invalid-feedback
                            id="rate-type-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-input-group>
                      </validation-provider>
                      <br />
                    </b-col>
                    <b-col sm="3">
                      <validation-provider
                        name="Tax Rate Type"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <label>Tax Rate Type</label>
                        <b-input-group prepend>
                          <b-form-input
                            v-model="form.model.TaxRateTypeCaption"
                            :state="validateState(validationContext)"
                            readonly
                            size="sm"
                            aria-describedby="tax-rate-type-feedback"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button
                              variant="outline-primary"
                              size="sm"
                              v-if="form.isEdit"
                              @click="onModalSearchRateType('TaxRateType')"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                            </b-button>
                          </b-input-group-append>
                          <b-form-invalid-feedback
                            id="tax-rate-type-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-input-group>
                      </validation-provider>
                      <br />
                    </b-col>
                    <b-col sm="3">
                        <label for="Write Off Limit">Write Off Limit</label>
                        <b-input-group>
                        <template>
                          <money
                            v-model="form.model.WriteoffLimit"
                            :disabled="!form.isEdit"
                            v-bind="moneyOptions"
                            size="sm"
                            class="currency-money-field"
                          ></money>
                        </template>
                      </b-input-group>
                    </b-col>
                    
                  </b-row>
                </b-col>
                
              </b-row>
              
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <!-- Modal -->
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <DocNumberModal ref="dlgDocNo" :actSelectedRow="onSelectedDocNo"></DocNumberModal>
    <RateTypeModal ref="dlgRateType" :actSelectedRow="onSelectedRateType"></RateTypeModal>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowApproval" hide-footer size="lg">
        <template v-slot:modal-title>Select Approval</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridApproval"
            :fields="[{label: 'Approval Code', key: 'ApprovalCode', align: 'text-center'},
                      {label: 'Description', key: 'Description'}]"
            :items="this.$store.state.features.company.approval_setup.data"
            :info="this.$store.state.features.company.approval_setup.listInfo"
            :baseUrl="this.$store.state.features.company.approval_setup.baseUrl"
            :actGetData="handleGetApproval"
            :selectedItem="form.model.ApprovalCode"
            selectedFieldName="ApprovalCode"
            :actSelectRow="handleSelectApproval"
            addTableClasses="table-bordered"
            responsive
            loading
            hover
            sorter
            pagination
            column-filter
            :itemsPerPage="perPage"
          ></SelectGrid>
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
  DocNumberModal,
  RateTypeModal
} from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";

export default {
  name: "PayableSetup",
  layout: "dashboard",
  components: {
    VueElementLoading,
    SelectGrid,
    AccountModal,
    DocNumberModal,
    RateTypeModal
  },
  directives: {
    mask
  },
  data() {
    return {
      caption: "Payable Setup",
      isForm: false,
      blockLoader: false,
      isShowApproval: false,
      perPage: 20,
      moneyOptions: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        decimalLength: 2,
        masked: false,
        allowBlank: false,
        min: 0
        //max: Number.MAX_SAFE_INTEGER
      },
      form: {
        valid: false,
        isEdit: false,
        model: {
          PayableSetupId: null,
          DefaultRateType: "",
          DefaultRateTypeCaption: "",
          TaxRateType: "",
          TaxRateTypeCaption: "",
          AgingByDocdate: "",
          WriteoffLimit: "",
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
      "features/company/approval_setup/actGetData",
      "ApprovalSetup?"
    );

    await this.$store.dispatch(
      "features/company/payable_setup/actGet",
      "PayableSetup?"
    );

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
      var data = this.$store.state.features.company.payable_setup.data;
      data = data[0];
      if (data != undefined) {
        this.form.model.PayableSetupId = data.PayableSetupId;
        this.form.model.DefaultRateType = data.DefaultRateType;
        this.form.model.TaxRateType = data.TaxRateType;
        this.form.model.AgingByDocdate = data.AgingByDocdate;
        this.form.model.WriteoffLimit = data.WriteoffLimit;

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
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
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
    async onModalSearchDocNo(row) {
      this.$refs.dlgDocNo
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedDocNo(item, modelReff) {
      this.form.model[modelReff] = item.DocumentId;
    },

    async handleGetApproval(url) {
      await this.$store.dispatch(
        "features/company/approval_setup/actGetData",
        url
      );
      this.$refs.gridApproval.doRefresh();

    },
    async handleSelectApproval(row) {
      this.form.model.ApprovalCode = row.ApprovalCode;
      this.isShowApproval = false;
    },

    async handleSubmit() {
      this.showLoader(true);

      if (this.form.model.PayableSetupId != null) {
        await this.$store.dispatch(
          "features/company/payable_setup/actUpdate",
          this.form.model
        );
        var response = this.$store.state.features.company.payable_setup
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
          this.resetForm();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/company/payable_setup/actCreate",
          this.form.model
        );

        var response = this.$store.state.features.company.payable_setup
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
          this.resetForm();

          this.handleToast("Confirmation", "success", "Successfully saved");
          this.onBind();
        }
      }

      this.showLoader(false);
    },
    
    async onCancel() {
      this.form.isEdit = false;
      this.resetForm();
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

<style scoped>
.writeofflimit {
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}
</style>
