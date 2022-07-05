<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Port</span>
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
                  <validation-provider name="PortCode"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="PortCode">Port Code</label>
                      <b-form-input name="PortCode"
                                    type="text"
                                    placeholder="Port Code"
                                    v-model="form.model.PortCode"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="port-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="port-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="PortName"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="PortName">Port Name</label>
                      <b-form-input name="PortName"
                                    type="text"
                                    size="sm"
                                    placeholder="Port Name"
                                    v-model="form.model.PortName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="PortName-feedback" />
                      <b-form-invalid-feedback id="PortName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">
                  <validation-provider name="Port Type"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CityCode">Port Type</label>
                      <b-form-select id="PortType"
                                     name="PortType"
                                     size="sm"
                                     v-model="form.model.PortType"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="PortType"
                                     aria-describedby="PortType-feedback" />
                      <b-form-invalid-feedback id="PortType-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="City Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CityCode">City Code</label>
                      <b-form-select id="CityCode"
                                     name="CityCode"
                                     size="sm"
                                     v-model="form.model.CityCode"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="ItemCity"
                                     aria-describedby="CityCode-feedback"
                                     @change="selectCity(form.model.CityCode)" />
                      <b-form-invalid-feedback id="CityCode-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="Province">Province</label>
                    <b-form-input id="Province"
                                  name="Province"
                                  type="text"
                                  size="sm"
                                  placeholder="Province"
                                  v-model="form.model.Province"
                                  disabled />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="CountryName">Country Name</label>
                    <b-form-input id="CountryName"
                                  name="CountryName"
                                  type="text"
                                  size="sm"
                                  placeholder="CountryName"
                                  v-model="form.model.CountryName"
                                  disabled />
                  </b-form-group>
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
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridPort"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.port.data"
                    :info="this.$store.state.features.company.port.listInfo"
                    :baseUrl="this.$store.state.features.company.port.baseUrl"
                    :actGetData="handleGetPort"
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
    name: 'Company',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        caption: 'Ports',
        blockLoader: false,
        isForm: false,
        ItemCity: [],
        PortType: [{ value: 'AIR', text: 'AIR' }, { value: 'SEA', text: 'SEA' }, {value: 'LAND', text: 'LAND' }],
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'PortCode',
            label: 'Port Code',
            width: 100
          },
          {
            key: 'PortName',
            label: 'Port Name',
            width: 200,
          },
          {
            key: 'CityName',
            label: 'City Name',
            width: 100,
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
            PortId: null,
            PortCode: "",
            PortName: "",
            PortType: "",
            CityCode: "",
            InActive: false,
            Province: "",
            CountryName: ""
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
      if (this.$refs.gridPort != null) {
        await this.$refs.gridPort.doRefresh()
      }
      await this.$store.dispatch("features/company/city/actGetCity", "city?InActive=false");
      var arr = [];
      this.$store.state.features.company.city.data.forEach(function (row, index) {
        arr.push({ value: row.CityCode, text: row.CityName })
      });
      this.ItemCity = arr;
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
      async handleGetPort(url) {
        await this.$store.dispatch("features/company/port/actGetPort", url)
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
        this.form.model.PortId = "";
        this.form.model.PortCode = "";
        this.form.model.PortType = "";
        this.form.model.PortName = "";
        this.form.model.CityCode = "";
        this.form.model.Province = "";
        this.form.model.CountryName = "";
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
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.PortId = row.PortId;
        this.form.model.PortCode = row.PortCode;
        this.form.model.PortName = row.PortName;
        this.form.model.PortType = row.PortType;
        this.form.model.CityCode = row.CityCode;
        this.form.model.Province = row.Province;
        this.form.model.CountryName = row.CountryName;
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
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/port/actDeletePort",
          row
        );

        var response = this.$store.state.features.company.port.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridPort.doRefresh();
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
            "features/company/port/actUpdatePort",
            this.form.model
          );
          var response = this.$store.state.features.company.port
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridPort.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/port/actCreatePort",
            this.form.model
          );

          var response = this.$store.state.features.company.port.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridPort.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
      async selectCity(value) {
        var Province;
        var CountryName;
        this.$store.state.features.company.city.data.forEach(function (row, index) {
          if (row.CityCode == value) {
            Province = row.Province;
            CountryName = row.CountryName
          }
        });
        this.form.model.Province = Province;
        this.form.model.CountryName = CountryName;

      },
    }
  }
</script>
