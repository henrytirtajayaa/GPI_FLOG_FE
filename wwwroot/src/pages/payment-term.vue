<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Payment Term</span>
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
                  <validation-provider name="PaymentTerm"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="PaymentTermCode">Payment Term Code</label>
                      <b-form-input name="PaymentTermCode"
                                    type="text"
                                    size="sm"
                                    placeholder="Payment Term Code"
                                    v-model="form.model.PaymentTermCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="payment-term-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="payment-term-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="Description"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Description">Description</label>
                      <b-form-input name="Description"
                                    size="sm"
                                    type="text"
                                    placeholder="Description"
                                    v-model="form.model.PaymentTermDesc"
                                    :state="validateState(validationContext)"
                                    aria-describedby="description-feedback" />
                      <b-form-invalid-feedback id="description-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Due"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Due">Due</label>
                      <b-form-input name="Due"
                                    type="text"
                                    size="sm"
                                    placeholder="Due"
                                    v-model="form.model.Due"
                                    :state="validateState(validationContext)"
                                    aria-describedby="due-feedback" />
                      <b-form-invalid-feedback id="due-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Unit"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Unit">Unit</label>
                      <b-form-select id="unit"
                                     size="sm"
                                     name="Unit"
                                     v-model="form.model.Unit"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="ItemUnit"
                                     aria-describedby="unit-feedback" />
                      <b-form-invalid-feedback id="unit-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid ref="gridPaymentTerm"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.payment_term.data"
                    :info="this.$store.state.features.company.payment_term.listInfo"
                    :baseUrl="this.$store.state.features.company.payment_term.baseUrl"
                    :actGetData="handleGetgridPaymentTerm"
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
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../services/loginservices'

  export default {
    name: 'PaymentTerm',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        ItemUnit: [{ value: 1, text: "Days" }, { value: 2, text: "Months" }, { value: 3, text: "Years" }],
        caption: 'Payment Term',
        blockLoader: false,
        isForm: false,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'PaymentTermCode',
            label: 'Payment Term Code',
            width: 200,
            classes: 'text-center'
          },
          {
            key: 'PaymentTermDesc',
            label: 'Description',
            filter: true
          },
          {
            key: 'Due',
            label: 'Due',
            width: 150,
            _classes: 'text-center',
            filter_number: true,
            classes: 'text-center'
          },
          {
            key: 'Unit',
            label: 'Unit',
            width: 150,
            filter_select: true,
            filter_select_options: [
              { key: 1, value: "Days" }, { key: 2, value: "Months" }, { key: 3, value: "Years" }
            ]
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            PaymentTermId: null,
            PaymentTermCode: '',
            PaymentTermDesc: '',
            Due: '',
            Unit: ''
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
      if (this.$refs.gridPaymentTerm != null) {
        await this.$refs.gridPaymentTerm.doRefresh()
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
      async handleGetgridPaymentTerm(url) {
        await this.$store.dispatch('features/company/payment_term/actGetPaymentTerm', url)
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
        this.form.model.PaymentTermId = ''
        this.form.model.PaymentTermCode = ''
        this.form.model.PaymentTermDesc = ''
        this.form.model.Due = ''
        this.form.model.Unit = ''
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
        this.form.model.PaymentTermId = row.PaymentTermId;
        this.form.model.PaymentTermCode = row.PaymentTermCode;
        this.form.model.PaymentTermDesc = row.PaymentTermDesc;
        this.form.model.Due = row.Due;
        var unit = ""
        if (row.Unit == "Days") {
          unit = 1
        } else if (row.Unit == "Months") {
          unit = 2
        } else {
          unit = 3
        }
        this.form.model.Unit = unit;
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
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/payment_term/actDeletePaymentTerm",
          row
        );

        var response = this.$store.state.features.company.payment_term.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridPaymentTerm.doRefresh();
          this.resetForm();

          this.handleToast('Confirmation', 'success', "Successfully deleted");
        }

        this.showLoader(false);
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
        this.showLoader(true);

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/payment_term/actUpdatePaymentTerm",
            this.form.model
          );
          var response = this.$store.state.features.company.payment_term
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridPaymentTerm.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/payment_term/actCreatePaymentTerm",
            this.form.model
          );

          var response = this.$store.state.features.company.payment_term.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridPaymentTerm.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
