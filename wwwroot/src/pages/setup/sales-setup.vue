<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">
                  <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i> Setup
                </span>
                <small>Config</small>
                <div right style="float:right;">
                  <b-button
                    variant="blue"
                    type="submit"
                    v-if="$store.state.roleaccess.AllowNew"
                  >
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <div>
                <b-card class="text-left">
                  <b-row>
                    <b-col sm="3">
                      <validation-provider
                        name="Transaction Type"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <label>Transaction Type</label>
                        <b-form-select
                          name="Transaction Type"
                          v-model="form.model.TransactionType"
                          :state="validateState(validationContext)"
                          :plain="true"
                          :options="listTransactionType"
                          size="sm"
                          :disabled="form.isEdit || !$store.state.roleaccess.AllowEdit || !$store.state.roleaccess.AllowNew"
                          class="font-weight-bold"
                          style="color:black;"
                          aria-describedby="TransactionType-feedback"
                        />

                        <b-form-invalid-feedback
                          id="TransactionType-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
                            v-model="form.model.UofmScheduleCode"
                            class="font-weight-bold text-center"
                            :state="validateState(validationContext)"
                            readonly
                            aria-describedby="UofmScheduleCode-feedback"
                          ></b-form-input>
                          <b-input-group-append>
                            <b-button v-if="$store.state.roleaccess.AllowEdit || $store.state.roleaccess.AllowNew"
                              variant="outline-success"
                              size="sm"
                              @click="onModalSearchUom('UofmScheduleCode')"
                            >
                              <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                            </b-button>
                          </b-input-group-append>
                          <b-form-invalid-feedback
                            id="UofmScheduleCode-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-input-group>
                      </validation-provider>
                    </b-col>
                  </b-row>
                </b-card>
              </div>
              <div>
                <div class="mt-3">
                  <b-card-group deck>
                    <!--Quotation-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Quotation</h5>
                      </template>
                      <b-card-text>
                        <validation-provider
                          name="Quotation Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label>
                            <b>{{ form.model.TransactionType }}</b> Document No.
                          </label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.QuotationDocNo"
                              size="sm"
                              placeholder="Choose Quotation Document No"
                              readonly
                              :state="validateState(validationContext)"
                              aria-describedby="QuotationDocNo-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button v-if="$store.state.roleaccess.AllowEdit || $store.state.roleaccess.AllowNew"
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchDocNo('QuotationDocNo')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="QuotationDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-card-text>
                    </b-card>

                    <!--Sales Order-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Sales Order</h5>
                      </template>
                      <b-card-text>
                        <validation-provider
                          name="SO Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label>
                            <b>{{ form.model.TransactionType }}</b> Document No.
                          </label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.SoDocNo"
                              size="sm"
                              placeholder="Choose SO Document No"
                              readonly
                              :state="validateState(validationContext)"
                              aria-describedby="SoDocNo-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button v-if="$store.state.roleaccess.AllowEdit || $store.state.roleaccess.AllowNew"
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchDocNo('SoDocNo')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="SoDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                      </b-card-text>
                    </b-card>

                    <!--Negotiation Sheet-->
                    <b-card class="text-left" border-variant="success">
                      <template v-slot:header>
                        <h5 class="mb-0">Negotiation Sheet</h5>
                      </template>
                      <b-card-text>
                        <b-row>
                          <b-col sm="12">
                        <validation-provider
                          name="NS Document No."
                          :rules="{ required: true }"
                          v-slot="validationContext"
                        >
                          <label>
                            <b>{{ form.model.TransactionType }}</b> Document No.
                          </label>
                          <b-input-group prepend>
                            <b-form-input
                              v-model="form.model.NsDocNo"
                              size="sm"
                              :state="validateState(validationContext)"
                              placeholder="Choose NS Document No"
                              readonly
                              aria-describedby="NsDocNo-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button v-if="$store.state.roleaccess.AllowEdit || $store.state.roleaccess.AllowNew"
                                variant="outline-success"
                                size="sm"
                                @click="onModalSearchDocNo('NsDocNo')"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-form-invalid-feedback
                              id="NsDocNo-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-input-group>
                        </validation-provider>
                          </b-col>
                        </b-row>
                        <b-row class="mt-2">
                          <b-col sm="12">
                            <b-input-group >
                            <b-form-input
                              size="sm"
                              v-model="form.model.NsApprovalCode"
                              placeholder="Choose NS Approval Code"
                              readonly
                              aria-describedby="ns-approval-feedback"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-button 
                                v-b-tooltip.hover
                                title="Clear "
                                size="sm"
                                variant="outline-secondary"
                                @click="form.model.NsApprovalCode=''"
                              >
                                <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                            <b-input-group-append>
                              <b-button
                                size="sm"
                                variant="outline-success"
                                @click="isShowApproval=true"
                              >
                                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                          </b-col>  
                        </b-row>  
                      </b-card-text>
                    </b-card>
                  </b-card-group>
                  <br />
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid
            ref="gridSalesSetup"
            :fields="this.$store.state.features.company.sales_setup.headers"
            :items="this.$store.state.features.company.sales_setup.data"
            :info="this.$store.state.features.company.sales_setup.listInfo"
            :baseUrl="this.$store.state.features.company.sales_setup.baseUrl"
            :actGetData="handleGetSalesSetup"
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
            :caption="caption"
          ></DataGrid>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modal -->
    <DocNumberModal ref="dlgDocNo" :actSelectedRow="onSelectedDocNo"></DocNumberModal>
    <UomModal ref="dlgUom" :actSelectedRow="onSelectedUom"></UomModal>

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
            :selectedItem="form.model.NsApprovalCode"
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
import DataGrid from '@/components/Tables/DataGrid';
import SelectGrid from "@/components/tables/SelectGrid";
import { DocNumberModal, UomModal } from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import loginServices from "@/services/loginservices";

export default {
  name: "SalesSetup",
  layout: "dashboard",
  components: { VueElementLoading, SelectGrid, DocNumberModal, UomModal, DataGrid },
  directives: { mask },
  data() {
    return {
      caption: "Sales Setup",
      isForm: false,
      isShowApproval: false,
      blockLoader: false,
      perPage: 20,
      listTransactionType: [],
      form: {
        valid: false,
        isEdit: true,
        model: {
          SalesSetupId: null,
          TransactionType: "",
          QuotationDocNo: "",
          SoDocNo: "",
          NsDocNo: "",
          UofmScheduleCode: "",
          NsApprovalCode:"",
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
      "features/company/sales_setup/actGet",
      "SalesSetup?"
    );

    // START GET TRANSACTION TYPE
    var arrTransactionType = [];
    await this.$store.dispatch(
      "features/company/transaction_type/actGetData",
      "MSTransactionType?TrxModule=12"
    );
    var data = this.$store.state.features.company.transaction_type.data;

    data.forEach(function(row) {
      arrTransactionType.push({
        value: row.TransactionType,
        text: row.TransactionType
      });
    });
    this.listTransactionType = arrTransactionType;

    // END GET TRANSACTION TYPE

    if (this.$refs.gridSalesSetup != null) {
      await this.$refs.gridSalesSetup.doRefresh();
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
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async handleGetSalesSetup(url) {
      await this.$store.dispatch("features/company/sales_setup/actGet", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleEdit(data) {
      this.ErrorMessage = "";
      this.isForm = true;

      this.form.model.SalesSetupId = data.SalesSetupId;
      this.form.model.TransactionType = data.TransactionType;
      this.form.model.QuotationDocNo = data.QuotationDocNo;
      this.form.model.SoDocNo = data.SoDocNo;
      this.form.model.NsDocNo = data.NsDocNo;
      this.form.model.UofmScheduleCode = data.UofmScheduleCode;
      this.form.model.NsApprovalCode = data.NsApprovalCode;

      this.form.isEdit = true;
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
    async handleGetApproval(url) {
      await this.$store.dispatch(
        "features/company/approval_setup/actGetData",
        url
      );
      this.$refs.gridApproval.doRefresh();

    },
    async handleSelectApproval(row) {
      this.form.model.NsApprovalCode = row.ApprovalCode;
      this.isShowApproval = false;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
    
      this.resetForm();
    },
    async onFormCreate() {
      this.ErrorMessage = "";

      this.form.model.SalesSetupId = null;
      this.form.model.TransactionType = "";
      this.form.model.QuotationDocNo = "";
      this.form.model.SoDocNo = "";
      this.form.model.NsDocNo = "";
      this.form.model.UofmScheduleCode = "";
      this.form.model.NsApprovalCode = "";

      this.resetForm();
      this.form.isEdit = false;
      this.isForm = true;
    },
    async handleSubmit() {
      this.showLoader(true);

      if (this.form.model.SalesSetupId != null && this.form.model.SalesSetupId != '') {
        await this.$store.dispatch(
          "features/company/sales_setup/actUpdate",
          this.form.model
        );
        var response = this.$store.state.features.company.sales_setup
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

          this.$refs.gridSalesSetup.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/company/sales_setup/actCreate",
          this.form.model
        );

        var response = this.$store.state.features.company.sales_setup
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

          this.$refs.gridSalesSetup.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully saved");
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
    },
    async doDelete(row) {
      await this.$store.dispatch("features/company/sales_setup/actDelete", row);

        var response = this.$store.state.features.company.sales_setup.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridSalesSetup.doRefresh();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }
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
