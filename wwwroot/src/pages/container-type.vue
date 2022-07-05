<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Container Type</span>
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
                  <validation-provider name="Container Type Code"
                                       :rules="{ required: true}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ContainerCode">Container Type Code</label>
                      <b-form-input name="ContainerCode"
                                    size="sm"
                                    type="text"
                                    placeholder="Container Type Code"
                                    v-model="form.model.ContainerCode"
                                    :disabled="form.isEdit"
                                    :state="validateState(validationContext)"
                                    aria-describedby="code-container-feedback" />
                      <b-form-invalid-feedback id="code-container">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="Container Type Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserPassword">Container Type Name</label>
                      <b-form-input name="ContainerCode"
                                    size="sm"
                                    type="text"
                                    placeholder="Container Type Name"
                                    v-model="form.model.ContainerName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="nama-container-feedback" />
                      <b-form-invalid-feedback id="nama-container-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="2">

                  <validation-provider name="Container Teus"
                                       :rules="{ required: true,regex:/^0*(?:[1-9][0-9]?|100)$/}"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ContainerTeus">Container Teus</label>
                      <b-form-input name="ContainerTeus"
                                    size="sm"
                                    type="number"
                                    placeholder="ContainerTeus"
                                    v-model="form.model.ContainerTeus"
                                    :state="validateState(validationContext)"
                                    aria-describedby="teus-container-feedback" />
                      <b-form-invalid-feedback id="teus-container-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="2">

                  <validation-provider name="Container Size"
                                       :rules="{ required: true,regex:/^0*(?:[1-9][0-9]?|100)$/ }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ContainerSize">Container Size</label>
                      <b-form-input name="ContainerSize"
                                    size="sm"
                                    type="number"
                                    placeholder="Container Size"
                                    v-model="form.model.ContainerSize"
                                    :state="validateState(validationContext)"
                                    aria-describedby="size-container-feedback" />
                      <b-form-invalid-feedback id="size-container-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Container Model"
                                       :rules="{ required: true}"
                                       v-slot="validationContext">
                    <b-form-group>
                    <label for="ContainerType">Container Model</label>
                    <b-form-select id="ContainerType"
                                      size="sm"
                                     name="ContainerType"
                                     v-model="form.model.ContainerType"
                                     :state="validateState(validationContext)"
                                     :plain="true"
                                     :options="form.refContainerType"
                                     aria-describedby="type-container-feedback"/>
                      <b-form-invalid-feedback id="type-container-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                    <!--<b-input-group prepend>
                    <b-form-input v-model="form.model.RefContainerTypeDesc"
                                     size="sm"
                                    readonly
                                    aria-describedby="type-container-feedback" :state="validateState(validationContext)"></b-form-input>
                      <b-button variant="outline-success" @click="IsShowRef=true"  size="sm">
                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                      </b-button>


                      <b-form-invalid-feedback id="type-container-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>

                    </b-input-group>-->
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
                                      size="sm"
                                     name="Status"
                                     v-model="form.model.InActive"
                                     :state="validateState(validationContext)"
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
          <DataGrid ref="gridMain"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.container_type.data"
                    :info="this.$store.state.features.company.container_type.listInfo"
                    :baseUrl="this.$store.state.features.company.container_type.baseUrl"
                    :actGetData="handleGetData"
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

    <div id="page-dialogs" height="100%">
      <b-modal v-model="IsShowRef" hide-footer size="xl">
        <template v-slot:modal-title>
          Reference
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="grid"
                      :fields="[{label: 'Container Type',key: 'ReferenceName'}]"
                      :items="this.$store.state.features.company.reference.data"
                      :info="this.$store.state.features.company.reference.listInfo"
                      :baseUrl="this.$store.state.features.company.reference.baseUrl"
                      :actGetData="handleGetDataRef"
                      :selectedItem="form.model.RefContainerType"
                      selectedFieldName="RefContainerType"
                      :actSelectRow="handleSelectData"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter></SelectGrid>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from "@/components/tables/SelectGrid";
  import loginServices from '../services/loginservices'

  export default {
    name: 'Container-Type',
    layout: 'dashboard',
    components: {
      DataGrid, SelectGrid
    },
    data: () => {
      return {
        caption: 'Container Types',
        isForm: false,
        IsShowRef: false,
        perPage: 20,
        headerFields: [
          { key: 'ContainerCode', label: 'Container Type Code', width: 200 },
          { key: 'ContainerName', label: 'Container Type Name', classes: 'text-center' },
          {
            key: 'Inactive',
            label: 'Status',
            _classes:'text-center',
            width: 100,
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
            ContainerId: null,
            ContainerCode: "",
            ContainerName: "",
            ContainerSize: 0,
            ContainerType: "",
            ContainerTeus: 0,
            InActive: false
          },

          refContainerType: [
            "Bulk Container",
            "Car Carriers Container",
            "Cattle Container",
            "CNG Container",
            "Dry Cargo Container",
            "FlatRack Container",
            "Hanger Container",
            "Live Stock Container",
            "Refrigerated Container",
            "Open Sided Container",
            "Open Top Container", 
            "Platforms",
            "Tank Container",
            "Thermal Container",
            "Ventilation Container"
          ]
        }
      }
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh()
      }
      await this.$store.dispatch("features/company/reference/actGetReference", "reference?");
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async handleSelectData(row) {
        this.form.model.RefContainerType = row.value;
        this.form.model.RefContainerTypeDesc = row.text;
        this.IsShowRef = false;
      },
      async handleGetDataRef(url) {
        await this.$store.dispatch("features/company/reference/actGetReference", url);
        
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
      async handleGetData(url) {
        await this.$store.dispatch('features/company/container_type/actGetContainer', url)
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
        this.form.model.ContainerId = ""
        this.form.model.ContainerCode = ""
        this.form.model.ContainerName = ""
        this.form.model.ContainerSize = 1
        this.form.model.ContainerType = ""
        this.form.model.ContainerTeus = 1
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
        this.form.model.ContainerId = row.ContainerId
        this.form.model.ContainerCode = row.ContainerCode
        this.form.model.ContainerName = row.ContainerName
        this.form.model.ContainerSize = row.ContainerSize
        this.form.model.ContainerType = row.ContainerType
        this.form.model.ContainerTeus = row.ContainerTeus
        this.form.model.InActive = (row.Inactive.toLowerCase().trim() == 'inactive' ? true : false);
        this.form.isEdit = true;
        this.isForm = true;
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
        
        await this.$store.dispatch("features/company/container_type/actDeleteContainer", row);

        var response = this.$store.state.features.company.container_type.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridMain.doRefresh();

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
            "features/company/container_type/actUpdateContainer",
            this.form.model
          );
          var response = this.$store.state.features.company.container_type.resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/container_type/actCreateContainer", this.form.model);

          var response = this.$store.state.features.company.container_type.resultCreate;
          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridMain.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }
      },
    }
  }
</script>
