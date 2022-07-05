<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Sales Person</span>
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
                  <validation-provider name="Sales Code"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="SalesCode">Sales Code</label>
                      <b-form-input name="SalesCode"
                                    type="text"
                                    placeholder="Sales Code"
                                    v-model="form.model.SalesCode"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    :disabled="form.isEdit"
                                    aria-describedby="sales-code-feedback" />
                      <b-form-invalid-feedback id="sales-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="Sales Name"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="SalesName">Sales Name</label>
                      <b-form-input name="SalesName"
                                    type="text"
                                    placeholder="Sales Name"
                                    size="sm"
                                    v-model="form.model.SalesName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="sales-name-feedback" />
                      <b-form-invalid-feedback id="sales-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <input type="hidden" v-model="form.model.PersonId"/>
                <b-col sm="3">

                  <label size="sm">User Login Name</label>
                  <b-input-group prepend>
                    <b-form-input v-model="form.model.PersonFullName"
                                  readonly
                                  size="sm"
                                  aria-describedby="user-group-feedback"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-primary" @click="isShowUser=true" size="sm">
                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                      </b-button>
                      <b-button variant="outline-danger" @click="onModaldelete" v-if="form.model.PersonFullName" size="sm">
                        <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                      </b-button>
                    </b-input-group-append>

                  </b-input-group>

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
          <DataGrid ref="gridSalesPerson"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.sales_person.data"
                    :info="this.$store.state.features.company.sales_person.listInfo"
                    :baseUrl="this.$store.state.features.company.sales_person.baseUrl"
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
      <b-modal v-model="isShowUser" hide-footer size="xl">
        <template v-slot:modal-title>
          User Group
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridUser"
                      :fields="[{label: 'User Full Name',key: 'UserFullName'}]"
                      :items="this.$store.state.features.central.user.data"
                      :info="this.$store.state.features.central.user.listInfo"
                      :baseUrl="this.$store.state.features.central.user.baseUrl"
                      :actGetData="handleGetDataUser"
                      :selectedItem="form.model.PersonId"
                      selectedFieldName="UserId"
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
        caption: 'Sales Person',
        isForm: false,
        isShowUser: false,
        perPage: 20,
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          { key: 'SalesCode', label: 'Sales Code', width: 300 },
          { key: 'SalesName', label: 'Sales Name', classes: 'text-center' },
          { key: 'PersonFullName', label: 'User Login Name', width: 300, filter: false }
        ],
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            SalesPersonId: "00000000-0000-0000-0000-000000000000",
            SalesCode: "",
            SalesName: "",
            PersonId: "00000000-0000-0000-0000-000000000000",
            PersonFullName: ""
          },
        }
      }
    },
    async mounted() {
      if (this.$refs.gridSalesPerson != null) {
        await this.$refs.gridSalesPerson.doRefresh()
      }
      await this.$store.dispatch("features/central/user/actGetUser", "User"
      );
    },
    computed: {
      isSave() {
        return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
      }
    },
    methods: {
      async handleSelectData(row) {
        this.form.model.PersonId = row.UserId;
        this.form.model.PersonFullName = row.UserFullName;
        this.isShowUser = false;
      },
      async handleGetDataUser(url) {
        await this.$store.dispatch("features/central/user/actGetUser", "User?");
      },
      async onModaldelete() {

        this.form.model.PersonId = "00000000-0000-0000-0000-000000000000";
        this.form.model.PersonFullName = "";

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
        await this.$store.dispatch('features/company/sales_person/actGetSalesPerson', url)
        //await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
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
        this.form.model.SalesPersonId = null
        this.form.model.SalesCode = ""
        this.form.model.SalesName = ""
        this.form.model.PersonId = "00000000-0000-0000-0000-000000000000";
        this.form.model.PersonFullName = "";
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
        this.form.model.SalesPersonId = row.SalesPersonId;
        this.form.model.SalesCode = row.SalesCode;
        this.form.model.SalesName = row.SalesName;
        this.form.model.PersonId = row.PersonId;
        this.form.model.PersonFullName = row.PersonFullName;
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
        await this.$store.dispatch("features/company/sales_person/actDelete", row);

        var response = this.$store.state.features.company.sales_person.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridSalesPerson.doRefresh();

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
            "features/company/sales_person/actUpdateSalesPerson",
            this.form.model
          );
          var response = this.$store.state.features.company.sales_person
            .resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridSalesPerson.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/company/sales_person/actCreateSalesPerson", this.form.model);

          var response = this.$store.state.features.company.sales_person.resultCreate;
          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridSalesPerson.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }
      },
    }
  }
</script>
