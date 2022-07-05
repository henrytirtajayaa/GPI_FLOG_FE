<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Company</span>
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
                <b-col sm="5">
                  <validation-provider name="Company"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CompanyName">Company Name</label>
                      <b-form-input name="CompanyName"
                                    type="text"
                                    placeholder="Company name which displayed on company selection"
                                    v-model="form.model.CompanyName"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="company-name-feedback" />
                      <b-form-invalid-feedback id="company-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Database"
                                       :rules="{ required: true , regex: /^[a-zA-Z0-9_-]*$/ }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DatabaseId">Database</label>
                      <b-form-input name="DatabaseId"
                                    type="text"
                                    size="sm"
                                    placeholder="No special character please"
                                    v-model="form.model.DatabaseId"
                                    :state="validateState(validationContext)"
                                    aria-describedby="database-id-feedback" />
                      <b-form-invalid-feedback id="database-id-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Server Address"
                                       :rules="{ required: true, min:1  }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DatabaseAddress">Server Address</label>
                      <b-form-input id="database-addr"
                                    name="DatabaseAddress"
                                    type="text"
                                    size="sm"
                                    placeholder="Server IP Address"
                                    v-model="form.model.DatabaseAddress"
                                    :state="validateState(validationContext)"
                                    aria-describedby="database-addr-feedback" />
                      <b-form-invalid-feedback id="database-addr-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Database Password"
                                       :rules="{ required: true , min:3}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Password">Password</label>
                      <b-form-input id="database-pwd"
                                    name="Password"
                                    type="password"
                                    size="sm"
                                    placeholder="Database password"
                                    v-model="form.model.Password"
                                    :state="validateState(validationContext)"
                                    aria-describedby="database-pwd-feedback" />
                      <b-form-invalid-feedback id="database-pwd-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="COA Length"
                                       :rules="{ required: true, min_value:1, min:1, max:15, regex: /^[0-9]*$/ }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CoaLength">Length of COA</label>
                      <b-form-input name="CoaLength"
                                    type="text"
                                    size="sm"
                                    placeholder="Max length of account code"
                                    v-model="form.model.CoaTotalLength"
                                    :state="validateState(validationContext)"
                                    aria-describedby="coa-length-feedback"
                                    :readonly="form.isEdit" />
                      <b-form-invalid-feedback id="coa-length-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="COA Symbol"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CoaSymbol">COA Symbol</label>
                      <b-form-select id="coa-symbol"
                                     name="CoaSymbol"
                                     size="sm"
                                     v-model="form.model.CoaSymbol"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="['-','.']"
                                     aria-describedby="coa-length-feedback"
                                     :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="coa-length-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm=2>
                  <validation-provider name="Status"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select id="status"
                                     name="Status"
                                     size="sm"
                                     v-model="form.model.InActive"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                                     aria-describedby="coa-length-feedback"
                                     @change="handleStatus" />
                      <b-form-invalid-feedback id="coa-length-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm=12>
                  <b-card tag="article" class="mb-1">
                    <b-card-text>
                      <b-row class="mt-2">
                      <b-col sm=3>
                        <b-form-group>
                        <label for="SMTP">SMTP Server</label>
                        <b-form-input name="SmtpServer"
                                      type="text"
                                      placeholder="SMTP Server"
                                      v-model="form.model.SmtpServer"
                                      size="sm" />
                      </b-form-group>
                      </b-col>
                      <b-col sm=2>
                        <b-form-group>
                        <label for="SMTP">SMTP Port</label>
                        <b-form-input name="SmtpPort"
                                      type="text"
                                      placeholder="SMTP Port"
                                      v-model="form.model.SmtpPort"
                                      size="sm" />
                      </b-form-group>
                      </b-col>
                      <b-col sm=3>
                        <b-form-group>
                        <label for="SMTP">SMTP User</label>
                        <b-form-input name="SmtpUser"
                                      type="text"
                                      placeholder="SMTP User"
                                      v-model="form.model.SmtpUser"
                                      size="sm" />
                      </b-form-group>
                      </b-col>
                      <b-col sm=4>
                        <b-form-group>
                        <label for="SMTP">SMTP Password</label>
                        <b-form-input name="SmtpPassword"
                                      type="password"
                                      placeholder="SMTP Password"
                                      v-model="form.model.SmtpPassword"
                                      size="sm" />
                      </b-form-group>
                      </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
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
          <DataGrid ref="gridCompany"
                    :fields="headerFields"
                    :items="this.$store.state.features.central.company.data"
                    :info="this.$store.state.features.central.company.listInfo"
                    :baseUrl="this.$store.state.features.central.company.baseUrl"
                    :actGetData="handleGetCompany"
                    :actCreate="onFormCreate"
                    :actEditRow="handleEdit"
                    :actDeleteRow="handleDelete"
                    :disableNewButton="!this.$store.state.roleaccess.AllowNew"
                    :isEdit="this.$store.state.roleaccess.AllowEdit"
                    :isDelete="this.$store.state.roleaccess.AllowDelete"
                    addTableClasses="table-bordered"
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
    name: 'Company',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        caption: 'Company',
        blockLoader: false,
        isForm: false,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'CompanyName',
            label: 'Company Name',
            classes: 'text-center'
          },
          {
            key: 'DatabaseId',
            label: 'Database',
            width: 200,
          },
          {
            key: 'DatabaseAddress',
            label: 'Server',
            width: 100,
          },
          {
            key: 'CoaSymbol',
            label: 'COA Symbol',
            _classes: 'text-center',
            width: 50,
          },
          {
            key: 'CoaTotalLength',
            label: 'COA Length',
            _classes: 'text-center',
            width: 200,
            filter_number: true
          },
          {
            key: 'InActive',
            label: 'Status',
            width: 50,
            filter_select: true,
            filter_select_options: [
              { key: false, value: 'Active' },
              { key: true, value: 'Inactive' }
            ]
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            CompanyId: null,
            CompanyName: '',
            DatabaseId: '',
            DatabaseAddress: '',
            Password: '',
            CoaSymbol: '',
            CoaTotalLength: '',
            InActive: false,
            SmtpServer: '',
            SmtpPort: '',
            SmtpUser: '',
            SmtpPassword: ''
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
      if (this.$refs.gridCompany != null) {
        await this.$refs.gridCompany.doRefresh();
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
      async handleGetCompany(url) {
        
        await this.$store.dispatch('features/central/company/actGetCompany', url)
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
        this.form.model.CompanyId = ''
        this.form.model.CompanyName = ''
        this.form.model.DatabaseId = ''
        this.form.model.DatabaseAddress = ''
        this.form.model.Password = ''
        this.form.model.CoaSymbol = ''
        this.form.model.CoaTotalLength = ''
        this.form.model.InActive = false
        this.form.model.SmtpServer = ''
        this.form.model.SmtpPort = ''
        this.form.model.SmtpUser = ''
        this.form.model.SmtpPassword = ''
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
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.CompanyId = row.CompanyId;
        this.form.model.CompanyName = row.CompanyName;
        this.form.model.DatabaseId = row.DatabaseId;
        this.form.model.DatabaseAddress = row.DatabaseAddress;
        this.form.model.Password = row.DatabasePassword;
        this.form.model.CoaSymbol = row.CoaSymbol;
        this.form.model.CoaTotalLength = row.CoaTotalLength;
        this.form.model.InActive = (row.InActive.toLowerCase() == 'inactive' ? true : false);
        this.form.model.SmtpServer = row.SmtpServer
        this.form.model.SmtpPort = row.SmtpPort
        this.form.model.SmtpUser = row.SmtpUser
        this.form.model.SmtpPassword = row.SmtpPassword
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
          "features/central/company/actDeleteCompany",
          row
        );

        var response = this.$store.state.features.central.company.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCompany.doRefresh();
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
            "features/central/company/actUpdateCompany",
            this.form.model
          );
          var response = this.$store.state.features.central.company
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCompany.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/central/company/actCreateCompany",
            this.form.model
          );

          var response = this.$store.state.features.central.company.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCompany.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
