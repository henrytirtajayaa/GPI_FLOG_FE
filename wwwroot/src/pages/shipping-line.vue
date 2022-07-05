<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Shipping Line</span>
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
                <b-col sm="5">
                  <validation-provider name="Shipping Line Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ShippingLineCode">Shipping Line Code</label>
                      <b-form-input size="sm"
                                    name="ShippingLineCode"
                                    type="text"
                                    placeholder="Shipping Line Code"
                                    v-model="form.model.ShippingLineCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="shipping-line-code-feedback" />
                      <b-form-invalid-feedback id="shipping-line-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="5">
                  <validation-provider name="Shipping Line Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ShippingLineName">Shipping Line Name</label>
                      <b-form-input size="sm"
                                    name="ShippingLineName"
                                    type="text"
                                    placeholder="Shipping Line Name"
                                    v-model="form.model.ShippingLineName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="shipping-line-name-feedback" />
                      <b-form-invalid-feedback id="shipping-line-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="2">
                  <validation-provider name="Shipping Line Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ShippingLineType">Shipping Line Type</label>
                      <b-form-select size="sm"
                                     id="shipping-line-type"
                                     name="ShippingLineType"
                                     v-model="form.model.ShippingLineType"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="['SEA','AIR','LAND']"
                                     aria-describedby="shipping-line-type-feedback" />
                      <b-form-invalid-feedback id="shipping-line-type-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="Shipping Line Owner"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Shipping Line Owner</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.VendorName"
                                    placeholder="Vendor Name"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="vendor-name-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="onModalSearchVendor('VendorName')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="vendor-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="2">
                  <b-form-group>
                    <label for="Feeder">Type</label>
                    <b-form-select size="sm"
                                   id="feeder-type"
                                   name="FeederType"
                                   v-model="form.model.IsFeeder"
                                   :plain="true"
                                   :options="[
                            {
                                value: false,
                                text: 'Non-Feeder'
                            },
                            {
                                value: true,
                                text: 'Feeder'
                            }
                        ]" />
                  </b-form-group>
                </b-col>

                <b-col sm="2">
                  <b-form-group>
                    <label for="Status">Status</label>
                    <b-form-select size="sm"
                                   id="status"
                                   name="Status"
                                   v-model="form.model.Inactive"
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
          <DataGrid ref="gridShippingLine"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.shipping_line.data"
                    :info="this.$store.state.features.company.shipping_line.listInfo"
                    :baseUrl="this.$store.state.features.company.shipping_line.baseUrl"
                    :actGetData="handleGetShippingLine"
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
    <VendorModal ref="dlgVendor" :actSelectedRow="onSelectedVendor"></VendorModal>

  </div>
</template>
<script>
  
  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
  import { VendorModal } from "@/pages/modal/index.js";
  import loginServices from '../services/loginservices'
  export default {
    name: 'ShippingLine',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid,
      VendorModal
    },
    data: () => {
      return {
        caption: 'Shipping Lines',
        isForm: false,
        isShowVendor: false,
        perPage: 10,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'ShippingLineCode',
            label: 'Shipping Line Code',
            classes: 'text-center',
            filter: true

          },
          {
            key: 'ShippingLineName',
            label: 'Shipping Line Name',
            filter: true,
          },
          {
            key: 'ShippingLineType',
            label: 'Shipping Type',
            filter: true,
            width: 150
          },
          {
            key: 'VendorName',
            label: 'Shipping Line Owner',
            filter: true
          },
          {
            key: "Inactive",
            label: "Status",
            width: 100,
            filter_select: true,
            filter_select_options: [
              { key: false, value: "Active" },
              { key: true, value: "Inactive" }
            ]
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            ShippingLineId: null,
            ShippingLineCode: '',
            ShippingLineName: '',
            ShippingLineType: '',
            VendorId: '',
            VendorName: '',
            IsFeeder: false,
            Inactive: false
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
        "features/company/vendor/actGetVendor",
        "Vendor?&Inactive=false"
      );

      if (this.$refs.gridShippingLine != null) {
        await this.$refs.gridShippingLine.doRefresh()
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
      async handleGetShippingLine(url) {
        await this.$store.dispatch('features/company/shipping_line/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },

      async onModalSearchVendor(row) {
        this.$refs.dlgVendor
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedVendor(item, modelReff) {
        this.form.model[modelReff] = item.VendorName;
        this.form.model.VendorId = item.VendorId;
      },

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.ShippingLineId = ''
        this.form.model.ShippingLineCode = ''
        this.form.model.ShippingLineName = ''
        this.form.model.ShippingLineType = ''
        this.form.model.VendorId = ''
        this.form.model.VendorName = ''
        this.form.model.IsFeeder = false
        this.form.model.Inactive = false
        this.form.isEdit = false
        this.isForm = true
        this.resetForm();
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
        this.form.model.ShippingLineId = row.ShippingLineId;
        this.form.model.ShippingLineCode = row.ShippingLineCode;
        this.form.model.ShippingLineName = row.ShippingLineName;
        this.form.model.ShippingLineType = row.ShippingLineType;
        this.form.model.VendorId = row.VendorId;
        this.form.model.VendorName = row.VendorName;
        this.form.model.IsFeeder = row.IsFeeder;
        this.form.model.Inactive = (row.Inactive.toLowerCase().trim() == 'inactive' ? true : false);
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
          "features/company/shipping_line/actDelete",
          row
        );

        var response = this.$store.state.features.company.shipping_line.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridShippingLine.doRefresh();

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
            "features/company/shipping_line/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.shipping_line
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridShippingLine.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/shipping_line/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.company.shipping_line.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridShippingLine.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
