<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Approval Setup</span>
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
                  <validation-provider name="ApprovalCode"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ApprovalCode">Approval Code</label>
                      <b-form-input name="ApprovalCode"
                                    type="text"
                                    placeholder="Approval Code"
                                    v-model="form.model.ApprovalCode"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="ApprovalCode-feedback"
                                    :readonly="form.isEdit" />
                      <b-form-invalid-feedback id="ApprovalCode-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="5">
                  <validation-provider name="Description"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="ExchangeRateCode">Description</label>
                      <b-form-input name="Description"
                                    type="text"
                                    placeholder="Description"
                                    v-model="form.model.Description"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    aria-describedby="Description-feedback" />
                      <b-form-invalid-feedback id="Description-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-card>
                <div slot="header">
                  <b-row>
                    <b-col lg="1">
                      <b-form-radio v-model="User" v-on:change="clickUser()" name="some-radios" value="Email">Email</b-form-radio>
                    </b-col>
                    <b-col lg="2">
                      <b-form-radio v-model="User" v-on:change="clickUser()" name="some-radios" value="User Group">User Group</b-form-radio>
                    </b-col>
                    <b-col lg="3">
                      <b-input-group prepend>
                        <b-form-input size="sm"
                                      v-model="userName"
                                      :placeholder="User"
                                      readonly></b-form-input>
                        <b-input-group-append style="height:70%;margin-top:5px;">
                          <b-button size="sm" variant="outline-primary" @click="showUser()">
                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-col>
                    <b-col lg="5">
                      <b-form-group>
                        <b-form-input name="Name"
                                      type="text"
                                      placeholder="Name"
                                      v-model="Name"
                                      size="sm"
                                      readonly />
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col lg="12">
                      <b-form-radio v-model="limit" name="limit-radios" :value="false">No Limit</b-form-radio>
                    </b-col>
                    <b-col lg="2">
                      <b-form-radio v-model="limit" name="limit-radios" :value="true">Limit Amount</b-form-radio>
                    </b-col>
                    <b-col lg="3" v-show="limit === true">
                      <validation-provider name="ApprovalLimit"
                                           :rules="{ required: true }"
                                           v-slot="validationContext">
                        <b-form-group>
                          <money v-model="ApprovalLimit" v-bind="moneyOptions" size="sm" class="currency-money-field "></money>
                          <b-form-invalid-feedback id="ApprovalLimit-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="3">
                      <b-form-group>
                        <b-button style="margin-top:20px;" variant="success" @click="onAddClick()">
                          <font-awesome-icon :icon="['fas', 'plus-square']" danger />&nbsp;Add Approver To Sequence
                        </b-button>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>

                <b-row style="overflow-x:auto;">
                  <table id="table-sub">
                    <thead>
                    <th class="text-center"></th>
                    <th class="text-left">Id / User Group</th>
                    <th class="text-center">Name</th>
                    <th class="text-center">Approval Level</th>
                    <th class="text-center">Approval Limit</th>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in itemDetails">
                        <td class="text-center">
                          <a href="javascript:;" @click="handleDeleteDetail(index)">
                            <font-awesome-icon :icon="['fas', 'trash']"  style="color:#c2185b;" />
                          </a>
                        </td>
                        <td>{{item.Id}}</td>
                        <td>{{item.PersonName}}</td>
                        <td class="text-center">{{item.Level}}</td>
                        <td class="text-center">{{item.ApprovalLimit}}</td>
                      </tr>
                    </tbody>
                  </table>
                </b-row>
              </b-card>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridApprovalSetup"
                    :fields="headerFields"
                    :items="this.$store.state.features.company.approval_setup.data"
                    :info="this.$store.state.features.company.approval_setup.listInfo"
                    :baseUrl="this.$store.state.features.company.approval_setup.baseUrl"
                    :actGetData="handleGetApprovalSetup"
                    :actCreate="onFormCreate"
                    :actEditRow="handleEdit"
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
                    :actDeleteRow="handleDelete"></DataGrid>
        </b-card>
      </b-col>
    </b-row>


    <!-- == MODAL == -->
    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowUser" v-if="User=='Email'" hide-footer size="lg">
        <template v-slot:modal-title>
          Select User
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridUser"
                      :fields="[{label: 'Email Address', key: 'EmailAddress'},
                      {label: 'User Full Name', key: 'UserFullName'}]"
                      :items="this.$store.state.features.central.user.data"
                      :info="this.$store.state.features.central.user.listInfo"
                      :baseUrl="this.$store.state.features.central.user.baseUrl"
                      :actGetData="handleGetUser"
                      :selectedItem="userName"
                      selectedFieldName="ApprovalCode"
                      :actSelectRow="handleSelectUser"
                      addTableClasses="table-bordered"
                      responsive
                      loading
                      hover
                      sorter
                      pagination
                      column-filter></SelectGrid>
        </div>
      </b-modal>
      <b-modal v-model="isShowUser" v-if="User=='User Group'" hide-footer size="lg">
        <template v-slot:modal-title>
          Select User
        </template>
        <div class="d-block text-center">
          <SelectGrid ref="gridUser"
                      :fields="[{label: 'User Group Code', key: 'UserGroupCode'},
                      {label: 'User Group Name', key: 'UserGroupName'}]"
                      :items="this.$store.state.features.central.user_group.data"
                      :info="this.$store.state.features.central.user_group.listInfo"
                      :baseUrl="this.$store.state.features.central.user_group.baseUrl"
                      :actGetData="handleGetUser"
                      :selectedItem="userName"
                      selectedFieldName="ApprovalCode"
                      :actSelectRow="handleSelectUser"
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
  import SelectGrid from '@/components/Tables/SelectGrid';
  import VueElementLoading from 'vue-element-loading';
  import loginServices from '@/services/loginservices'
  export default {
    name: 'Company',
    layout: 'dashboard',
    components: {
      DataGrid, VueElementLoading, SelectGrid
    },
    data: () => {
      return {
        caption: 'Approval Setup',
        blockLoader: false,
        isForm: false,
        User: "Email",
        userName: "",
        isShowUser: false,
        limit: false,
        Name: "",
        ApprovalLimit: "",
        itemDetails: [],
        //DataGrid HEADERS Declarations, you can
        headerFields: [
          {
            key: 'ApprovalCode',
            label: 'Approval Code',
            classes: 'text-center',
            width: 200,
          },
          {
            key: 'Description',
            label: 'Description',
          }
        ],
        moneyOptions: {
          decimal: ',',
          thousands: '.',
          prefix: '',
          suffix: '',
          decimalLength: 2,
          masked: false,
          allowBlank: false,
          min: 0,
          //max: Number.MAX_SAFE_INTEGER
        },
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            ApprovalSetupHeaderId: null,
            ApprovalCode: "",
            Description: "",
            Status: "",
            ApprovalSetupDetails: []
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
      if (this.$refs.gridApprovalSetup != null) {
        await this.$refs.gridApprovalSetup.doRefresh()
      }
    },
    methods: {
      async showUser() {
        this.isShowUser = true
        await this.$store.dispatch("features/central/user/actGetUser", "user?InActive=false");
        await this.$store.dispatch("features/central/user_group/actGetUserGroup", "usergroup?");
      },
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
      async handleGetApprovalSetup(url) {
        await this.$store.dispatch("features/company/approval_setup/actGetData",url);
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onAddClick() {
        if (this.userName == "") {
          this.handleToast('Confirmation', 'danger', "Please select an email or user group.");
        } else {
          if (this.index != "") {
            this.itemDetails.splice(this.index, 1);
          }

          let newLevel = (this.itemDetails.length + 1);
          this.itemDetails.push({
            Index: this.itemDetails.length,
            Id: this.userName,
            PersonId: this.PersonId,
            PersonCategoryId: this.PersonCategoryId,
            PersonName: this.Name,
            Level: newLevel,
            ApprovalLimit: (this.limit ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(this.ApprovalLimit) : 0),
            ApprovalLimitValue: (this.limit ? this.ApprovalLimit : 0)
          });

          this.Name = "";
          this.userName = "";
          this.limit = false;
          this.ApprovalLimit = 0;
          this.PersonId = '';
          this.PersonCategoryId = null;
          this.index = "";
        }
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

        if (url.lastIndexOf("user") < 0) {
          url = "user?" + url;
        }
       

      

        await this.$store.dispatch("features/central/user/actGetUser", url);
        await this.$store.dispatch("features/central/user_group/actGetUserGroup", url);
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;

        this.resetForm();
      },
      async onFormCreate() {
        this.ErrorMessage = ''
        this.form.model.ApprovalSetupHeaderId = "";
        this.form.model.ApprovalCode = "";
        this.form.model.Description = "";
        this.form.model.Status = 1;
        this.ApprovalLimit = 0;
        this.limit = false;
        this.itemDetails = [];
        this.IsRowForm = true;
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
      async handleSelectUser(row) {
        if (this.User == "Email") {
          this.PersonId = row.UserId;
          this.PersonCategoryId = null;
          this.userName = row.EmailAddress;
          this.Name = row.UserFullName;
        } else {
          this.PersonId = "";
          this.PersonCategoryId = row.UserGroupId;
          this.userName = row.UserGroupCode;
          this.Name = row.UserGroupName;
        }

        this.isShowUser = false;
      },
      async handleEdit(row) {
        this.itemDetails = []
        this.ErrorMessage = '';
        this.isForm = true;
        this.form.model.ApprovalSetupHeaderId = row.ApprovalSetupHeaderId;
        this.form.model.ApprovalCode = row.ApprovalCode;
        this.form.model.Description = row.Description;
        this.form.model.Status = row.Status;
        var response = await this.$store.dispatch(
          "features/company/approval_detail/actGetData",
          this.form.model
        );
        if (response.status == 200) {
          var arrData = []
          response.data.ApprovalSetupDetail.forEach(function (row, index) {
            arrData.push({
              ApprovalSetupDetailId: row.ApprovalSetupDetailId,
              ApprovalSetupHeaderId: row.ApprovalSetupHeaderId,
              PersonId: row.PersonId,
              PersonName: row.PersonName,
              Id: row.Id,
              PersonCategoryId: row.PersonCategoryId,
              Description: row.Description,
              Level: row.Level,
              HasLimit: row.HasLimit,
              Status: row.status,
              ApprovalLimit: (row.HasLimit ? new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(row.ApprovalLimit) : 0),
              ApprovalLimitValue: (row.HasLimit ? row.ApprovalLimit : 0)
            });
          });
          this.itemDetails = arrData

        }
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
      async clickUser() {
        this.userName = "";
        this.Name = "";
      },
      async onSubmit() {
        this.showLoader(true);
        var arr = [];
        this.itemDetails.forEach(function (row, index) {
          arr.push({
            Description: "",
            PersonId: row.PersonId,
            PersonCategoryId: row.PersonCategoryId,
            Level: row.Level,
            HasLimit: (row.ApprovalLimit == 0 ? 1 : 2),
            ApprovalLimit: row.ApprovalLimitValue,
            Status: 1
          });
        });

        this.form.model.ApprovalSetupDetails = arr;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/approval_setup/actUpdateApprovalSetup",
            this.form.model
          );
          var response = this.$store.state.features.company.approval_setup
            .resultUpdate;
          if (response.status != 200) {
            //this.ErrorMessage = response.data.ErrorDescription
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.IsRowForm = false;
            this.isForm = false;
            this.ErrorMessage = "";
            this.handleToast('Confirmation', 'success', "Successfully updated");
            this.$refs.gridApprovalSetup.doRefresh();
            this.isForm = false;
          }
        } else {
          await this.$store.dispatch(
            "features/company/approval_setup/actCreateApprovalSetup",
            this.form.model
          );
          var response = this.$store.state.features.company.approval_setup
            .resultCreate;
          if (response.status != 200) {
            this.isForm = false;
            this.IsRowForm = false;
            this.ErrorMessage = response.data.ErrorDescription;
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.IsRowForm = false;
            this.ErrorMessage = "";
            this.ErrorMessage = "";
            this.handleToast('Confirmation', 'success', "Successfully saved");

            this.$refs.gridApprovalSetup.doRefresh();
            this.isForm = false;
          }
        }

        this.showLoader(false);
      },

      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch(
          "features/company/approval_setup/actDelete",
          row
        );

        var response = this.$store.state.features.company.approval_setup.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridApprovalSetup.doRefresh();
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
      handleDeleteDetail(row) {
        this.$bvModal.msgBoxConfirm('Are you sure?', {
          title: 'Delete Confirmation', size: 'sm', buttonSize: 'sm',
          okVariant: 'blue', centered: true,
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
        })
          .then(result => {
            if (result) {
              //Do remove row
              this.itemDetails.splice(row, 1);

              this.itemDetails = this.itemDetails.sort(function (a, b) {
                return a[0] - b[0];
              });

              //Reorder array index
              let indexNo = 1;
              for (var i = 0; i < this.itemDetails.length; i++) {
                this.itemDetails[i]['Index'] = i;
                this.itemDetails[i]['Level'] = indexNo;
                indexNo++;
              }
            }
          })
          .catch(err => {
            // An error occurred
          })
      },
    }
  }
</script>

<style scoped>

  #table-sub {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

    #table-sub th {
      border: 1px solid #ddd;
      padding: 5px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center !important;
      height: 20px !important;
    }

    #table-sub td {
      border: 1px solid rgb(165,165,165);
      padding: 3px 8px !important;
      font-size: 13px;
      text-transform: uppercase;
    }

    #table-sub .v-input {
      font-size: 12px !important;
    }

    #table-sub td .v-text-field {
      font-size: 12px !important;
      padding: 5px 5px;
      margin-top: 1px;
    }

    #table-sub tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    #table-sub tr:hover {
      background-color: #ddd;
    }

    #table-sub th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #f0f3f5;
    }

  .btn-xsmall {
    height: 20px;
    width: 20px;
  }
</style>
