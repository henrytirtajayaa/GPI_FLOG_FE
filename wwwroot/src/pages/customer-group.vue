<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Customer Group</span>
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
                  <validation-provider name="Customer Group Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="GroupCode">Customer Group Code</label>
                      <b-form-input name="GroupCode"
                                    type="text"
                                    placeholder="Group Code"
                                    v-model="form.model.CustomerGroupCode"
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="group-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="group-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="6">
                  <validation-provider name="Customer Group Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="GroupName">Customer Group Name</label>
                      <b-form-input name="GroupName"
                                    type="text"
                                    placeholder="Group name"
                                    v-model="form.model.CustomerGroupName"
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="group-name-feedback" />
                      <b-form-invalid-feedback id="group-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                    <label>Payment Term</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.PaymentTermCode"
                                    readonly
                                    size="sm"
                                    aria-describedby="account3-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm"
                                  variant="outline-primary"
                                  @click="onModalSearchPaymentTerm('PaymentTermCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Receivable Account No</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.ReceivableAccountNo"
                                    readonly
                                    size="sm"
                                    aria-describedby="account1-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm"
                                  variant="outline-primary"
                                  @click="onModalSearchAccount('ReceivableAccountNo')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Accrued Receivable Account No</label>
                    <b-input-group prepend>
                      <b-form-input v-model="form.model.AccruedReceivableAccountNo"
                                    size="sm"
                                    readonly
                                    aria-describedby="account2-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm"
                                  variant="outline-primary"
                                  @click="onModalSearchAccount('AccruedReceivableAccountNo')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Status"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select id="status"
                                     name="Status"
                                     v-model="form.model.Inactive"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     size="sm"
                                     :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                                     aria-describedby="status-feedback" />
                      <b-form-invalid-feedback id="status-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
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
          <DataGrid ref="gridMain"
                    :fields="this.$store.state.features.company.customer_group.headers"
                    :items="this.$store.state.features.company.customer_group.data"
                    :info="this.$store.state.features.company.customer_group.listInfo"
                    :baseUrl="this.$store.state.features.company.customer_group.baseUrl"
                    :actGetData="handleGet"
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

    <!-- Modal -->
    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <PaymentTermModal ref="dlgPaymentTerm" :actSelectedRow="onSelectedPaymentTerm"></PaymentTermModal>

    <!-- <div id="page-dialogs">
      <b-modal v-model="isShowCustomerAddress" hide-footer size="lg">
        <template v-slot:modal-title>
          Customer Address
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridModalCustomerAddress"
                      :fields="[{label: 'Address Code', key: 'AddressCode', _classess: 'text-left', width:150, filter: true},
                      {label: 'Address Name', key: 'AddressName', _classess: 'text-left',filter: true},
                      {label: 'Contact', key: 'ContactPerson', _classess: 'text-left', width:150, filter: true},
                      {label: '', key: 'Default', _classess: 'text-center', width:50, sorter: false, filter: false}]"
                      :items="this.$store.state.features.company.customer_address.data"
                      :info="this.$store.state.features.company.customer_address.listInfo"
                      :baseUrl="this.$store.state.features.company.customer_address.baseUrl"
                      :actGetData="handleGetCustomerAddress"
                      :selectedItem="form.model.AddressCode"
                      selectedFieldName="AddressCode"
                      :actSelectRow="handleSelectCustomerAddress"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div> -->

    <!-- Modal -->

  </div>
</template>

<script>
  import DataGrid from '@/components/Tables/DataGrid'
  import SelectGrid from "@/components/tables/SelectGrid";
  import VueElementLoading from 'vue-element-loading'
  import { AccountModal, PaymentTermModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'

  export default {
    name: 'CustomerGroup',
    layout: 'dashboard',
    components: { DataGrid, SelectGrid, VueElementLoading, AccountModal, PaymentTermModal },
    data() {
      return {
        caption: 'Customer Group',
        blockLoader: false,
        isForm: false,
        isShowCustomerAddress: false,
        perPage: 10,
        form: {
          valid: false,
          isEdit: false,
          model: {
            CustomerGroupId: null,
            CustomerGroupCode: "",
            CustomerGroupName: "",
            PaymentTermCode: "",
            ReceivableAccountNo: "",
            AccruedReceivableAccountNo: "",
            Inactive: false
          }
        }
      }
    },
     computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh()
      }

      await this.$store.dispatch(
        "features/company/customer_address/actGetData",
        "customeraddress?"
      );
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
          title: toastTitle != '' ? toastTitle : 'Confirmation',
          variant: style != '' ? style : 'info',
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGet(url) {
        await this.$store.dispatch('features/company/customer_group/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false

        this.resetForm()
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        })
      },
      async onFormCreate() {
        this.form.model.CustomerGroupId = null;
        this.form.model.CustomerGroupCode = "";
        this.form.model.CustomerGroupName = "";
        this.form.model.PaymentTermCode = "";
        this.form.model.ReceivableAccountNo = "";
        this.form.model.AccruedReceivableAccountNo = "";
        this.form.model.Inactive = false;
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
      },
      async handleEdit(row) {
        this.isForm = true;

        this.form.model.CustomerGroupId = row.CustomerGroupId;
        this.form.model.CustomerGroupCode = row.CustomerGroupCode;
        this.form.model.CustomerGroupName = row.CustomerGroupName;
        this.form.model.PaymentTermCode = row.PaymentTermCode;
        this.form.model.ReceivableAccountNo = row.ReceivableAccountNo;
        this.form.model.AccruedReceivableAccountNo =
          row.AccruedReceivableAccountNo;
        this.form.model.Inactive = (row.Inactive == "Active" ? false : true);

        this.form.isEdit = true;
      },
      async handleGetCustomerAddress(url) {
        await this.$store.dispatch(
          "features/company/customer_address/actGetData",
          "customeraddress?"
        );
      },
      // async handleSelectCustomerAddress(row) {
      //   this.form.model.AddressCode = row.AddressCode;
      //   this.isShowCustomerAddress = false;
      // },
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
      async onModalSearchPaymentTerm(row) {
        this.$refs.dlgPaymentTerm
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedPaymentTerm(item, modelReff) {
        this.form.model[modelReff] = item.PaymentTermCode;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/customer_group/actDelete",
          row
        );

        var response = this.$store.state.features.company.customer_group
          .resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridMain.doRefresh();
          this.resetForm()

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal.msgBoxConfirm('Are you sure ?', {
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

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/customer_group/actUpdate",
            this.form.model
          );

          var response = this.$store.state.features.company.customer_group
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Update failed !'));
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/customer_group/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.customer_group
            .resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Submit failed !'));

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
