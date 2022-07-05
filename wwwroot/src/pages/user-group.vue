<template>
  <div class="animated fadeIn" id="main">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">User Group</span>
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
                  <input type="hidden" v-model="form.model.PersonCategoryId" readonly />
                  <validation-provider name="User Group Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserGroupCode">User Group Code</label>
                      <b-form-input name="UserGroupCode"
                                    type="text"
                                    size="sm"
                                    placeholder="User Group Code "
                                    v-model="form.model.PersonCategoryCode"
                                    :state="validateState(validationContext)"
                                    aria-describedby="valid-feedback1"
                                    :disabled="form.isEdit" />
                      <b-form-invalid-feedback id="valid-feedback1">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="6">
                  <validation-provider name="User Group Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserGroupName">User Group Name</label>
                      <b-form-input name="UserGroupName"
                                    type="text"
                                    size="sm"
                                    placeholder="Name of user group"
                                    v-model="form.model.PersonCategoryName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="valid-feedback2" />
                      <b-form-invalid-feedback id="valid-feedback2">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid ref="gridUserGroup"
                    :fields="this.$store.state.features.central.user_group.headers"
                    :items="this.$store.state.features.central.user_group.data"
                    :info="this.$store.state.features.central.user_group.listInfo"
                    :baseUrl="this.$store.state.features.central.user_group.baseUrl"
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
    <div id="footer" />
  </div>
</template>

<script>
  import DataGrid from "@/components/Tables/DataGrid"
  import VueElementLoading from 'vue-element-loading'
  import loginServices from '../services/loginservices'

  export default {
    name: "UserGroup",
    layout: "dashboard",
    components: { DataGrid, VueElementLoading },
    data() {
      return {
        caption: "User Group",
        blockLoader: false,
        isForm: false,
        countries: [],
        form: {
          valid: false,
          isEdit: false,
          model: {
            PersonCategoryId: null,
            PersonCategoryCode: "",
            PersonCategoryName: ""
          }
        }
      };
    },
    async mounted() {
      if (this.$refs.gridUserGroup != null) {
        await this.$refs.gridUserGroup.doRefresh();
      }
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
          title: toastTitle != "" ? toastTitle : "Confirmation",
          variant: style != "" ? style : "info",
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        });
      },
      async handleGet(url) {
        await this.$store.dispatch(
          "features/central/user_group/actGetUserGroup",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      resetForm() {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async onFormCreate() {
        this.form.model.PersonCategoryId = "";
        this.form.model.PersonCategoryCode = "";
        this.form.model.PersonCategoryName = "";
        this.resetForm();

        this.form.isEdit = false;
        this.isForm = true;
      },
      async handleEdit(row) {
        this.form.model.PersonCategoryId = row.UserGroupId;
        this.form.model.PersonCategoryCode = row.UserGroupCode;
        this.form.model.PersonCategoryName = row.UserGroupName;

        this.isForm = true;
        this.form.isEdit = true;
      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/central/user_group/actDeleteUserGroup",
          row
        );

        var response = this.$store.state.features.central.user_group.resultDelete;

        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed !"
          );
        } else {
          this.$refs.gridUserGroup.doRefresh();
          this.resetForm();

          this.handleToast("Confirmation", "success", "Successfully deleted");
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
        this.$bvModal
          .msgBoxConfirm("Are you sure ?", {
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
          this.showLoader(true);

          await this.$store.dispatch(
            "features/central/user_group/actUpdateUserGroup",
            this.form.model
          );
          var response = this.$store.state.features.central.user_group
            .resultUpdate;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Update failed !"
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridUserGroup.doRefresh();
            this.resetForm();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }

          this.showLoader(false);
        } else {
          this.showLoader(true);

          await this.$store.dispatch(
            "features/central/user_group/actCreateUserGroup",
            this.form.model
          );

          var response = this.$store.state.features.central.user_group
            .resultCreate;

          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Submit failed !"
            );
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridUserGroup.doRefresh();
            this.resetForm();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }

          this.showLoader(false);
        }
      }
    }
  };
</script>
