<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Vehicle Type</span>
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
                  <validation-provider name="Vehicle Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="VehicleTypeCode">Vehicle Type Code</label>
                      <b-form-input name="VehicleTypeCode"
                                    type="text"
                                    placeholder="Vehicle Type Code"
                                    v-model="form.model.VehicleTypeCode"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    :disabled="form.isEdit"
                                    aria-describedby="vehicle-type-code-feedback" />
                      <b-form-invalid-feedback id="vehiclde-type-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="Vehicle Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="VehicleTypeName">Vehicle Type Name</label>
                      <b-form-input name="VehicleTypeName"
                                    type="text"
                                    size="sm"
                                    placeholder="Vehicle Type Name"
                                    v-model="form.model.VehicleTypeName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="vehicle-type-name-feedback" />
                      <b-form-invalid-feedback id="vehicle-type-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>                
                <b-col sm=2>
                  <validation-provider name="Category"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="Category">Category</label>
                      <b-form-select id="Category"
                                     name="Category"
                                     size="sm"
                                     v-model="form.model.VehicleCategory"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="[{value:'TRUCK',text:'TRUCK'}]"
                                     aria-describedby="category-feedback"
                                     @change="handleStatus" />
                      <b-form-invalid-feedback id="category-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
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
          <DataGrid ref="gridVehicleType"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.vehicle_type.data"
                    :info="this.$store.state.features.company.vehicle_type.listInfo"
                    :baseUrl="this.$store.state.features.company.vehicle_type.baseUrl"
                    :actGetData="handleGetVehicleType"
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
  import loginServices from '../../services/loginservices'

  export default {
    name: 'VehicleType',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading
    },
    data: () => {
      return {
        caption: 'Vehicle Type',
        blockLoader: false,
        isForm: false,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'VehicleTypeCode',
            label: 'Vehicle Type Code',
            filter: true,
            width:200
          },
          {
            key: 'VehicleTypeName',
            label: 'Vehicle Type Name',
            filter: true
          },
          {
            key: 'VehicleCategory',
            label: 'Vehicle Category',
            filter: true
          },
          {
            key: 'Inactive',
            label: 'Status',
            width: 50,
            filter_select: true,
            filter_select_options: [
              { key: false, value: 'Active' },
              { key: true, value: 'Inactive' }
            ],
            _classes:"text-center"
          }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            VehicleTypeId: null,
            VehicleTypeCode: '',
            VehicleTypeName: '',
            VehicleCategory: '',
            InActive: false
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
      if (this.$refs.gridVehicleType != null) {
        await this.$refs.gridVehicleType.doRefresh();
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
      async handleGetVehicleType(url) {
        
        await this.$store.dispatch('features/company/vehicle_type/actGetVehicleType', url)
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
        this.form.model.VehicleTypeId = ''
        this.form.model.VehicleTypeCode = ''
        this.form.model.VehicleTypeName = ''
        this.form.model.VehicleCategory = 'TRUCK'
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
        this.form.model.VehicleTypeId = row.VehicleTypeId;
        this.form.model.VehicleTypeCode = row.VehicleTypeCode;
        this.form.model.VehicleTypeName = row.VehicleTypeName;
        this.form.model.VehicleCategory = row.VehicleCategory;
        this.form.model.InActive = (row.Inactive.toLowerCase().trim() == 'inactive' ? true : false);
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
          "features/company/vehicle_type/actDeleteVehicleType",
          row
        );

        var response = this.$store.state.features.company.vehicle_type.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridVehicleType.doRefresh();
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
            "features/company/vehicle_type/actUpdateVehicleType",
            this.form.model
          );
          var response = this.$store.state.features.company.vehicle_type
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridVehicleType.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/vehicle_type/actCreateVehicleType",
            this.form.model
          );

          var response = this.$store.state.features.company.vehicle_type.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridVehicleType.doRefresh();
            this.resetForm();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }

        this.showLoader(false);
      },
    }
  }
</script>
