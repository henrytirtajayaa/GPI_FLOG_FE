<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="10">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Bank</span>
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
                <b-col sm="3">
                  <validation-provider name="Bank Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="BankCode">Bank Code</label>
                      <b-form-input size="sm"
                                    name="BankCode"
                                    type="text"
                                    placeholder="Bank Code"
                                    v-model="form.model.BankCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="bank-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="bank-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="9">
                  <validation-provider name="Bank Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="BankName">Bank Name</label>
                      <b-form-input size="sm"
                                    name="BankName"
                                    type="text"
                                    placeholder="Bank Name"
                                    v-model="form.model.BankName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="bank-name-feedback" />
                      <b-form-invalid-feedback id="bank-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="12">
                  <validation-provider name="Address"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Address">Address</label>
                      <b-form-textarea size="sm"
                                       name="Address"
                                       type="text"
                                       placeholder="Address"
                                       v-model="form.model.Address"
                                       :state="validateState(validationContext)"
                                       aria-describedby="address-feedback" />
                      <b-form-invalid-feedback id="address-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

              <b-row>

                <b-col sm="6">
                  <validation-provider name="City Name"
                                       :rules="{ required: true  }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="City Name">City Name</label>
                      <b-form-select size="sm" v-model="form.model.CityCode" :state="validateState(validationContext)" aria-describedby="city-feedback">
                        <b-form-select-option value="">-- select city --</b-form-select-option>
                        <b-form-select-option :value="city.value" v-for="(city, index) in cities" v-bind:key="city.value">{{city.text}}</b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback id="city-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

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
          <DataGrid ref="gridBank"
                    :fields="this.$store.state.features.company.bank.headers"
                    :items="this.$store.state.features.company.bank.data"
                    :info="this.$store.state.features.company.bank.listInfo"
                    :baseUrl="this.$store.state.features.company.bank.baseUrl"
                    :actGetData="handleGetBank"
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
  import SelectGrid from '@/components/Tables/SelectGrid';
   import loginServices from '../services/loginservices'

  export default {
    name: 'Bank',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid
    },
    data: () => {
      return {
        caption: 'Banks',
        isForm: false,
        isShowVendor: false,
        cities: [],
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'BankCode',
            label: 'Bank Code',
            classes: 'text-center',
            filter: true

          },
          {
            key: 'BankName',
            label: 'Bank Name',
            filter: true
          },
          {
            key: 'Address',
            label: 'Address',
            filter: true
          },
          {
            key: 'CityName',
            label: 'City Name',
            filter: true
          },
          {
            key: 'InActive',
            label: 'Status',
            filter: true
          },
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            BankId: null,
            BankCode: '',
            BankName: '',
            Address: '',
            CityCode: '',
            CityName: '',
            InActive: false,
          },
        }
      }
    },
    async mounted() {

      if (this.$refs.gridBank != null) {
        await this.$refs.gridBank.doRefresh()
      }

      await this.$store.dispatch(
        "features/company/city/actGetCity",
        "City?&InActive=false"
      );

    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
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
      async handleGetBank(url) {
        await this.$store.dispatch('features/company/bank/actGetBank', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },

      async onFormCreate() {
        let arr = Array();
        this.$store.state.features.company.city.data.forEach(function (
          row,
          index
        ) {
          arr.push({ value: row.CityCode, text: row.CityName })
        })

        this.cities = arr;

        this.ErrorMessage = ''
        this.form.model.BankId = ''
        this.form.model.BankCode = ''
        this.form.model.BankName = ''
        this.form.model.Address = ''
        this.form.model.CityCode = ''
        this.form.model.CityName = ''
        this.form.model.InActive = false
        this.form.isEdit = false
        this.isForm = true
        this.resetForm();
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
        let arr = Array();
        this.$store.state.features.company.city.data.forEach(function (
          row,
          index
        ) {
          arr.push({ value: row.CityCode, text: row.CityName })
        })

        this.cities = arr;
     
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.BankId = row.BankId;
        this.form.model.BankCode = row.BankCode;
        this.form.model.BankName = row.BankName;
        this.form.model.Address = row.Address;
        this.form.model.CityCode = row.CityCode;
        this.form.model.CityName = row.CityName;
      this.form.model.InActive = (row.InActive.toLowerCase().trim() == 'inactive' ? true : false);
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
          "features/company/bank/actDeleteBank",
          row
        );

        var response = this.$store.state.features.company.bank.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridBank.doRefresh();

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
            "features/company/bank/actUpdateBank",
            this.form.model
          );
          var response = this.$store.state.features.company.bank
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridBank.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/bank/actCreateBank",
            this.form.model
          );

          var response = this.$store.state.features.company.bank.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridBank.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
