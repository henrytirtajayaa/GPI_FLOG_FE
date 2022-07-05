<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">{{formCaption}}</span>
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
                <b-col sm="4" lg="2">
                  <validation-provider name="Country Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CountryCode">Country Code</label>
                      <b-form-input name="CountryCode"
                                    type="text"
                                    placeholder="Country Code "
                                    v-model="form.model.CountryCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="code-feedback"
                                    :disabled="form.isEdit"
                                    size="sm" />
                      <b-form-invalid-feedback id="code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="6">
                  <validation-provider name="Country Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="CountryName">Country Name</label>
                      <b-form-input name="CountryName"
                                    type="text"
                                    placeholder="Country name"
                                    v-model="form.model.CountryName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="country-name-feedback"
                                    size="sm" />
                      <b-form-invalid-feedback id="country-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid ref="gridCountry"
                    :fields="this.$store.state.features.company.country.headers"
                    :items="this.$store.state.features.company.country.data"
                    :info="this.$store.state.features.company.country.listInfo"
                    :baseUrl="this.$store.state.features.company.country.baseUrl"
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
  </div>
</template>

<script>
  import DataGrid from '@/components/Tables/DataGrid'
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../services/loginservices'

  export default {
    name: 'Country',
    layout: 'dashboard',
    components: { DataGrid, VueElementLoading },
    data() {
      return {
        formCaption: 'Country',
        caption: 'Countries',
        blockLoader: false,
        isForm: false,
        countries: [],
        form: {
          valid: false,
          isEdit: false,
          model: {
            CountryId: null,
            CountryCode: "",
            CountryName: "",
            InActive: false
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
      if (this.$refs.gridCountry != null) {
        await this.$refs.gridCountry.doRefresh()
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
      async handleGet(url) {
        await this.$store.dispatch("features/company/country/actGetCountry", url);
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
        this.form.model.CountryId = "";
        this.form.model.CountryCode = "";
        this.form.model.CountryName = "";
        this.form.model.InActive = false;
        this.resetForm();

        this.form.isEdit = false
        this.isForm = true
      },
      async handleEdit(row) {
        this.isForm = true;

        this.form.model.CountryId = row.CountryId;
        this.form.model.CountryCode = row.CountryCode;
        this.form.model.CountryName = row.CountryName;
      this.form.model.InActive = (row.InActive.toLowerCase().trim() == 'inactive' ? true : false);
      

      this.form.isEdit = true;
    },
    async doDelete(row){
       this.showLoader(true);

      await this.$store.dispatch(
        "features/company/country/actDeleteCountry",
        row
      );

        var response = this.$store.state.features.company.country.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCountry.doRefresh();

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
            "features/company/country/actUpdateCountry",
            this.form.model
          );

          var response = this.$store.state.features.company.country
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Update failed !'));
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCountry.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/country/actCreateCountry",
            this.form.model
          );

          var response = this.$store.state.features.company.country
            .resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', (response.data.ErrorDescription != undefined ? response.data.ErrorDescription : 'Submit failed !'));

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCountry.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
