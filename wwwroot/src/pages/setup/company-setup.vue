<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Company Setup</span>
                <div right style="float:right;">
                  <b-button variant="blue" type="submit" v-show="isSave">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <b-button @click="isForm=true;showFileUpload=false" v-show="isForm==false">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Cancel
                  </b-button>
                  <b-button @click="onFormClose" v-show="isEdit">
                    <font-awesome-icon :icon="['fas', 'edit']" warning />&nbsp;Edit
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="9">
                  <b-row>
                    <b-col sm="8">
                      <validation-provider
                        name="Company"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <b-form-group>
                          <label for="CompanyName">Company Name</label>
                          <b-form-input
                            name="CompanyName"
                            type="text"
                            placeholder="Company name which displayed on company selection"
                            v-model="form.model.CompanyName"
                            size="sm"
                            class="font-weight-bold"
                            :state="validateState(validationContext)"
                            aria-describedby="company-name-feedback"
                            disabled
                          />
                          <b-form-invalid-feedback
                            id="company-name-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="6">
                      <validation-provider
                        name="Company Tax Name"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <b-form-group>
                          <label for="CompanyTaxName">Company Tax Name</label>
                          <b-form-input
                            name="CompanyTaxName"
                            type="text"
                            placeholder="CompanyTaxName"
                            v-model="form.model.CompanyTaxName"
                            size="sm"
                            :state="validateState(validationContext)"
                            aria-describedby="CompanyTaxName-feedback"
                            :disabled="isForm==true"
                          />
                          <b-form-invalid-feedback
                            id="CompanyTaxName-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    <b-col sm="4">
                      <validation-provider
                        name="Tax Registration No"
                        :rules="{ required: true }"
                        v-slot="validationContext"
                      >
                        <b-form-group v-b-tooltip.hover title="NPWP">
                          <label for="TaxRegistrationNo">Tax Registration No.</label>
                          <b-form-input
                            name="TaxRegistrationNo"
                            type="text"
                            placeholder="NPWP"
                            v-model="form.model.TaxRegistrationNo"
                            size="sm"
                            :state="validateState(validationContext)"
                            aria-describedby="TaxRegistrationNo-feedback"
                            :disabled="isForm==true"
                          />
                          <b-form-invalid-feedback
                            id="TaxRegistrationNo-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col sm="3">
                  <div id="app">
                    <label>Company Logo</label>
                    <div v-if="showFileUpload || form.model.LogoImageUrl == ''">                      
                      <div>
                      <input
                        type="file"
                        id="fileLogo"
                        ref="fileLogo"
                        accept="image/*"
                        @change="previewFiles"
                        :disabled="isForm==true"                        
                      />
                      </div>
                    </div>
                    <div v-else>
                      <img style="padding:1px;" v-if="!showFileUpload" :src="form.model.LogoImageUrl" width="100"/>
                      
                      <b-button variant="danger" size="sm" pill type="button" v-if="isForm==false" @click="showFileUpload=true">
                        <font-awesome-icon :icon="['fas', 'undo']" />&nbsp;Replace
                      </b-button>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <hr />
              <b-row class="mt-3">
                <b-col sm="2">
                  <validation-provider
                  name="Address Code"
                  :rules="{ required: true }"
                  v-slot="validationContext"
                >
                  <label>Address Code</label>
                  <b-input-group prepend>
                    <b-form-input
                      size="sm"
                      v-model="form.model.CompanyAddressName"
                      class="font-weight-bold"
                      readonly
                      :state="validateState(validationContext)"
                      aria-describedby="address-code-feedback"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        variant="outline-primary"
                        @click="isShowCompanyAddress=true"
                        v-show="isForm==false"
                      >
                        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                      </b-button>
                    </b-input-group-append>
                    <b-form-invalid-feedback
                      id="address-code-feedback"
                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                  </b-input-group>
                </validation-provider>
                </b-col>                  
              </b-row>
              <hr />
              <b-row>
                <b-col sm="3">
                  <b-form-group>
                    <label for="ContactPerson">Contact Person</label>
                    <b-form-input
                      name="ContactPerson"
                      type="text"
                      placeholder="Contact Person"
                      v-model="form.model.ContactPerson"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>

                <b-col sm="3">
                  <b-form-group>
                    <label for="Handphone">Handphone</label>
                    <b-form-input
                      name="Handphone"
                      type="text"
                      placeholder="Handphone"
                      v-model="form.model.Handphone"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>

                <b-col sm="6">
                  <b-form-group>
                    <label for="Address">Address</label>
                    <b-textarea
                      name="Address"
                      type="text"
                      placeholder="Address"
                      v-model="form.model.Address"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>

                <b-col sm="3">
                  <b-form-group>
                    <label for="Phone1">Phone 1</label>
                    <b-form-input
                      name="Phone1"
                      type="text"
                      placeholder="Phone1"
                      v-model="form.model.Phone1"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Extension1">Ext 1</label>
                    <b-form-input
                      name="Extension1"
                      type="text"
                      placeholder="Extension1"
                      v-model="form.model.Extension1"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="Phone1">Phone 2</label>
                    <b-form-input
                      name="Phone2"
                      type="text"
                      placeholder="Phone2"
                      v-model="form.model.Phone2"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Extension2">Ext 2</label>
                    <b-form-input
                      name="Extension2"
                      type="text"
                      placeholder="Extension2"
                      v-model="form.model.Extension2"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="Fax">Fax</label>
                    <b-form-input
                      name="Fax"
                      type="text"
                      placeholder="Fax"
                      v-model="form.model.Fax"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="EmailAddress">Email Address</label>
                    <b-form-input
                      name="EmailAddress"
                      type="text"
                      placeholder="EmailAddress"
                      v-model="form.model.EmailAddress"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="Homepage">Homepage</label>
                    <b-form-input
                      name="Homepage"
                      type="text"
                      placeholder="Homepage"
                      v-model="form.model.HomePage"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group v-b-tooltip.hover title="Nomor RT.">
                    <label for="Neighbourhood">Neighbourhood</label>
                    <b-form-input
                      name="Neighbourhood"
                      type="text"
                      placeholder="Neighbourhood"
                      v-model="form.model.Neighbourhood"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group v-b-tooltip.hover title="Nomor RW.">
                    <label for="Hamlet">Hamlet</label>
                    <b-form-input
                      name="Hamlet"
                      type="text"
                      placeholder="Hamlet"
                      v-model="form.model.Hamlet"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group v-b-tooltip.hover title="Kelurahan">
                    <label for="UrbanVillage">Urban Village</label>
                    <b-form-input
                      name="UrbanVillage"
                      type="text"
                      placeholder="Urban Village"
                      v-model="form.model.UrbanVillage"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group v-b-tooltip.hover title="Kecamatan">
                    <label for="SubDistrict">Sub District</label>
                    <b-form-input
                      name="SubDistrict"
                      type="text"
                      placeholder="Sub District"
                      v-model="form.model.SubDistrict"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="CityCode">City Code</label>
                    <b-form-input
                      name="CityCode"
                      type="text"
                      placeholder="CityCode"
                      v-model="form.model.CityCode"
                      size="sm"
                      disabled
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
    <div id="page-dialogs" height="100%">
      <b-modal v-model="isShowCompanyAddress" hide-footer size="lg">
        <template v-slot:modal-title>Select Address</template>
        <div class="d-block text-center">
          <SelectGrid
            ref="gridCompanyAddress"
            :fields="[{label: 'Code', key: 'AddressCode', align: 'text-center'},
                      {label: 'Name', key: 'AddressName'}]"
            :items="this.$store.state.features.company.company_address.data"
            :info="this.$store.state.features.company.company_address.listInfo"
            :baseUrl="this.$store.state.features.company.company_address.baseUrl"
            :actGetData="handleGetCompanyAddress"
            :selectedItem="form.model.CompanyAddressId"
            selectedFieldName="CompanyAddressId"
            :actSelectRow="handleSelectCompanyAddress"
            addTableClasses="table-bordered"
            responsive
            loading
            hover
            sorter
            pagination
            column-filter
          ></SelectGrid>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import DataGrid from "@/components/Tables/DataGrid";
import VueElementLoading from "vue-element-loading";
import SelectGrid from "@/components/Tables/SelectGrid";
import loginServices from "@/services/loginservices";

export default {
  name: "CompanySetup",
  layout: "dashboard",
  components: {
    DataGrid,
    VueElementLoading,
    SelectGrid
  },
  data: () => {
    return {
      isShowCompanyAddress: false,
      caption: "Company",
      blockLoader: false,
      isForm: true,
      alert: "",
      ErrorMessage: "",
      fileLogo: "",
      showFileUpload: false,
      form: {
        valid: false,
        isEdit: false,
        model: {
          CompanySetupId: "",
          CompanyId: "",
          CompanyName: "",
          CompanyAddressId: "",
          CompanyAddressName: "",
          TaxRegistrationNo: "",
          CompanyTaxName: "",
          CompanyLogo: "",
          AddressNameCaption: "",
          LogoImage: "",
          LogoImageUrl: ""
        }
      }
    };
  },
  computed: {
    isSave() {
      if (this.isForm == false) return this.$store.state.roleaccess.AllowNew;
      else return false;
    },
    isEdit() {
      if (this.isForm == true) return this.$store.state.roleaccess.AllowEdit;
      else return false;
    }
  },

  async mounted() {
    await this.$store.dispatch(
      "features/company/company_address/actGetCompanyAddress",
      "CompanyAddress?"
    );
    await this.$store.dispatch(
      "features/company/company_setup/actGetCompanySetup",
      "CompanySetup?CompanyId=" + this.$store.state.companyId
    );
    await this.$store.dispatch(
      "features/central/company/actGetCompany",
      "company?"
    );
    var company = this.$store.state.features.central.company.data.filter(
      x => x.CompanyId == this.$store.state.companyId
    );
    if (company.length > 0) {
      this.form.model.CompanyId = company[0].CompanyId;
      this.form.model.CompanyName = company[0].CompanyName;
    }
    var companySetup = this.$store.state.features.company.company_setup.data;
    if (companySetup.length > 0) {
      var getCompanyAddress = this.$store.state.features.company.company_address.data.filter(
        x => x.CompanyAddressId == companySetup[0].CompanyAddressId
      );
      if (getCompanyAddress.length > 0) {
        this.handleSelectCompanyAddress(getCompanyAddress[0]);
      }
      this.form.isEdit = true;
      this.form.model.CompanySetupId = companySetup[0].CompanySetupId;
      this.form.model.CompanyId = companySetup[0].CompanyId;
      this.form.model.CompanyName = companySetup[0].CompanyName;
      this.form.model.CompanyAddressId = companySetup[0].CompanyAddressId;
      this.form.model.AddressName = companySetup[0].AddressName;
      this.form.model.TaxRegistrationNo = companySetup[0].TaxRegistrationNo;
      this.form.model.CompanyTaxName = companySetup[0].CompanyTaxName;
      this.form.model.CompanyLogo = companySetup[0].CompanyLogo;
      this.form.model.LogoImageUrl = companySetup[0].LogoImageUrl;
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
    async handleGetCompany(url) {
      await this.$store.dispatch("features/central/company/actGetCompany", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async previewFiles(event) {
      this.form.model.CompanyLogo = event.target.files[0].name;
      this.form.model.LogoImage = event.target.files[0];
      this.form.model.LogoImageUrl = URL.createObjectURL(event.target.files[0]);
    },
    async handleSelectCompanyAddress(row) {
      this.form.model.CompanyAddressId = row.CompanyAddressId;
      // this.form.model.CompanyAddressName = row.AddressCode + " - " + row.AddressName;
      this.form.model.CompanyAddressName = row.AddressCode;
      this.form.model.ContactPerson = row.ContactPerson;
      this.form.model.Address = row.Address;
      this.form.model.Handphone = row.Handphone;
      this.form.model.Phone1 = row.Phone1;
      this.form.model.Extension1 = row.Extension1;
      this.form.model.Phone2 = row.Phone2;
      this.form.model.Extension2 = row.Extension2;
      this.form.model.Fax = row.Fax;
      this.form.model.EmailAddress = row.EmailAddress;
      this.form.model.HomePage = row.HomePage;
      this.form.model.Neighbourhood = row.Neighbourhood;
      this.form.model.Hamlet = row.Hamlet;
      this.form.model.UrbanVillage = row.UrbanVillage;
      this.form.model.SubDistrict = row.SubDistrict;
      this.form.model.CityCode = row.CityCode;
      this.form.model.PostCode = row.PostCode;
      this.isShowCompanyAddress = false;
    },
    async handleGetCompanyAddress(url) {
      if (url.toLowerCase().lastIndexOf("InActive") < 0) {
        url = url + "&InActive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&InActive"));
        url = clean_uri + "&InActive=false";
      }

      if (url.lastIndexOf("CompanyAddress") < 0) {
        url = "CompanyAddress?" + url;
      }

      await this.$store.dispatch(
        "features/company/company_address/actGetCompanyAddress",
        url
      );

      this.$refs.gridCompanyAddress.doRefresh();
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;

      this.resetForm();
    },
    async handleStatus(e) {
      if (this.form.model.InActive) {
        this.$bvModal
          .msgBoxConfirm("Are you sure?")
          .then(value => {
            if (value) {
              this.form.model.InActive = value;
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/central/company/actDeleteCompany",
        row
      );

      var response = this.$store.state.features.central.company.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.$refs.gridCompany.doRefresh();
        this.resetForm();

        this.handleToast("Confirmation", "success", "Successfully deleted");
      }

      this.showLoader(false);
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
    async handleSubmit() {
      this.showLoader(true);

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "features/company/company_setup/actUpdateCompanySetup",
          this.form.model
        );
        var response = this.$store.state.features.company.company_setup
          .resultUpdate;

        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.isForm = true;

          this.form.model.CompanySetupId = response.data.CompanySetupId;
          this.form.model.LogoImageUrl = response.data.LogoImageUrl;

          this.resetForm();
          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/company/company_setup/actCreateCompanySetup",
          this.form.model
        );

        var response = this.$store.state.features.company.company_setup
          .resultCreate;

        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription
          );
        } else {
          this.isForm = true;
          this.form.isEdit = true;
          this.form.model.CompanySetupId = response.data.CompanySetupId;
          this.form.model.LogoImageUrl = response.data.LogoImageUrl;

          this.resetForm();

          this.handleToast("Confirmation", "success", "Successfully saved");
        }
      }
      this.showLoader(false);
    },
    async onSubmit() {
      this.$bvModal
        .msgBoxConfirm("Save your changes ?", {
          title: "Submit Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          okTitle: "Yes",
          cancelTitle: "No",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.handleSubmit();
          }
        })
        .catch(err => {
          // An error occurred
        });
    }
  }
};
</script>

<style scoped>

</style>
