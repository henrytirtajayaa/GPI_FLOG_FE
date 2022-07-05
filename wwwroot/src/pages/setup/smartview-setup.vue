<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Smart View</span>
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
                  <validation-provider name="Smart View Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="SmartViewName">Smart View Name</label>
                      <b-form-input size="sm"
                                    name="SmartViewName"
                                    type="text"
                                    placeholder="Smart View Name"
                                    v-model="form.model.SmartViewName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="smart-view-feedback"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="smart-view-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="SQL View Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="SQLViewName">SQL View Name</label>
                      <b-form-input size="sm"
                                    name="SQLViewName"
                                    type="text"
                                    placeholder="SQL View Name"
                                    v-model="form.model.SQLViewName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="sql-name-feedback" />
                      <b-form-invalid-feedback id="sql-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="4">
                  <b-form-group>
                    <label for="SmartViewGroup">Smart View Group</label>
                    <b-form-select size="sm"
                                   id="SmartViewGroup"
                                   name="SmartViewGroup"
                                   v-model="form.model.SmartViewGroup"
                                   :plain="true"
                                   :options="[{value: 'PURCHASING',text: 'PURCHASING'},{value: 'SALES',text: 'SALES'},{value: 'FINANCIAL',text: 'FINANCIAL'}
                                   ,{value: 'TAX',text: 'TAX'},{value: 'INVENTORY',text: 'INVENTORY'},{value: 'OTHER',text: 'OTHER'}]" />
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
          <DataGrid ref="gridSmartview"
                    :fields="this.$store.state.features.report.smart_view.headers"
                    :items="this.$store.state.features.report.smart_view.data"
                    :info="this.$store.state.features.report.smart_view.listInfo"
                    :baseUrl="this.$store.state.features.report.smart_view.baseUrl"
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
   import loginServices from '@/services/loginservices'

  export default {
    name: 'smart-view',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid
    },
    data: () => {
      return {
        caption: 'Smartview',
        isForm: false,
        isShowVendor: false,
        cities: [],
        //DataGrid HEADERS Declarations, you can
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            SmartViewId: null,
            SmartViewName: '',
            SQLViewName: '',
            SmartViewGroup: '',
            IsFunction: false,
          },
        }
      }
    },
    async mounted() {

      if (this.$refs.gridSmartview != null) {
        await this.$refs.gridSmartview.doRefresh()
      }


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
        await this.$store.dispatch('features/report/smart_view/actGetData', url)
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
        this.form.model.SmartViewId = ''
        this.form.model.SmartViewName = ''
        this.form.model.SQLViewName = ''
        this.form.model.SmartViewGroup = ''
        this.form.model.IsFunction = false
        this.form.isEdit = false
        this.isForm = true
        this.resetForm();
      },
     
      async handleEdit(row) {
      
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.SmartViewId = row.SmartviewId;
        this.form.model.SmartViewName = row.SmartTitle;
        this.form.model.SQLViewName = row.SqlViewName;
        this.form.model.SmartViewGroup = row.GroupName;
        this.form.model.IsFunction = row.IsFunction;
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
        await this.$store.dispatch("features/report/smart_view/actDelete",row);

        var response = this.$store.state.features.report.smart_view.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridSmartview.doRefresh();

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
            "features/report/smart_view/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.report.smart_view.resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridSmartview.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

            this.resetForm();
          }
        } else {
          await this.$store.dispatch("features/report/smart_view/actCreate",this.form.model);
          var response = this.$store.state.features.report.smart_view.resultCreate;
          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridSmartview.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.resetForm();
          }
        }
      },
    }
  }
</script>
