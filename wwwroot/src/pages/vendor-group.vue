<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="11">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Vendor Group</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="4">
                  <validation-provider
                    name="Vendor Group Code"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="VendorGroupCode">Vendor Group Code</label>
                      <b-form-input size="sm"
                                    name="VendorGroupCode"
                                    type="text"
                                    placeholder="Vendor Group Code"
                                    v-model="form.model.VendorGroupCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="shipping-line-code-feedback" />
                      <b-form-invalid-feedback id="shipping-line-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="8">
                  <validation-provider name="Vendor Group Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="VendorGroupName">Vendor Group Name</label>
                      <b-form-input size="sm"
                                    name="VendorGroupName"
                                    type="text"
                                    placeholder="Vendor Group Name"
                                    v-model="form.model.VendorGroupName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="shipping-line-name-feedback" />
                      <b-form-invalid-feedback id="shipping-line-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="3">
                    <label>Payment Term</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.PaymentTermCode"
                                    placeholder="Choose Payment Term Code"
                                    readonly
                                    aria-describedby="payment-term-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary"
                                  @click="onModalSearchPaymentTerm('PaymentTermCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Payable Account No.</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.PayableAccountNo"
                                    placeholder="Choose Account Code"
                                    readonly
                                    aria-describedby="payable-account-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary"
                                  @click="onModalSearchAccount('PayableAccountNo')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col sm="3">
                    <label>Accrued Payable Account No.</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.AccruedPayableAccountNo"
                                    placeholder="Choose Account Code"
                                    readonly
                                    aria-describedby="accrued-payable-account-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary"
                                  @click="onModalSearchAccount('AccruedPayableAccountNo')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col>
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
          <DataGrid ref="gridVendorGroup"
                    :fields="this.$store.state.features.company.vendor_group.headers"
                    :items="this.$store.state.features.company.vendor_group.data"
                    :info="this.$store.state.features.company.vendor_group.listInfo"
                    :baseUrl="this.$store.state.features.company.vendor_group.baseUrl"
                    :actGetData="handleGetVendorGroup"
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

    <!-- <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowVendorAddress" hide-footer size="lg">
        <template v-slot:modal-title>
          Select Vendor Address
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridVendorAddress"
                      :fields="[{label: 'Address Code', key: 'AddressCode', align: 'text-center'},
                      {label: 'Address Name', key: 'AddressName'},
                      {label: 'Vendor Code', key: 'VendorCode'},
                      {label: 'Vendor Name', key: 'VendorName'},
                      {label: 'Address', key: 'Address'}]"
                      :items="this.$store.state.features.company.vendor_address.data"
                      :info="this.$store.state.features.company.vendor_address.listInfo"
                      :baseUrl="this.$store.state.features.company.vendor_address.baseUrl"
                      :actGetData="handleGetVendorAddress"
                      :selectedItem="form.model.AddressCode"
                      selectedFieldName="AddressCode"
                      :actSelectRow="handleSelectVendorAddress"
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

    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <PaymentTermModal ref="dlgPaymentTerm" :actSelectedRow="onSelectedPaymentTerm"></PaymentTermModal>

  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
  import VueElementLoading from "vue-element-loading";
  import { AccountModal, PaymentTermModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'
  export default {
    name: 'VendorGroup',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,
      AccountModal,
      PaymentTermModal
    },
    data: () => {
      return {
        caption: 'Vendor Group',
        isForm: false,
        isShowVendorAddress: false,
        perPage: 10,
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            VendorGroupId: null,
            VendorGroupCode: '',
            VendorGroupName: '',
            PaymentTermCode: '',
            PayableAccountNo: '',
            AccruedPayableAccountNo: '',
            InActive: false,
          },
        }
      }
    },
    async mounted() {

      if (this.$refs.gridVendorGroup != null) {
        await this.$refs.gridVendorGroup.doRefresh()
      };

      await this.$store.dispatch(
        "features/company/vendor_address/actGetData",
        "VendorAddress?"
      );
    },
    methods: {
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: (toastTitle != '' ? toastTitle : 'Confirmation'),
          variant: (style != '' ? style : 'info'),
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetVendorGroup(url) {
        await this.$store.dispatch('features/company/vendor_group/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },

      async handleGetVendorAddress(url) {
        await this.$store.dispatch(
          "features/company/vendor_address/actGetData",
          url
        );
        this.$refs.gridVendorAddress.doRefresh();
      },
      // async handleSelectVendorAddress(row) {
      //   this.form.model.AddressCode = row.AddressCode;
      //   this.isShowVendorAddress = false;
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

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''

        this.form.model.VendorGroupId = null
        this.form.model.VendorGroupCode = ''
        this.form.model.VendorGroupName = ''
        this.form.model.PaymentTermCode = ''
        this.form.model.PayableAccountNo = ''
        this.form.model.AccruedPayableAccountNo = ''
        this.form.model.InActive = false
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
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

        this.form.model.VendorGroupId = row.VendorGroupId;
        this.form.model.VendorGroupCode = row.VendorGroupCode;
        this.form.model.VendorGroupName = row.VendorGroupName;
        this.form.model.PaymentTermCode = row.PaymentTermCode;
        this.form.model.PayableAccountNo = row.PayableAccountNo;
        this.form.model.AccruedPayableAccountNo = row.AccruedPayableAccountNo;
        this.form.model.InActive = row.InActive.toLowerCase() == "inactive" ? true : false;

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
          "features/company/vendor_group/actDelete",
          row
        );

        var response = this.$store.state.features.company.vendor_group.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridVendorGroup.doRefresh();

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
            "features/company/vendor_group/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.vendor_group
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridVendorGroup.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/vendor_group/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.vendor_group.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridVendorGroup.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
