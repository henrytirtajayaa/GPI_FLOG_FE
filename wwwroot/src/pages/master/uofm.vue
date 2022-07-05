<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <!-- TAB FORM BASE UOM BEGIN -->
    <b-card no-body v-show="isFormBase">
      <validation-observer ref="observerBase" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmitUomBase)" id="form-base">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">Base Unit Of Measurement</span>
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
                <b-alert show variant="danger" size="sm" v-if="false">
                  <span class="font-weight-bold text-uppercase"></span>
                </b-alert>
                <b-row class="mb-0">
                  <!-- BEGIN FORM -->
                  <b-col sm="2">
                    <validation-provider
                      name="UoM Code"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="UomCode">Base UoM Code</label>
                        <b-form-input
                          name="UomCode"
                          type="text"
                          placeholder="UoM Code "
                          v-model="form.model.UomBase.UomCode"
                          :state="validateState(validationContext)"
                          aria-describedby="base-uomcode-feedback"
                          :disabled="form.isEdit"
                          size="sm"
                        />
                        <b-form-invalid-feedback
                          id="base-uomcode-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col sm="4">
                    <validation-provider
                      name="UoM Name"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="UomName">Base UoM Name</label>
                        <b-form-input
                          name="UomName"
                          type="text"
                          placeholder="UoM Name "
                          v-model="form.model.UomBase.UomName"
                          :state="validateState(validationContext)"
                          aria-describedby="base-uomname-feedback"
                          :disabled="!isSave"
                          size="sm"
                        />
                        <b-form-invalid-feedback
                          id="base-uomname-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <!-- END FORM -->
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card>
    <!-- TAB FORM BASE UOM END -->
    <!-- TAB FORM SCHEDULE UOM BEGIN -->
    <b-card no-body v-show="isFormHeader">
      <validation-observer ref="observerHeader" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmitUomHeader)" id="form-header">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">Unit Of Measurement Schedule</span>
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
                <b-alert show variant="danger" size="sm" v-if="false">
                  <span class="font-weight-bold text-uppercase"></span>
                </b-alert>
                <!-- BEGIN FORM -->
                <b-row class="mb-0">
                  <b-col sm="2">
                    <validation-provider
                      name="Schedule Code"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="ScheduleCode">Schedule Code</label>
                        <b-form-input
                          name="ScheduleCode"
                          type="text"
                          placeholder="Schedule Code "
                          v-model="form.model.UomHeader.UomScheduleCode"
                          :state="validateState(validationContext)"
                          aria-describedby="base-schedulecode-feedback"
                          :disabled="form.isEdit"
                          size="sm"
                        />
                        <b-form-invalid-feedback
                          id="base-schedulecode-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col sm="4">
                    <validation-provider
                      name="Schedule Name"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="ScheduleName">Schedule Name</label>
                        <b-form-input
                          name="ScheduleName"
                          type="text"
                          placeholder="Schedule Name"
                          v-model="form.model.UomHeader.UomScheduleName"
                          :state="validateState(validationContext)"
                          aria-describedby="base-schedulename-feedback"
                          :disabled="!isSave"
                          size="sm"
                        />
                        <b-form-invalid-feedback
                          id="base-schedulename-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col sm="4">
                    <validation-provider
                      name="Base UoM"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group>
                        <label for="UomBaseCode">Base UoM</label>
                        <b-form-select
                          name="UomBaseCode"
                          v-model="form.model.UomHeader.UomBaseId"
                          :state="validateState(validationContext)"
                          :plain="true"
                          :options="listUomBase"
                          value-field="UomBaseId"
                          text-field="UomCode"
                          size="sm"
                          aria-describedby="schedule-base-uom-feedback"
                        />
                        <b-form-invalid-feedback
                          id="schedule-base-uom-feedback"
                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                </b-row>
                <b-row class="mb-1 mt-0">
                  <b-col>
                    <b-button
                      variant="yellow"
                      size="sm"
                      type="button"
                      v-if="isSave"
                      :disabled="form.model.UomHeader.UomScheduleCode=='' || form.model.UomHeader.UomBaseId==''"
                      @click="onAddUom"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add UoM
                    </b-button>
                  </b-col>
                </b-row>
                <b-row class="mb-0">
                  <b-col sm="12" class="table-responsive">
                    <table
                      id="table-detail"
                      width="80%"
                      class="table-light table-striped table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th class="text-center" style="vertical-align: middle;" width="50px">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-center" width="140">UOM CODE</th>
                          <th class="text-left">UOM NAME</th>
                          <th class="text-center" width="150">EQUIVALENT QTY (FACTOR)</th>
                          <th class="text-center" width="120">BASE UOM</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in form.dataDetails">
                          <tr v-bind:key="itemIndex">
                            <td class="text-center">
                              <b-button
                                v-if="isSave"
                                variant="outline-danger"
                                pill
                                size="sm"
                                @click="deleteRowDetail(itemIndex)"
                              >
                                <font-awesome-icon :icon="['fas', 'trash']" />
                              </b-button>
                            </td>
                            <td>
                              <b-form-input
                                placeholder="UoM Code"
                                type="text"
                                size="sm"
                                v-model="item.UomCode"
                                :disabled="item.UomDetailId != ''"
                              />
                            </td>
                            <td>
                              <b-form-input
                                placeholder="UoM Name"
                                type="text"
                                size="sm"
                                v-model="item.UomName"
                                :disabled="!isSave"
                              />
                            </td>
                            <td>
                              <money
                                v-model="item.EquivalentQty"
                                v-bind="moneyOptions"
                                size="sm"
                                class="currency-money-field"
                                :disabled="!isSave"
                              ></money>
                            </td>
                            <td class="text-center">{{form.model.UomHeader.UomBaseCode}}</td>
                          </tr>
                        </template>
                      </tbody>
                      <tfoot></tfoot>
                    </table>
                  </b-col>
                </b-row>
                <!-- END FORM -->
              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card>
    <!-- TAB FORM SCHEDULE UOM END -->

    <!-- TAB GRID/LIST BEGIN -->
    <b-tabs pills card v-show="!isFormBase && !isFormHeader">
      <!-- TAB PROGRESS BEGIN -->
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'ruler-combined']" />&nbsp;UOM
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid
                ref="gridUomHeader"
                :fields="this.$store.state.features.company.uom.header.headers"
                :items="this.$store.state.features.company.uom.header.data"
                :info="this.$store.state.features.company.uom.header.listInfo"
                :baseUrl="this.$store.state.features.company.uom.header.baseUrl"
                :actGetData="handleGetUomHeader"
                :actCreate="onFormHeaderCreate"
                :actEditRow="handleEditUomHeader"
                :actDeleteRow="handleDeleteUomHeader"
                addTableClasses="table-bordered"
                responsive
                items-per-page-select
                loading
                hover
                sorter
                pagination
                column-filter
                caption="Unit Of Measurement Schedule"
              ></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
      <!-- TAB PROGRESS END -->
      <!-- TAB HISTORY BEGIN -->
      <b-tab @click="isTabMain=false">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'cogs']" />&nbsp;Base UoM
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  ref="gridUomBase"
                  :fields="this.$store.state.features.company.uom.base.headers"
                  :items="this.$store.state.features.company.uom.base.data"
                  :info="this.$store.state.features.company.uom.base.listInfo"
                  :baseUrl="this.$store.state.features.company.uom.base.baseUrl"
                  :actGetData="handleGetUomBase"
                  :actCreate="onFormBaseCreate"
                  :actEditRow="handleEditUomBase"
                  :actDeleteRow="handleDeleteUomBase"
                  addTableClasses="table-bordered"
                  responsive
                  items-per-page-select
                  loading
                  hover
                  sorter
                  pagination
                  column-filter
                  caption="Base Unit Of Measurement"
                  historical
                ></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
      <!-- TAB HISTORY END -->
    </b-tabs>
    <!-- TAB GRID/LIS END -->
  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import VueElementLoading from "vue-element-loading";
import loginServices from "../../services/loginservices";

export default {
  name: "Uofm",
  layout: "dashboard",
  components: { DataGrid, VueElementLoading },
  data() {
    return {
      blockLoader: false,
      isTabMain: true,
      isFormBase: false,
      isFormHeader: false,
      moneyOptions: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false,
        allowBlank: false,
        min: 0
      },
      form: {
        valid: false,
        isEdit: false,
        dataDetails: [],
        model: {
          UomHeader: {
            UomHeaderId: "00000000-0000-0000-0000-000000000000",
            UomScheduleCode: "",
            UomScheduleName: "",
            UomBaseId: "",
            UomDetails: Array,
            UomBaseCode: "" //Display
          },
          UomBase: {
            UomBaseId: "00000000-0000-0000-0000-000000000000",
            UomCode: "",
            UomName: ""
          }
        }
      }
    };
  },
  watch: {
    "form.model.UomHeader.UomBaseId"(newVal) {
      let uomBases = this.$store.state.features.company.uom.base.data;
      let uomBaseCode = "";

      uomBases.forEach(function(uom) {
        if (uom.UomBaseId == newVal) {
          uomBaseCode = uom.UomCode;
          return;
        }
      });

      this.form.model.UomHeader.UomBaseCode = uomBaseCode;
    },
    "form.dataDetails": {
      handler: function(after, before) {
        //this.doCalculateDetails();
      },
      deep: true
    }
  },
  computed: {
    isSave() {
      return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
    },
    listUomBase() {
      let uomBases = this.$store.state.features.company.uom.base.data;
      return uomBases;
    }
  },
  async mounted() {
    if (this.$refs.gridUomBase != null) {
      await this.$refs.gridUomBase.doRefresh();
    }

    if (this.$refs.gridUomHeader != null) {
      await this.$refs.gridUomHeader.doRefresh();
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
        autoHideDelay: 5000,
        appendToast: false
      });
    },
    async handleGetUomHeader(url) {
      await this.$store.dispatch("features/company/uom/header/actGet", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetUomBase(url) {
      await this.$store.dispatch("features/company/uom/base/actGet", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isFormHeader = false;
      this.isFormBase = false;
      this.form.isEdit = false;

      this.resetFormUomHeader();
      this.resetFormUomBase();
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetFormUomHeader() {
      this.form.model.UomHeader.UomHeaderId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.UomHeader.UomScheduleCode = "";
      this.form.model.UomHeader.UomScheduleName = "";
      this.form.model.UomHeader.UomBaseId = "";
      // "00000000-0000-0000-0000-000000000000";
      this.form.model.UomHeader.UomDetails = Array;
      this.form.model.UomHeader.UomBaseCode = "";

      this.form.model.UomHeader.UomDetails = [];
      this.form.dataDetails = [];

      this.$nextTick(() => {
        this.$refs.observerHeader.reset();
      });
    },
    resetFormUomBase() {
      this.form.model.UomBase.UomBaseId =
        "00000000-0000-0000-0000-000000000000";
      this.form.model.UomBase.UomCode = "";
      this.form.model.UomBase.UomName = "";

      this.$nextTick(() => {
        this.$refs.observerBase.reset();
      });
    },
    async onFormBaseCreate() {
      this.resetFormUomBase();

      this.form.isEdit = false;
      this.isFormBase = true;
      this.isFormHeader = false;
    },
    async onFormHeaderCreate() {
      this.resetFormUomHeader();

      this.form.isEdit = false;
      this.isFormBase = false;
      this.isFormHeader = true;
    },
    async handleEditUomHeader(row) {
      this.isFormHeader = true;

      this.form.model.UomHeader.UomHeaderId = row.UomHeaderId;
      this.form.model.UomHeader.UomScheduleCode = row.UomScheduleCode;
      this.form.model.UomHeader.UomScheduleName = row.UomScheduleName;
      this.form.model.UomHeader.UomBaseId = row.UomBaseId;
      this.form.model.UomHeader.UomDetails = row.UomDetails;
      
      let arrDetail = [];
      if (row.UomDetails.length) {
        for (var i = 0; i < row.UomDetails.length; i++) {
          let uom = row.UomDetails[i];
          arrDetail.push({
            Index : i,
            UomDetailId: uom.UomDetailId,
            UomCode: uom.UomCode,
            UomName: uom.UomName,
            EquivalentQty: uom.EquivalentQty,
            UomBaseCode: this.form.model.UomHeader.UomBaseCode
          });          
        }
      }
      
      this.form.dataDetails = arrDetail;

      this.form.isEdit = true;
    },
    async handleEditUomBase(row) {
      this.isFormBase = true;

      this.form.model.UomBase.UomBaseId = row.UomBaseId;
      this.form.model.UomBase.UomCode = row.UomCode;
      this.form.model.UomBase.UomName = row.UomName;

      this.form.isEdit = true;
    },
    async deleteRowDetail(index) {
      this.$bvModal
        .msgBoxConfirm("Are you sure ?", {
          title: "Delete Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-1 border-bottom-0",
          footerClass: "p-1 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.form.dataDetails.splice(index, 1);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async onAddUom() {
      this.form.dataDetails.push({
        Index: this.form.dataDetails.length,
        UomDetailId: "",
        UomCode: "",
        UomName: "",
        EquivalentQty: 1,
        UomBaseCode: this.form.model.UomHeader.UomBaseCode
      });
    },
    async doDeleteUomBase(row) {
      this.showLoader(true);

      await this.$store.dispatch("features/company/uom/base/actDelete", row);

      var response = this.$store.state.features.company.uom.base.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.$refs.gridUomBase.doRefresh();

        this.handleToast(
          "Confirmation",
          "success",
          "Base UOM successfully deleted"
        );
      }

      this.showLoader(false);
    },
    async handleDeleteUomBase(row) {
      this.$bvModal
        .msgBoxConfirm("Are you sure ?", {
          title: "Delete Base UOM Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.doDeleteUomBase(row);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async doDeleteUomHeader(row) {
      this.showLoader(true);

      await this.$store.dispatch("features/company/uom/header/actDelete", row);

      var response = this.$store.state.features.company.uom.header.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.$refs.gridUomHeader.doRefresh();

        this.handleToast(
          "Confirmation",
          "success",
          "UOM Schedule successfully deleted"
        );
      }

      this.showLoader(false);
    },
    async handleDeleteUomHeader(row) {
      this.$bvModal
        .msgBoxConfirm("Are you sure ?", {
          title: "Delete UOM Schedule Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0"
        })
        .then(ok => {
          if (ok) {
            this.doDeleteUomHeader(row);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async onSubmitUomBase() {
      this.showLoader(true);

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "features/company/uom/base/actUpdate",
          this.form.model.UomBase
        );

        var response = this.$store.state.features.company.uom.base.resultUpdate;

        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != undefined
              ? response.data.ErrorDescription
              : "Update failed !"
          );
        } else {
          this.isFormBase = false;
          this.form.isEdit = false;

          this.$refs.gridUomBase.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/company/uom/base/actCreate",
          this.form.model.UomBase
        );

        var response = this.$store.state.features.company.uom.base.resultCreate;

        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != undefined
              ? response.data.ErrorDescription
              : "Submit failed !"
          );
        } else {
          this.isFormBase = false;
          this.form.isEdit = false;

          this.$refs.gridUomBase.doRefresh();

          this.handleToast("Confirmation", "success", "Successfully saved");
        }
      }

      this.showLoader(false);
    },
    async validateForm() {
      let valid = true;

      let checked = true;
      if (this.form.dataDetails.length > 0) {
        this.form.dataDetails.forEach(function(detail) {
          if (detail.UomCode == "") {
            checked = false;
            return;
          }
        });

        if (!checked) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Detail Uom Code must not empty !"
          );
        }

        checked = true;
        this.form.dataDetails.forEach(function(detail) {
          if (detail.EquivalentQty <= 0) {
            checked = false;
            return;
          }
        });

        if (!checked) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Detail Equivalent Qty must not empty !"
          );
        }
      } else {
        valid = false;
        this.handleToast("Warning", "danger", "Detail UoM can not empty !");
      }

      return valid;
    },
    async onSubmitUomHeader() {
      if (await this.validateForm()) {
        this.showLoader(true);

        this.form.model.UomHeader.UomDetails = this.form.dataDetails;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/uom/header/actUpdate",
            this.form.model.UomHeader
          );

          var response = this.$store.state.features.company.uom.header
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
            this.isFormHeader = false;
            this.form.isEdit = false;

            this.$refs.gridUomHeader.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/company/uom/header/actCreate",
            this.form.model.UomHeader
          );

          var response = this.$store.state.features.company.uom.header
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
            this.isFormHeader = false;
            this.form.isEdit = false;

            this.$refs.gridUomHeader.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }

        this.showLoader(false);
      }
    }
  }
};
</script>

<style scoped>
#table-detail thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}

#table-detail tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-detail tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}
</style>
