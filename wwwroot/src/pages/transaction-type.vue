<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Transaction Type</span>
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
                <b-col sm="3" >
                  <validation-provider name="TransactionType"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="TransactionType">Transaction Type</label>
                      <b-form-input name="TransactionType"
                                    type="text"
                                    placeholder="Transaction Type"
                                    v-model="form.model.TransactionType"
                                    size="sm"
                                    :disabled="form.isEdit"
                                    :state="validateState(validationContext)"
                                    aria-describedby="TransactionType-feedback" />
                      <b-form-invalid-feedback id="TransactionType-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="8" lg="5">
                  <validation-provider name="TransactionName"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="TransactionName">Transaction Name</label>
                      <b-form-input name="TransactionName"
                                    type="text"
                                    placeholder="Transaction Name"
                                    v-model="form.model.TransactionName"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="TransactionName-feedback" />
                      <b-form-invalid-feedback id="TransactionName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row class="mt-3">  
                <b-col sm="6" lg="3">
                  <label>Payment Condition</label>
                  <b-form-select v-model="form.model.PaymentCondition" size="sm">
                    <b-form-select-option value="0">NONE</b-form-select-option>
                    <b-form-select-option value="1">PREPAID</b-form-select-option>
                    <b-form-select-option value="2">COLLECT</b-form-select-option>
                  </b-form-select>
                </b-col>
                <b-col sm="6" lg="3">
                  <label>Required Subject</label>
                  <b-form-select v-model="form.model.RequiredSubject" size="sm">
                    <b-form-select-option value="0">NONE</b-form-select-option>
                    <b-form-select-option value="1">SHIPPER</b-form-select-option>
                    <b-form-select-option value="2">CONSIGNEE</b-form-select-option>
                  </b-form-select>
                </b-col>
              </b-row>
              
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12" lg="8">
        <b-card width="100%">
          <DataGrid ref="gridTransactionType"
                    :fields="this.$store.state.features.company.transaction_type.headers"
                    :items="this.$store.state.features.company.transaction_type.data"
                    :info="this.$store.state.features.company.transaction_type.listInfo"
                    :baseUrl="this.$store.state.features.company.transaction_type.baseUrl"
                    :actGetData="handleGetTransactionType"
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
  import VueElementLoading from 'vue-element-loading';
  import config from "../static/config";
  import moment from "moment";
  import loginServices from '../services/loginservices';
  import util from "@/helper/utils";

  export default {
    name: 'Transaction Type',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        caption: 'Transaction Type',
        blockLoader: false,
        isForm: false,
        alert: '',
        ErrorMessage: '',
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          model: {
            TransactionTypeId: null,
            TransactionType: '',
            TransactionName: '',
            PaymentCondition: 0,
            RequiredSubject: 0,
            InActive: false
          },
        }
      }
    },
    async created(){
      
      
    },
    async mounted() {
      if (this.$refs.gridTransactionType != null) {
        await this.$refs.gridTransactionType.doRefresh()
      }

      this.form.PersonId = this.$store.state.user;
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
          title: (toastTitle != '' ? toastTitle : 'Confirmation'),
          variant: (style != '' ? style : 'info'),
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetTransactionType(url) {
        await this.$store.dispatch('features/company/transaction_type/actGetData', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.TransactionTypeId = null;
        this.form.model.TransactionType = "";
        this.form.model.TransactionName = "";
        this.form.model.PaymentCondition = 0;
        this.form.model.RequiredSubject = 0;
        this.form.model.InActive = false;

        this.resetForm();
        this.form.isEdit = false;
        this.isForm = true;
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
        this.isForm = true;
        this.form.model.TransactionTypeId = row.TransactionTypeId;
        this.form.model.TransactionType = row.TransactionType;
        this.form.model.TransactionName = row.TransactionName;
        this.form.model.PaymentCondition = row.PaymentCondition;
        this.form.model.RequiredSubject = row.RequiredSubject;
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
      
      async onSubmit() {
        this.showLoader(true);
        
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/transaction_type/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.transaction_type
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.ErrorMessage = "";
            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.$refs.gridTransactionType.doRefresh();
          }
        } else {
          await this.$store.dispatch(
            "features/company/transaction_type/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.transaction_type
            .resultCreate;
          if (response.status != 200) {
            this.isForm = false;
            this.ErrorMessage = response.data.ErrorDescription;
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.ErrorMessage = "";
            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.$refs.gridTransactionType.doRefresh();
            this.isForm = false;
          }
        }

        this.showLoader(false);
      },

      async doDelete(row) {
      await this.$store.dispatch("features/company/transaction_type/actDelete", row);

        var response = this.$store.state.features.company.transaction_type.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridTransactionType.doRefresh();

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
  }
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
</style>
