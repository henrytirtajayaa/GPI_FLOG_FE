<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Charge Group</span>
                <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit">
                    <font-awesome-icon :icon="['fas', 'save']"  v-if="isSave" />&nbsp;Save
                  </b-button>
                  <b-button @click="onFormClose">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>

              <b-row>
                <b-col sm="3">
                  <validation-provider name="Charge Group Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ChargesCode">Charge Group Code</label>
                      <b-form-input name="Charges Code"
                                    type="text"
                                    placeholder="Charge Group Code"
                                    v-model="form.model.ChargeGroupCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="Charges-feedback"
                                     :disabled="form.isEdit"/>
                      <b-form-invalid-feedback id="Charges-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="Charge Group Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ChargesCode">Charge Group Name</label>
                      <b-form-input name="ChargesName"
                                    type="text"
                                    placeholder="ChargeGroupName"
                                    v-model="form.model.ChargeGroupName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="name-feedback" />
                      <b-form-invalid-feedback id="name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
                    :items="this.$store.state.features.company.charge_group.data"
                    :info="this.$store.state.features.company.charge_group.listInfo"
                    :baseUrl="this.$store.state.features.company.charge_group.baseUrl"
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
                    :caption="caption"
                    ></DataGrid>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from "@/components/tables/SelectGrid";
  import loginServices from '../services/loginservices'

  export default {
    name: 'charge-group',
    layout: 'dashboard',
    components: {
      DataGrid, SelectGrid
    },
    data: () => {
      return {
        caption: 'Charges Group',
        isForm: false,
        isShowSchedule: false,
        perPage: 20,
        selectfield: "",
        //DataGrid HEADERS Declarations, you can
         headerFields: [
          { key: 'ChargeGroupCode', label: 'Charges Group Code', width: 300 },
          { key: 'ChargeGroupName', label: 'Charges Group Name', classes: 'text-center' }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          addrFieldelectSchedule: "",
          model: {
            ChargeGroupId: "",
            ChargeGroupCode: "",
            ChargeGroupName: "",


          },
        }
      }
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh()
      }
      //);
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
      async handleGetData(url) {
        await this.$store.dispatch("features/company/charge_group/actGetData", url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.resetForm();
        this.ErrorMessage = ''
        this.form.model.ChargeGroupCode = "";
        this.form.model.ChargeGroupName = "";

        this.form.isEdit = false;
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
        this.form.model.ChargeGroupId = row.ChargeGroupId;
        this.form.model.ChargeGroupCode = row.ChargeGroupCode;
        this.form.model.ChargeGroupName = row.ChargeGroupName;

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
        await this.$store.dispatch("features/company/charge_group/actDelete", row);

        var response = this.$store.state.features.company.charge_group.resultDelete;
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
            "features/company/charge_group/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.company.charge_group
            .resultUpdate;

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
            "features/company/charge_group/actCreate", this.form.model);

          var response = this.$store.state.features.company.charge_group.resultCreate;
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

