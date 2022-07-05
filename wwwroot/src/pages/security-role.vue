<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
        <b-col sm="4" class="mb-2" id="resolution-show">
          <h5>
            <font-awesome-icon :icon="['fas', 'exclamation-circle']"/>
            Please Use Your Device in Landscape Mode</h5>
        </b-col>
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)" id="resolution">

        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Security Role</span>
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

                  <validation-provider name="RoleCode"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="UserFullName">Role Code</label>
                      <b-form-input name="RoleCode"
                                    type="text"
                                    placeholder="Role Code"
                                    v-model="form.model.RoleCode"
                                    :state="validateState(validationContext)"
                                    :disabled="form.isEdit"
                                    aria-describedby="role-code-feedback" />
                      <b-form-invalid-feedback id="role-code-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="3">
                  <validation-provider name="RoleName"
                                       :rules="{ required: true }"
                                       v-slot="validationContext">
                    <b-form-group>
                      <label for="RoleName">Role Name</label>
                      <b-form-input name="RoleName"
                                    type="text"
                                    placeholder="RoleName"
                                    v-model="form.model.RoleName"
                                    :state="validateState(validationContext)"
                                    aria-describedby="role-name-feedback" />
                      <b-form-invalid-feedback id="role-name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-tabs pills card>
                <b-tab active @click="isTabMain=true" >
                  <template v-slot:title>
                    <font-awesome-icon :icon="['fas', 'credit-card']" />&nbsp;Form
                  </template>
                  <GridRole ref="gridRole" :items="items" :isNew="isForm" :dataAnother="anotherData" @newdata="DataRole($event)" @search="Search" @refresh="Refresh" @AddRole="AddRole" @deleteAll="deleteAll"></GridRole>
                </b-tab>
                <b-tab  @click="isTabMain=false" >
                  <template v-slot:title>
                    <font-awesome-icon :icon="['fas', 'braille']" />&nbsp;Smartview
                  </template>
                  <SmartviewRole :items="itemssmart" :isNew="isForm" :dataAnother="anotherDataSmart" @search="SearchSmart" @refresh="RefreshSmart" @AddRole="AddRoleSmart" @deleteAll="deleteSmartAll"></SmartviewRole>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
    <b-row v-show="!isForm">
      <b-col cols="12" sm="12">
        <b-card width="100%">
          <DataGrid ref="gridSecurityRole"
                    :fields="headerFields"
                    :items="this.$store.state.features.central.security_role.data"
                    :info="this.$store.state.features.central.security_role.listInfo"
                    :baseUrl="this.$store.state.features.central.security_role.baseUrl"
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

  import DataGrid from '@/components/Tables/DataGrid';
  import SelectGrid from "@/components/tables/SelectGrid";
  import GridRole from "@/components/tables/GridRole";
  import SmartviewRole from "@/components/tables/SmartviewRole";
  import loginServices from '../services/loginservices'
  export default {
    name: 'SecurityRoles',
    layout: 'dashboard',
    components: {
      DataGrid, SelectGrid, GridRole,SmartviewRole
    },
    data: () => {
      return {
        isTabMain: true,
        items: [],
        itemssmart: [],
        oriData: [],
        anotherData: [],
        anotherDataSmart: [],
        caption: 'Security Roles',
        isForm: false,
        headerFields: [
          { key: 'RoleCode', label: 'Role Code', classes: 'text-center' },
          { key: 'RoleName', label: 'Role Name' },
        ],
        selected: null,
        alert: '',
        ErrorMessage: '',
        form: {
          valid: false,
          isEdit: false,
          model: {
            RoleId: null,
            RoleCode: "",
            RoleName: "",
            RoleAccess: [],
            RoleSmart: []
          },
        }
      }
    },
    computed: {
      tableClasses() {
        return [
          "table",
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
      },
    },
    async mounted() {
      if (this.$refs.gridSecurityRole != null) {
        await this.$refs.gridSecurityRole.doRefresh()
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
      async handleGetData(url) {
        await this.$store.dispatch('features/central/security_role/actGetSecurityrole', url)
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onFormClose() {
        this.ErrorMessage = ''
        this.isForm = false
        this.form.isEdit = false;
        await this.$refs.gridRole.cleardataDelete()

        this.resetForm();
      },
      async onFormCreate() {
        await this.$refs.gridRole.cleardataDelete()
        this.items = [];
        this.itemssmart = [];
        this.resetForm();
        this.ErrorMessage = ''
        this.form.model.RoleId = "";
        this.form.model.RoleCode = "";
        this.form.model.RoleName = "";
        this.anotherData = [];
        this.anotherDataSmart = [];

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
        var arr = [];
        this.ErrorMessage = '';
        this.anotherData = [];
        this.anotherDataSmart = [];
        this.form.model.RoleId = row.RoleId;
        this.form.model.RoleCode = row.RoleCode;
        this.form.model.RoleName = row.RoleName;

        var response = await this.$store.dispatch(
          "features/central/security_role/actGetSecurityroleDetail",
          this.form.model
        );
        if (response.status == 200) {
          this.items = response.data.SecurityRoles[0].RoleAccess;
        }
        var smart = await this.$store.dispatch("features/central/security_role/actGetSecurityroleSmartview",this.form.model);
        if (smart.status == 200) {
          smart.data.SmartRoles.forEach(function (row, index) {
            if (row.SmartView != null) 
                arr.push(row.SmartView);
          });
          this.itemssmart = arr;
        }

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
        await this.$store.dispatch("features/central/security_role/actDeleteSecurityrole", row);

        var response = this.$store.state.features.central.security_role.resultDelete;
        if (response.status != 200) {
          this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
        } else {
          this.$refs.gridSecurityRole.doRefresh();

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
      ItemData(FormId) {

        var value = true;
        for (var z = 0; z < this.items.length; z++) {
          if (FormId == this.items[z].FormId)
            value = false;
        }
        return value;
      },
      async onSubmit() {
        this.IsRowForm = false;
        var arr = [];
        var arrsmart = [];
        var another = [];
        var anotherSmart = [];
        this.items.forEach(function (row, index) {
          arr.push({
            "FormId": row.FormId,
            "AllowAccessNew": row.AllowAccessNew,
            "AllowAccessOpen": row.AllowAccessOpen,
            "AllowAccessEdit": row.AllowAccessEdit,
            "AllowAccessDelete": row.AllowAccessDelete,
            "AllowAccessPost": row.AllowAccessPost,
            "AllowAccessPrint": row.AllowAccessPrint
          })
        });
        this.itemssmart.forEach(function (row, index) {
          arrsmart.push({"SmartviewId":row.SmartviewId})
        });
        for (var i = 0; i < this.anotherData.length; i++) {
          if (this.ItemData(this.anotherData[i].FormId))
            another.push({ "FormId": this.anotherData[i].FormId, "AllowAccessNew": this.anotherData[i].AllowAccessNew, "AllowAccessOpen": this.anotherData[i].AllowAccessOpen, "AllowAccessEdit": this.anotherData[i].AllowAccessEdit, "AllowAccessDelete": this.anotherData[i].AllowAccessDelete, "AllowAccessPost": this.anotherData[i].AllowAccessPost, "AllowAccessPrint": this.anotherData[i].AllowAccessPrint })
        }
        for (var i = 0; i < this.anotherDataSmart.length; i++) {
          if (this.ItemData(this.anotherDataSmart[i].FormId))
             anotherSmart.push({"SmartviewId":this.anotherData[i].SmartviewId})
        }

        const array3 = another.concat(arr);
        const arraySmart = anotherSmart.concat(arrsmart);

        this.form.model.RoleAccess = array3;
        this.form.model.RoleSmart = arraySmart;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/central/security_role/actUpdateSecurityrole", this.form.model);
          var response = this.$store.state.features.central.security_role.resultUpdate;

          if (response.status != 200) {
            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);
          } else {
            this.isForm = false;
            this.form.isEdit = false;

            this.$refs.gridSecurityRole.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully updated");

          }
        } else {
          await this.$store.dispatch(
            "features/central/security_role/actCreateSecurityrole", this.form.model);

          var response = this.$store.state.features.central.security_role.resultCreate;
          if (response.status != 200) {

            this.handleToast('Confirmation', 'danger', response.data.ErrorDescription);

          } else {
            this.isForm = false;
            this.form.isEdit = false;
            this.$refs.gridSecurityRole.doRefresh();

            this.handleToast('Confirmation', 'success', "Successfully saved");
          }
        }
      },
      async DataRole(row) {
        this.items = row;
      },
      async deleteAll() {
        this.items = [];
      },
      async deleteSmartAll() {
        this.itemssmart = [];
      },
      async Search(Search, oridata, anotherdata) {
        this.items = Search;
        this.oriData = oridata;
        this.anotherData = anotherdata;
      },
      async SearchSmart(Search, oridata, anotherdata) {
        this.itemssmart = Search;
        this.oriData = oridata;
        this.anotherDataSmart = anotherdata;
      },
      async Refresh(data) {
        this.items = [];
        this.items = data;
      },
      async RefreshSmart(data) {
        this.itemssmart = [];
        this.itemssmart = data;
      },
      async AddRole(itemsForms) {
        var role = [];
        if (this.items.length == 0) {
          itemsForms.forEach(function (entry, index) {
            if (entry.Status == true) {
              role.push({ SecurityRoleAccessId: "", SecurityRoleId: "", FormId: entry.FormId, Name: entry.FormName, AllowAccessOpen: true, AllowAccessNew: false, AllowAccessEdit: false, AllowAccessDelete: false, AllowAccessPost: false, AllowAccessPrint: false })
            }
          });
          this.items = role;
        } else {
          itemsForms.forEach(function (entry, index) {
            if (entry.Status == true) {
              role.push({ SecurityRoleAccessId: "", SecurityRoleId: "", FormId: entry.FormId, Name: entry.FormName, AllowAccessOpen: true, AllowAccessNew: false, AllowAccessEdit: false, AllowAccessDelete: false, AllowAccessPost: false, AllowAccessPrint: false })
            }
          });
          this.items = this.items.concat(role);
        }
        // this.breweries = this.items.splice(this.currentPage - 1, 10);

        this.items.sort(function (x, y) {
          let a = x.Name.toUpperCase(),
            b = y.Name.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });


      },
      async AddRoleSmart(itemsForms) {
        //console.log(itemsForms);
        var role = [];
        this.itemssmart = itemsForms;
        //if (this.itemssmart.length == 0) {
        //  itemsForms.forEach(function (entry, index) {
        //    alert()
        //    role.push({"SmartviewId":entry.SmartviewId},{"SmartTitle":entry.SmartTitle},{"SqlViewName":entry.SqlViewName},{"GroupName":entry.GroupName})
        //  });
          
        //}
        //  else {
        //  itemsForms.forEach(function (entry, index) {
        //    role.push({"SmartviewId":entry.SmartviewId},{"SmartTitle":entry.SmartTitle},{"SqlViewName":entry.SqlViewName},{"GroupName":entry.GroupName})
        //  });
        //  this.itemssmart = role;
        //}
        
      

      },  

    }
  }
</script>

<style scoped>
  #resolution-show{
      display:none;
    }
    
@media only screen and (max-width: 720px) {
    #resolution{
      display:none;
    }

    #resolution-show{
      display:inline-block;
    }
}
</style>

