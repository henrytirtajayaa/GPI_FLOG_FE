<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Company Branch</span>
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
                  <validation-provider name="Branch Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="BranchCode">Branch Code</label>
                      <b-form-input
                        name="BranchCode"
                        size="sm"
                        type="text"
                        placeholder="Branch Code"
                        v-model="form.model.BranchCode"
                        :disabled="form.isEdit"
                        :state="validateState(validationContext)"
                        aria-describedby="address-code-feedback"
                      />
                      <b-form-invalid-feedback
                        id="branch-code-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="6">
                  <validation-provider name="Branch Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="BranchName">Branch Name</label>
                      <b-form-input name="BranchName"
                                    size="sm"
                                    type="text"
                                    placeholder="Branch Name"
                                    v-model="form.model.BranchName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="branch-name-feedback" />
                      <b-form-invalid-feedback id="branch-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <!-- DEFAULT -->
                  <b-form-group>
                    <label class="font-weight-bold">
                    Set as
                      <code>DEFAULT</code>&nbsp;selected ?
                    </label>
                    <b-form-checkbox v-model="form.model.Default" >YES</b-form-checkbox>
                  </b-form-group>
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
                                     v-model="form.model.Inactive"
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
          <DataGrid ref="gridMain"
                    :fields="this.$store.state.features.company.company_branch.headers"
                    :items="this.$store.state.features.company.company_branch.data"
                    :info="this.$store.state.features.company.company_branch.listInfo"
                    :baseUrl="this.$store.state.features.company.company_branch.baseUrl"
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

  </div>
</template>
<script>
  import DataGrid from "@/components/Tables/DataGrid";
  import loginServices from '../services/loginservices'

  export default {
    name: "CompanyBranch",
    layout: "dashboard",
    components: {
      DataGrid,
    },
    computed: {
      tableClasses() {
        return [
          "table",
          this.addTableClasses,
          {
            [`table-${this.size}`]: this.size,
            "table-dark": this.dark,
            "table-striped": this.striped,
            "b-table-fixed": this.fixed,
            "table-hover": this.hover,
            "table-bordered": this.border,
            border: this.outlined
          }
        ];
      }
    },
    data: () => {
      return {
        caption: "Company Branch",
        isForm: false,
        perPage: 20,
        alert: "",
        ErrorMessage: "",
        form: {
          valid: false,
          isEdit: false,
          model: {
            CompanyBranchId: "00000000-0000-0000-0000-000000000000",
            BranchCode: "",
            BranchName: "",
            Default: false,
            Inactive: false,            
          }
        }
      };
    },
    async mounted() {
      if (this.$refs.gridMain != null) {
        await this.$refs.gridMain.doRefresh();
      }
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async handleGetData(url) {
        await this.$store.dispatch(
          "features/company/company_branch/actGetCompanyBranches",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
       
      },
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: toastTitle != "" ? toastTitle : "Confirmation",
          variant: style != "" ? style : "info",
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        });
      },
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.resetForm();
        
        this.isForm = true;
      },
      async handleEdit(row) {
        this.resetForm();

        this.form.model.CompanyBranchId = row.CompanyBranchId;
        this.form.model.BranchCode = row.BranchCode;
        this.form.model.BranchName = row.BranchName;
        this.form.model.Default = row.Default.toLowerCase() == 'yes' ? true : false;
        this.form.model.Inactive = row.Inactive.toLowerCase() == 'inactive' ? true : false;
        
        this.form.isEdit = true;
        this.isForm = true;
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.form.model.CompanyBranchId = "00000000-0000-0000-0000-000000000000";
        this.form.model.BranchCode = "";
        this.form.model.BranchName = "";
        this.form.model.Default = false;
        this.form.model.Inactive = false;

        this.ErrorMessage = "";

        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async doDelete(row) {
        await this.$store.dispatch(
          "features/company/company_branch/actDeleteCompanyBranch",
          row
        );

        var response = this.$store.state.features.company.company_branch
          .resultDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.$refs.gridMain.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully deleted");
        }
      },
      async handleDelete(row) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?", {
            title: "Delete Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "blue",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0"
          })
          .then(ok => {
            if (ok) {
              this.doDelete(row);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async onSubmit() {
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/company_branch/actUpdateCompanyBranch",
            this.form.model
          );
          var response = this.$store.state.features.company.company_branch
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/company/company_branch/actCreateCompanyBranch",
            this.form.model
          );

          var response = this.$store.state.features.company.company_branch
            .resultCreate;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridMain.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }
      },
    }
  };
</script>
