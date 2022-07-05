<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Customer Vendor Relation</span>
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
                <b-col sm="3">
                  <validation-provider name="Customer Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Customer Code</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.CustomerCode"
                                    placeholder="Choose Customer Code"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="customer-code-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="isShowCustomer=true">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="customer-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="3">
                  <validation-provider name="Customer Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Customer Name</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.CustomerName"
                                    placeholder="Choose Customer Name from Code"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="customer-name-feedback"></b-form-input>
                      <b-form-invalid-feedback id="customer-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="3">
                  <validation-provider name="Vendor Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Vendor Code</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.VendorCode"
                                    placeholder="Choose Vendor Code"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="vendor-code-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="isShowVendor=true">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="vendor-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="3">
                  <validation-provider name="Vendor Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Vendor Name</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.VendorName"
                                    placeholder="Choose Vendor Name from Code"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="vendor-name-feedback"></b-form-input>
                      <b-form-invalid-feedback id="vendor-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>
              </b-row><br>

            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridCustomerVendorRelation"
                    :fields="this.$store.state.features.company.customer_vendor_relation.headers"
                    :items="this.$store.state.features.company.customer_vendor_relation.data"
                    :info="this.$store.state.features.company.customer_vendor_relation.listInfo"
                    :baseUrl="this.$store.state.features.company.customer_vendor_relation.baseUrl"
                    :actGetData="handleGetCustomerVendorRelation"
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
    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowCustomer" hide-footer size="lg">
        <template v-slot:modal-title>
          Select Customer
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridCustomer"
                      :fields="[{label: 'Customer Code', key: 'CustomerCode', align: 'text-center'},
                      {label: 'Customer Name', key: 'CustomerName'},
                      {label: 'Customer Group Code', key: 'CustomerGroupCode'},
                      {label: 'Payment Term', key: 'PaymentTermCode'},
                      {
                        label: 'Credit Limit',
                        key: 'HasCreditLimit',
                        _classes: 'text-center',
                        width: 80,
                        filter_select: true,
                        filter_select_options: [
                            { key: false, value: 'No' },
                            { key: true, value: 'Yes' }
                        ]
                    }]"
                      :items="this.$store.state.features.company.customer.data"
                      :info="this.$store.state.features.company.customer.listInfo"
                      :baseUrl="this.$store.state.features.company.customer.baseUrl"
                      :actGetData="handleGetCustomer"
                      :selectedItem="form.model.CustomerCode"
                      selectedFieldName="CustomerCode"
                      :actSelectRow="handleSelectCustomer"
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
    </div>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowVendor" hide-footer size="lg">
        <template v-slot:modal-title>
          Select Vendor
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridVendor"
                      :fields="[{label: 'Vendor Code', key: 'VendorCode', align: 'text-center'},
                      {label: 'Vendor Name', key: 'VendorName'},
                      {label: 'Vendor Group Code', key: 'VendorGroupCode'},
                      {label: 'Payment Term', key: 'PaymentTermCode'}]"
                      :items="this.$store.state.features.company.vendor.data"
                      :info="this.$store.state.features.company.vendor.listInfo"
                      :baseUrl="this.$store.state.features.company.vendor.baseUrl"
                      :actGetData="handleGetVendor"
                      :selectedItem="form.model.VendorCode"
                      selectedFieldName="VendorCode"
                      :actSelectRow="handleSelectVendor"
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
    </div>

  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
  import { CustomerModal, VendorModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'

  export default {
    name: 'Customer Vendor Relation',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid
    },
    data: () => {
      return {
        caption: 'Customer Vendor Relation',
        isForm: false,
        isShowCustomer: false,
        isShowVendor: false,
        perPage: 10,
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            VendorRelationId: null,
            CustomerId: "",
            CustomerCode: "",
            CustomerName: "",
            VendorId: "",
            VendorCode: "",
            VendorName: ""
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

      await this.$store.dispatch(
        "features/company/customer_vendor_relation/actGet",
        "CustomerVendorRelation?"
      );

      await this.$store.dispatch(
        "features/company/customer/actGetData",
        "Customer?&Inactive=false"
      );

      await this.$store.dispatch(
        "features/company/vendor/actGetVendor",
        "Vendor?&Inactive=false"
      );

      if (this.$refs.gridCustomerVendorRelation != null) {
        await this.$refs.gridCustomerVendorRelation.doRefresh()
      }
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

      async handleGetCustomerVendorRelation(url) {
        await this.$store.dispatch('features/company/customer_vendor_relation/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },

      async handleGetCustomer(url) {
         if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("Customer") < 0) {
          url = "customer?" + url;
        }

        await this.$store.dispatch(
          "features/company/customer/actGetData",
          url
        );

        this.$refs.gridCustomer.doRefresh();
      },
      async handleSelectCustomer(row) {
        this.form.model.CustomerId = row.CustomerId;
        this.form.model.CustomerCode = row.CustomerCode;
        this.form.model.CustomerName = row.CustomerName;
        this.isShowCustomer = false;
      },

      async handleGetVendor(url) {
         if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("Vendor") < 0) {
          url = "vendor?" + url;
        }

        await this.$store.dispatch(
          "features/company/vendor/actGetVendor",
          url
        );

        this.$refs.gridVendor.doRefresh();
      },
      async handleSelectVendor(row) {
        this.form.model.VendorId = row.VendorId;
        this.form.model.VendorCode = row.VendorCode;
        this.form.model.VendorName = row.VendorName;
        this.isShowVendor = false;
      },

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },

      async onFormCreate() {
        this.ErrorMessage = ''

        this.form.model.VendorRelationId = null
        this.form.model.CustomerId = ''
        this.form.model.CustomerCode = ''
        this.form.model.CustomerName = ''
        this.form.model.VendorId = ''
        this.form.model.VendorCode = ''
        this.form.model.VendorName = ''
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

        this.form.model.VendorRelationId = row.VendorRelationId;
        this.form.model.CustomerId = row.CustomerId;
        this.form.model.CustomerCode = row.CustomerCode;
        this.form.model.CustomerName = row.CustomerName;
        this.form.model.VendorId = row.VendorId;
        this.form.model.VendorCode = row.VendorCode;
        this.form.model.VendorName = row.VendorName;
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
          "features/company/customer_vendor_relation/actDelete",
          row
        );

        var response = this.$store.state.features.company.customer_vendor_relation.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCustomerVendorRelation.doRefresh();

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
            "features/company/customer_vendor_relation/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.customer_vendor_relation
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCustomerVendorRelation.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/customer_vendor_relation/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.customer_vendor_relation.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridCustomerVendorRelation.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
