<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="10">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Container Depot</span>
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
                  <validation-provider name="Depot Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DepotCode">Depot Code</label>
                      <b-form-input size="sm"
                                    name="DepotCode"
                                    type="text"
                                    placeholder="Depot Code"
                                    v-model="form.model.DepotCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="depot-code-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="depot-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="9">
                  <validation-provider name="Depot Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DepotName">Depot Name</label>
                      <b-form-input size="sm"
                                    name="DepotName"
                                    type="text"
                                    placeholder="Depot Name"
                                    v-model="form.model.DepotName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="depot-name-feedback" />
                      <b-form-invalid-feedback id="depot-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="3">
                    <label>Depot Owner Code</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.VendorCode"
                                    placeholder="Depot Owner Code"
                                    readonly
                                    aria-describedby="vendor-code-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="onModalSearchVendor('VendorCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                        <b-button variant="outline-danger" size="sm" v-if="form.model.VendorCode" @click="deleteVendorCode()">
                          <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-col> 
                 <b-col sm="9">
                  <b-form-group>
                      <label for="Depot Owner Vendor">Depot Owner Name</label>
                      <b-form-input size="sm"
                                    name="DepotOwnerVendorName"
                                    type="text"
                                    placeholder="Depot Owner Name"
                                    v-model="form.model.VendorName"
                                    disabled
                                    aria-describedby="vendor-name-feedback" />
                      <b-form-invalid-feedback id="vendor-name-feedback"></b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col sm="3">
                  <validation-provider name="City Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>City Code</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.CityCode"
                                    placeholder="City Code"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="city-code-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="onModalSearchCity('CityCode')">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="city-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col> 
                 <b-col sm="9">
                  <validation-provider name="City Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="City Name">City Name</label>
                      <b-form-input size="sm"
                                    name="CityName"
                                    type="text"
                                    placeholder="City Name"
                                    v-model="form.model.CityName"
                                    :state="validateState(validationContext)"
                                    disabled
                                    aria-describedby="city-name-feedback" />
                      <b-form-invalid-feedback id="city-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid ref="gridContainerDepot"
                    :fields="this.$store.state.features.company.container_depot.headers"
                    :items="this.$store.state.features.company.container_depot.data"
                    :info="this.$store.state.features.company.container_depot.listInfo"
                    :baseUrl="this.$store.state.features.company.container_depot.baseUrl"
                    :actGetData="handleGetContainerDepot"
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
    <CityModal ref="dlgCity" :actSelectedRow="onSelectedCity"></CityModal>
  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
   import loginServices from '../../services/loginservices'
  import { VendorModal, CityModal } from "@/pages/modal/index.js";

  export default {
    name: 'ContainerDepot',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid,
      VendorModal,
      CityModal
    },
    data: () => {
      return {
        caption: 'Container Depot',
        isForm: false,
        isShowVendor: false,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'DepotCode',
            label: 'Depot Code',
            classes: 'text-center',
            filter: true

          },
          {
            key: 'DepotName',
            label: 'Depot Name',
            filter: true
          },
          {
            key: 'CityName',
            label: 'City Name',
            filter: true
          },
          {
            key: 'VendorName',
            label: 'Vendor Name',
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
            ContainerDepotId: "00000000-0000-0000-0000-000000000000",
            DepotCode: '',
            DepotName: '',
            OwnerVendorId: '00000000-0000-0000-0000-000000000000',
            VendorCode: '',
            VendorName: '',
            CityCode: '',
            CityName: '',
            InActive: false,
          },
        }
      }
    },
    async mounted() {

      if (this.$refs.gridContainerDepot != null) {
        await this.$refs.gridContainerDepot.doRefresh()
      }

    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async deleteVendorCode(){
        this.form.model.VendorCode = ''
        this.form.model.VendorName = ''
        this.form.model.OwnerVendorId = '00000000-0000-0000-0000-000000000000'
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
        this.form.model[modelReff] = item.VendorCode;
        this.form.model.OwnerVendorId = item.VendorId;
        this.form.model.VendorName = item.VendorName;
      },
      async onModalSearchCity(row) {
        this.$refs.dlgCity
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedCity(item, modelReff) {
        this.form.model[modelReff] = item.CityCode;
        this.form.model.CityName = item.CityName;
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
      async handleGetContainerDepot(url) {
        await this.$store.dispatch('features/company/container_depot/actGetContainerDepot', url)
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
        this.form.model.ContainerDepotId = "00000000-0000-0000-0000-000000000000"
        this.form.model.DepotCode = ''
        this.form.model.DepotName = ''
        this.form.model.OwnerVendorId = '00000000-0000-0000-0000-000000000000'
        this.form.model.VendorCode = ''
        this.form.model.VendorName = ''
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
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.ContainerDepotId = row.ContainerDepotId;
        this.form.model.DepotCode = row.DepotCode;
        this.form.model.DepotName = row.DepotName;
        this.form.model.OwnerVendorId = row.OwnerVendorId;
        this.form.model.VendorCode = row.VendorCode;
        this.form.model.VendorName = row.VendorName;
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
          "features/company/container_depot/actDeleteContainerDepot",
          row
        );

        var response = this.$store.state.features.company.container_depot.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridContainerDepot.doRefresh();

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
            "features/company/container_depot/actUpdateContainerDepot",
            this.form.model
          );
          var response = this.$store.state.features.company.container_depot
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridContainerDepot.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch(
            "features/company/container_depot/actCreateContainerDepot",
            this.form.model
          );

          var response = this.$store.state.features.company.container_depot.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridContainerDepot.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
