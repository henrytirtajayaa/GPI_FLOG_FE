<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">User</span>
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
                  <validation-provider name="EmailAddress"
                                       :rules="{ required: true , regex:  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="DatabaseId">Email Address</label>
                      <b-form-input name="EmailAddress"
                                    type="email"
                                    placeholder="Email Address"
                                    v-model="form.model.EmailAddress"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="email-user-feedback" />
                      <b-form-invalid-feedback id="email-user-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="UserPassword"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserPassword">Password</label>
                      <b-form-input name="UserPassword"
                                    type="password"
                                    placeholder="Password"
                                    size="sm"
                                    v-model="form.model.UserPassword"
                                    :state="validateState(validationContext)"
                                    aria-describedby="user-id-feedback" />
                      <b-form-invalid-feedback id="user-pass-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">

                  <validation-provider name="UserFullName"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserFullName">Full Name</label>
                      <b-form-input name="UserFullName"
                                    type="text"
                                    placeholder="Full Name"
                                    v-model="form.model.UserFullName"
                                    :state="validateState(validationContext)"
                                    size="sm"
                                    aria-describedby="user-name-feedback" />
                      <b-form-invalid-feedback id="user-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col sm="3">

                  <label size="sm">User Group Code</label>
                  <b-input-group prepend>
                    <b-form-input v-model="form.model.UserGroupCode"
                                  readonly
                                  size="sm"
                                  aria-describedby="user-group-feedback"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-success" @click="isShowUserGroup=true" size="sm">
                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                      </b-button>
                      <b-button variant="outline-success" @click="onModaldelete" size="sm">
                        <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
                      </b-button>
                    </b-input-group-append>

                  </b-input-group>

                </b-col>
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
          <DataGrid ref="gridUser"
                    :fields="headerFields"
                    :items="this.$store.state.features.central.user.data"
                    :info="this.$store.state.features.central.user.listInfo"
                    :baseUrl="this.$store.state.features.central.user.baseUrl"
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
      <b-modal v-model="isShowUserGroup" hide-footer size="xl">
        <template v-slot:modal-title>
          User Group
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridUserGroup"
                      :fields="[{label: 'User Group Code', key: 'UserGroupCode', align: 'text-center', width:200},{label: 'User Group Name',key: 'UserGroupName'}]"
                      :items="this.$store.state.features.central.user_group.data"
                      :info="this.$store.state.features.central.user_group.listInfo"
                      :baseUrl="this.$store.state.features.central.user_group.baseUrl"
                      :actGetData="handleGetDataUserGroup"
                      :selectedItem="form.model.UserGroupCode"
                      selectedFieldName="UserGroupCode"
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
    name: 'User',
    layout: 'dashboard',
    components: {
      DataGrid, SelectGrid
    },
    data: () => {
      return {
        caption: 'User',
        isForm: false,
        isShowUserGroup: false,
        perPage: 20,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          { key: 'EmailAddress', label: 'Email Address', width: 300 },
          { key: 'UserFullName', label: 'Full Name', classes: 'text-center' },
          { key: 'UserGroupCode', label: 'User Group Code', width: 300 },
          {
            key: 'InActive',
            label: 'Status',
            _classes: 'text-center',
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
            UserId: null,
            UserFullName: "",
            EmailAddress: "",
            UserGroupCode: "",
            UserGroupId: "",
            UserPassword: '',
            InActive: false
          },
        }
      }
    },
    async mounted() {
      if (this.$refs.gridUser != null) {
        await this.$refs.gridUser.doRefresh()
      }
      await this.$store.dispatch("features/central/user_group/actGetUserGroup", "UserGroup"
      );
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async handleSelectData(row) {
        this.form.model.UserGroupId = row.UserGroupId;
        this.form.model.UserGroupCode = row.UserGroupCode;
        this.isShowUserGroup = false;
      },
      async handleGetDataUserGroup(url) {
        await this.$store.dispatch("features/central/user_group/actGetUserGroup", "UserGroup?");
      },
      async onModaldelete() {

        this.form.model.UserGroupId = "";
        this.form.model.UserGroupCode = "";

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
        await this.$store.dispatch('features/central/user/actGetUser', url)
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
        this.form.model.UserId = null
        this.form.model.UserFullName = ""
        this.form.model.EmailAddress = ""
        this.form.model.UserGroupId = ""
        this.form.model.UserGroupCode = ""
        this.form.model.UserPassword = ""
        this.form.model.InActive = false
        this.form.isEdit = false
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
        this.form.model.UserId = row.UserId;
        this.form.model.UserFullName = row.UserFullName;
        this.form.model.EmailAddress = row.EmailAddress;
        this.form.model.UserGroupId = row.UserGroupId;
        this.form.model.UserGroupCode = row.UserGroupCode;
        this.form.model.UserPassword = row.UserPassword;
        this.form.model.InActive = (row.InActive.toLowerCase() == 'inactive' ? true : false);
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
        await this.$store.dispatch("features/central/user/actDelete", row);

        var response = this.$store.state.features.central.user.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridUser.doRefresh();

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
            "features/central/user/actUpdateUser",
            this.form.model
          );
          var response = this.$store.state.features.central.user
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridUser.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/central/user/actCreateUser", this.form.model);

          var response = this.$store.state.features.central.user.resultCreate;
          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridUser.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }
      },
    }
  }
</script>
