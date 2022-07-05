<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Company Security</span>
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
                <b-col sm="4">
                  <validation-provider name="User Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>User Name</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.UserName"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="user-name-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="isShowUser=true">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="user-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="Company Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Company Name</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.CompanyName"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="company-name-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="isShowCompany=true">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="company-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
                  </validation-provider>
                </b-col>

                <b-col sm="4">
                  <validation-provider name="Security Role"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <label>Security Role Name</label>
                    <b-input-group prepend>
                      <b-form-input size="sm"
                                    v-model="form.model.RoleName"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="security-role-feedback"></b-form-input>
                      <b-input-group-append>
                        <b-button size="sm" variant="outline-primary" @click="isShowSecurityRole=true">
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                      <b-form-invalid-feedback id="security-role-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-input-group>
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
          <DataGrid ref="gridCompanySecurity"
                    :fields="headerFields"
                    :items="this.$store.state.features.central.company_security.data"
                    :info="this.$store.state.features.central.company_security.listInfo"
                    :baseUrl="this.$store.state.features.central.company_security.baseUrl"
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

    <!-- == MODAL == -->

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowUser" hide-footer size="lg">
        <template v-slot:modal-title>
          Select User
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridUser"
                      :fields="[{label: 'User Name', key: 'UserFullName', align: 'text-center'},
                      {label: 'Email Address', key: 'EmailAddress'},
                      {label: 'User Group', key: 'UserGroupCode'}]"
                      :items="this.$store.state.features.central.user.data"
                      :info="this.$store.state.features.central.user.listInfo"
                      :baseUrl="this.$store.state.features.central.user.baseUrl"
                      :actGetData="handleGetUser"
                      :selectedItem="form.model.UserName"
                      selectedFieldName="UserFullName"
                      :actSelectRow="handleSelectUser"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowCompany" hide-footer size="lg">
        <template v-slot:modal-title>
          Select Company Name
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridCompany"
                      :fields="[{label: 'Company Name', key: 'CompanyName', align: 'text-center'},
                      {label: 'Database', key: 'DatabaseId'}]"
                      :items="this.$store.state.features.central.company.data"
                      :info="this.$store.state.features.central.company.listInfo"
                      :baseUrl="this.$store.state.features.central.company.baseUrl"
                      :actGetData="handleGetCompany"
                      :selectedItem="form.model.CompanyName"
                      selectedFieldName="CompanyName"
                      :actSelectRow="handleSelectCompany"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div>

    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowSecurityRole" hide-footer>
        <template v-slot:modal-title>
          Select Security Role
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridSecurityRole"
                      :fields="[{label: 'Role Code', key: 'RoleCode', align: 'text-center', width: 150},
                      {label: 'Role Name', key: 'RoleName'}]"
                      :items="this.$store.state.features.central.security_role.data"
                      :info="this.$store.state.features.central.security_role.listInfo"
                      :baseUrl="this.$store.state.features.central.security_role.baseUrl"
                      :actGetData="handleGetSecurityRole"
                      :selectedItem="form.model.RoleName"
                      selectedFieldName="RoleName"
                      :actSelectRow="handleSelectSecurityRole"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter
                      :itemsPerPage="perPage"></SelectGrid>
        </div>
      </b-modal>
    </div>

  </div>
</template>
<script>

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from '@/components/Tables/SelectGrid';
  import loginServices from '../services/loginservices'

  export default {
    name: 'Company',
    layout: 'dashboard',
    components: {
      DataGrid,
      SelectGrid
    },
    data: () => {
      return {
        caption: 'Company Security',
        isForm: false,
        isShowUser: false,
        isShowCompany: false,
        isShowSecurityRole: false,
        perPage: 10,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'UserName',
            label: 'User Name',
            classes: 'text-center',
            filter: true

          },
          {
            key: 'CompanyName',
            label: 'Company Name',
            filter: true
          },
          {
            key: 'RoleName',
            label: 'Security Role Name',
            filter: true
          },
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            CompanySecurityId: null,
            UserId: '',
            UserName: '',
            CompanyId: '',
            CompanyName: '',
            RoleId: '',
            RoleName: ''
          },
        }
      }
    },
    async mounted() {

      await this.$store.dispatch(
        "features/central/user/actGetUser",
        "User?Inactive=false"
      );

      await this.$store.dispatch(
        "features/central/company/actGetCompany",
        "Company?Inactive=false"
      );

      await this.$store.dispatch(
        "features/central/security_role/actGetSecurityrole",
        "SecurityRole?"
      );

      if (this.$refs.gridCompanySecurity != null) {
        await this.$refs.gridCompanySecurity.doRefresh()
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

      async handleGet(url) {
        await this.$store.dispatch('features/central/company_security/actGet', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },

      async handleGetUser(url) {

        if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("User") < 0) {
          url = "User?" + url;
        }

        await this.$store.dispatch(
          "features/central/user/actGetUser",
          url
        );

        if (this.$refs.gridUser != undefined)
          this.$refs.gridUser.doRefresh();
      },
      async handleSelectUser(row) {
        this.form.model.UserId = row.UserId;
        this.form.model.UserName = row.UserFullName;
        this.isShowUser = false;
      },

      async handleGetCompany(url) {

        if (url.toLowerCase().lastIndexOf("InActive") < 0) {
          url = url + "&InActive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&InActive"));
          url =
            clean_uri + "&InActive=false";
        }

        if (url.lastIndexOf("Company") < 0) {
          url = "Company?" + url;
        }

        await this.$store.dispatch(
          "features/central/company/actGetCompany",
          url
        );
        this.$refs.gridCompany.doRefresh();
      },
      async handleSelectCompany(row) {
        this.form.model.CompanyId = row.CompanyId;
        this.form.model.CompanyName = row.CompanyName;
        this.isShowCompany = false;
      },

      async handleGetSecurityRole(url) {
        await this.$store.dispatch(
          "features/central/security_role/actGetSecurityrole",
          url
        );
        this.$refs.gridSecurityRole.doRefresh();
      },
      async handleSelectSecurityRole(row) {
        this.form.model.RoleId = row.RoleId;
        this.form.model.RoleName = row.RoleName;
        this.isShowSecurityRole = false;
      },

      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.CompanySecurityId = ''
        this.form.model.UserId = ''
        this.form.model.UserName = ''
        this.form.model.CompanyId = ''
        this.form.model.CompanyName = ''
        this.form.model.RoleId = ''
        this.form.model.RoleName = ''
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
        this.form.model.CompanySecurityId = row.CompanySecurityId;
        this.form.model.UserId = row.UserId;
        this.form.model.UserName = row.UserName;
        this.form.model.CompanyId = row.CompanyId;
        this.form.model.CompanyName = row.CompanyName;
        this.form.model.RoleId = row.RoleId
        this.form.model.RoleName = row.RoleName;
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
          "features/central/company_security/actDelete",
          row
        );

        var response = this.$store.state.features.central.company_security.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridCompanySecurity.doRefresh();

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
            "features/central/company_security/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.central.company_security
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridCompanySecurity.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");
            this.resetForm();

          }
        } else {
          await this.$store.dispatch(
            "features/central/company_security/actCreate",
            this.form.model
          );

          var response = this.$store.state.features.central.company_security.resultCreate;

          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            //util.showToast('Company', 'info', "Save Success");
            this.$refs.gridCompanySecurity.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
            this.resetForm();
          }
        }
      },
    }
  }
</script>
