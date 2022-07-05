<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">City</span>
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
                  <validation-provider name="City Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CityCode">City Code</label>
                      <b-form-input name="CityCode"
                                    type="text"
                                    placeholder="City Code "
                                    v-model="form.model.CityCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="city-code-feedback"
                                    :disabled="form.isEdit"
                                    size="sm" />
                      <b-form-invalid-feedback id="city-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4">
                  <validation-provider name="City"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CityName">City Name</label>
                      <b-form-input name="CityName"
                                    type="text"
                                    placeholder="City name which displayed on company selection"
                                    v-model="form.model.CityName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="city-name-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="city-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4">
                  <validation-provider name="Province"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Province">Province</label>
                      <b-form-input name="Province"
                                    type="text"
                                    placeholder="No special character please"
                                    v-model="form.model.Province"
                                    :state="validateState(validationContext)"
                                    aria-describedby="province-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="province-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Country"
                                       :rules="{ required: true  }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Country">Country Name</label>
                      <b-form-select size="sm" v-model="form.model.CountryId" :state="validateState(validationContext)" aria-describedby="country-addr-feedback">
                        <b-form-select-option value="">-- select country --</b-form-select-option>
                        <b-form-select-option :value="country.value" v-for="(country, index) in countries" v-bind:key="country.value">{{country.text}}</b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback id="country-addr-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">
                  <validation-provider name="Status"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select id="status"
                                     name="Status"
                                     v-model="form.model.InActive"
                                     :state="validateState(validationContext)"
                                     size="sm"
                                     :plain="true"
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
          <DataGrid ref="gridCity"
                    :fields="this.$store.state.features.company.city.headers"
                    :items="this.$store.state.features.company.city.data"
                    :info="this.$store.state.features.company.city.listInfo"
                    :baseUrl="this.$store.state.features.company.city.baseUrl"
                    :actGetData="handleGetCities"
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
  import DataGrid from '@/components/Tables/DataGrid'
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../services/loginservices'

  export default {
    name: 'City',
    layout: 'dashboard',
    components: { DataGrid, VueElementLoading },
    data() {
      return {
        caption: 'Cities',
        blockLoader: false,
        isForm: false,
        countries: [],
        form: {
          valid: false,
          isEdit: false,
          model: {
            CityId: null,
            CityCode: '',
            CityName: '',
            Province: '',
            CountryId: '',
            InActive: false
          }
        }
      }
    },
    async mounted() {
      if (this.$refs.gridCity != null) {
        await this.$refs.gridCity.doRefresh()
      }

      await this.$store.dispatch("features/company/country/actGetCountry", "country");
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
          title: toastTitle != '' ? toastTitle : 'Confirmation',
          variant: style != '' ? style : 'info',
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        })
      },
      async handleGetCities(url) {
        await this.$store.dispatch('features/company/city/actGetCity', url)
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
        let arr = Array();
        this.$store.state.features.company.country.data.forEach(function (
          row,
          index
        ) {
          arr.push({ value: row.CountryId, text: row.CountryName })
        })

        this.countries = arr;

        this.form.model.CityId = ''
        this.form.model.CityCode = ''
        this.form.model.CityName = ''
        this.form.model.Province = ''
        this.form.model.CountryId = ''
        this.form.model.InActive = false
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
      },
      async handleEdit(row) {
        let arr = Array();
        this.$store.state.features.company.country.data.forEach(function (
          row,
          index
        ) {
          arr.push({ value: row.CountryId, text: row.CountryName })
        })

        this.countries = arr;

        this.isForm = true;

        this.form.model.CityId = row.CityId;
        this.form.model.CityCode = row.CityCode;
        this.form.model.CityName = row.CityName;
        this.form.model.Province = row.Province;
        this.form.model.CountryId = row.CountryId;
        this.form.model.InActive = (row.InActive.toLowerCase() == 'inactive' ? true : false);

        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/city/actDeleteCity",
          row
        );

        var response = this.$store.state.features.company.city.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCity.doRefresh();
          this.resetForm();

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
            "features/company/city/actUpdateCity",
            this.form.model
          );
          var response = this.$store.state.features.company.city
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Update failed !'));
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCity.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/city/actCreateCity",
            this.form.model
          );

          var response = this.$store.state.features.company.city.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Submit failed !'));

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCity.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
