<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Checkbook</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit" v-if="isSave">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Checkbook Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Checkbook Code">Checkbook Code</label>
                      <b-form-input size="sm"
                                    name="Checkbook Code"
                                    type="text"
                                    placeholder="Checkbook Code"
                                    v-model="form.model.CheckbookCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="checkbook-code-feedback"
                                    :readonly="form.isEdit" />
                      <b-form-invalid-feedback id="checkbook-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="5">
                  <validation-provider name="Checkbook Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Checkbook Name">Checkbook Name</label>
                      <b-form-input size="sm"
                                    name="Checkbook Name"
                                    type="text"
                                    placeholder="Checkbook Name"
                                    v-model="form.model.CheckbookName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="checkbook-name-feedback" />
                      <b-form-invalid-feedback id="checkbook-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="5">
                    <b-form-group>
                      <label for="BankAccountCode">Bank Account No.</label>
                      <b-form-input size="sm"
                                    name="Bank Account No."
                                    type="text"
                                    placeholder="Bank Account No."
                                    v-model="form.model.BankAccountCode"
                                    aria-describedby="bank-account-no-feedback" />
                    </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="4">
                  <validation-provider name="Currency Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Currency Code</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.CurrencyCode"
                                    placeholder="Currency"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="currency-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" v-if="!form.isEdit" variant="outline-primary" @click="onModalSearchCurrency('CurrencyCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="currency-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="Bank Code"
                                       v-slot="validationContext">
                    <label>Bank</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.BankCode"
                                    placeholder="Choose Bank"
                                    readonly
                                    aria-describedby="bank-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="onModalSearchBank('BankCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                                <b-button variant="outline-danger" size="sm" v-if="form.model.BankCode" @click="deleteBank()">
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="bank-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                    </validation-provider>
                </b-col>

                <b-col sm="4">
                    <label>Branch</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.BankName"
                                    readonly
                                    aria-describedby="bank-name-feedback"></b-form-input>
                    </b-input-group>
                </b-col>
              </b-row><br>

              <b-card>
                <b-row>
                  <b-col sm="4">
                    <validation-provider name="Checkbook Account No"
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Checkbook Account No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.CheckbookAccountNo"
                                      placeholder="Choose Checkbook Account Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="account-number-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchAccount('CheckbookAccountNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="account-number-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>

                  <b-col sm="4">
                    <validation-provider name="Checkbook In Document No."
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Checkbook In Document No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.CheckbookInDocNo"
                                      placeholder="Choose Checkbook In Document Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="checkbook-in-doc-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchDocNo('CheckbookInDocNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="checkbook-in-doc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>

                  <b-col sm="4">
                    <validation-provider name="Checkbook Out Document No."
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Checkbook Out Document No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.CheckbookOutDocNo"
                                      placeholder="Choose Checkbook Out Document Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="checkbook-out-doc-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchDocNo('CheckbookOutDocNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="checkbook-out-doc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>
                </b-row>
              </b-card>

              <b-card>
                <b-row>
                  <b-col sm="4">
                    <validation-provider name="Receipt Document No."
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Receipt Document No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.ReceiptDocNo"
                                      placeholder="Choose Receipt Document Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="receipt-doc-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchDocNo('ReceiptDocNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="receipt-doc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>

                  <b-col sm="4">
                    <validation-provider name="Payment Document No."
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Payment Document No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.PaymentDocNo"
                                      placeholder="Choose Payment Document Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="payment-doc-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchDocNo('PaymentDocNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="payment-doc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>

                  <b-col sm="4">
                    <validation-provider name="Reconciliation Document No."
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <label>Reconciliation Document No.</label>
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.ReconcileDocNo"
                                      placeholder="Choose Reconciliation Document Number"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="reconcile-doc-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary"
                                    @click="onModalSearchDocNo('ReconcileDocNo')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="reconcile-doc-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </b-col>
                </b-row>
              </b-card>

              <b-row>
                <b-col sm="4">
                  <b-form-checkbox v-model="form.model.HasCheckoutApproval"
                                   @click.native="form.model.ApprovalCode=null">
                    Checkbook Approval Code
                  </b-form-checkbox>

                  <div v-if="form.model.HasCheckoutApproval">
                    <validation-provider name="Approval Code"
                                         :rules="{ required: true }"
                                         v-slot="validationContext">
                      <!-- <label>Approval Code</label> -->
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="form.model.ApprovalCode"
                                      placeholder="Choose Approval Code"
                                      readonly
                                      :state="validateState(validationContext)"
                                      aria-describedby="approval-feedback"></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" variant="outline-primary" @click="onModalSearchApproval('ApprovalCode')">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                        <b-form-invalid-feedback id="approval-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-input-group>
                    </validation-provider>
                  </div>
                </b-col>
                <b-col sm="4" lg="3">
                  <label class="font-weight-bold">
                    Is this
                    <code>CASH</code>&nbsp;?
                  </label>
                  <b-form-group size="sm">
                    <b-form-checkbox v-model="form.model.IsCash" style="float:left">YES</b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row><br>

              <b-row>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Status">Status</label>
                    <b-form-select size="sm"
                                   id="status"
                                   name="Status"
                                   v-model="form.model.InActive"
                                   :plain="true"
                                   :options="[
                            {
                                value: false,
                                text: 'Active'
                            },
                            {
                                value: true,
                                text: 'Inactive'
                            }
                        ]" />
                  </b-form-group>
                </b-col>
              </b-row>

            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridCheckbook"
                    :fields="this.$store.state.features.company.checkbook.headers"
                    :items="this.$store.state.features.company.checkbook.data"
                    :info="this.$store.state.features.company.checkbook.listInfo"
                    :baseUrl="this.$store.state.features.company.checkbook.baseUrl"
                    :actGetData="handleGetCheckbook"
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

    <!-- == MODAL == -->
    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <DocNumberModal ref="dlgDocNo" :actSelectedRow="onSelectedDocNo"></DocNumberModal>
    <BankModal ref="dlgBank" :actSelectedRow="onSelectedBank"></BankModal>
    <ApprovalModal ref="dlgApproval" :actSelectedRow="onSelectedApproval"></ApprovalModal>
  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
  import { CurrencyModal, AccountModal, DocNumberModal, BankModal, ApprovalModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'

  export default {
    name: 'Checkbook',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid,
      CurrencyModal,
      AccountModal,
      DocNumberModal,
      BankModal,
      ApprovalModal
    },
    data: () => {
      return {
        caption: 'Checkbooks',
        isForm: false,
        isShowBank: false,
        isShowApproval: false,
        perPage: 10,
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            CheckbookId: null,
            CheckbookCode: '',
            CheckbookName: '',
            BankAccountCode: '',
            CurrencyCode: '',
            BankCode: '',
            BankName: '',
            CheckbookAccountNo: '',
            CheckbookInDocNo: '',
            CheckbookOutDocNo: '',
            ReceiptDocNo: '',
            PaymentDocNo: '',
            ReconcileDocNo: '',
            HasCheckoutApproval: true,
            IsCash: false,
            ApprovalCode: '',
            InActive: false
          },
        }
      }
    },
    async mounted() {

      await this.$store.dispatch(
        "features/company/checkbook/actGetCheckbook",
        "Checkbook?"
      );

      await this.$store.dispatch(
        "features/company/bank/actGetBank",
        "Bank?&InActive=false"
      );

      await this.$store.dispatch(
        "features/company/approval_setup/actGetData",
        "ApprovalSetup?"
      );

      if (this.$refs.gridCheckbook != null) {
        await this.$refs.gridCheckbook.doRefresh()
      }
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async deleteBank(){
        this.form.model.BankCode = ''
        this.form.model.BankName = ''
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

      async handleGetCheckbook(url) {
        await this.$store.dispatch('features/company/checkbook/actGetCheckbook', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
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

      async onModalSearchBank(row) {
        this.$refs.dlgBank
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedBank(item, modelReff) {
        this.form.model[modelReff] = item.BankCode;
        this.form.model['BankName'] = item.BankName;
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

      async onModalSearchApproval(row) {
        this.$refs.dlgApproval
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedApproval(item, modelReff) {
        this.form.model[modelReff] = item.ApprovalCode;
      },

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.CheckbookId = null
        this.form.model.CheckbookCode = ''
        this.form.model.CheckbookName = ''
        this.form.model.BankAccountCode = ''
        this.form.model.CurrencyCode = ''
        this.form.model.BankCode = ''
        this.form.model.BankName = ''
        this.form.model.CheckbookAccountNo = ''
        this.form.model.CheckbookInDocNo = ''
        this.form.model.CheckbookOutDocNo = ''
        this.form.model.ReceiptDocNo = ''
        this.form.model.PaymentDocNo = ''
        this.form.model.ReconcileDocNo = ''
        this.form.model.HasCheckoutApproval = true
        this.form.model.IsCash = false,
        this.form.model.ApprovalCode = ''
        this.form.model.InActive = false
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
      },
      async handleStatus(e) {
        if (this.form.model.Inactive) {
          this.$bvModal.msgBoxConfirm('Are you sure?')
            .then(value => {
              if (value) {
                this.form.model.Inactive = value;
              }
            })
            .catch(err => {
              // An error occurred
            })
        }
      },
      async handleEdit(row) {
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.CheckbookId = row.CheckbookId;
        this.form.model.CheckbookCode = row.CheckbookCode;
        this.form.model.CheckbookName = row.CheckbookName;
        this.form.model.BankAccountCode = row.BankAccountCode;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.BankCode = row.BankCode;
        this.form.model.BankName = row.BankName;
        this.form.model.CheckbookAccountNo = row.CheckbookAccountNo;
        this.form.model.CheckbookInDocNo = row.CheckbookInDocNo;
        this.form.model.CheckbookOutDocNo = row.CheckbookOutDocNo;
        this.form.model.ReceiptDocNo = row.ReceiptDocNo;
        this.form.model.PaymentDocNo = row.PaymentDocNo;
        this.form.model.ReconcileDocNo = row.ReconcileDocNo;
        this.form.model.HasCheckoutApproval = row.HasCheckoutApproval;
        this.form.model.IsCash = row.IsCash;
        this.form.model.ApprovalCode = row.ApprovalCode;
        this.form.model.InActive = row.InActive;
        this.form.isEdit = true;
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
        await this.$store.dispatch(
          "features/company/checkbook/actDeleteCheckbook",
          row
        );

        var response = this.$store.state.features.company.checkbook.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCheckbook.doRefresh();

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
      async onSubmit() {
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/checkbook/actUpdateCheckbook",
            this.form.model
          );
          var response = this.$store.state.features.company.checkbook
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCheckbook.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/checkbook/actCreateCheckbook",
            this.form.model
          );

          var response = this.$store.state.features.company.checkbook.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridCheckbook.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
