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
                <span class="font-weight-bold">Number Format</span>
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
                <b-col sm="2">
                  <validation-provider
                    name="Document Code"
                    :rules="{ required: true  }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="DocumentCode">Document Code</label>
                      <b-form-input
                        name="Document Code"
                        type="text"
                        placeholder="Document Code"
                        v-model="form.model.DocumentId"
                        size="sm"
                        :state="validateState(validationContext)"
                        :disabled="form.isEdit"
                        aria-describedby="code-user-feedback"
                      />
                      <b-form-invalid-feedback
                        id="code-user-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="8">
                  <b-form-group>
                    <label for="Description">Description</label>
                    <b-form-input
                      name="Description"
                      type="text"
                      placeholder="Description"
                      size="sm"
                      v-model="form.model.Description"
                      aria-describedby="Description-feedback"
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="4" class="mb-2" id="resolution">
                  <b-button variant="success" size="sm" @click="doDetailAppendSegment()">New Segment</b-button>
                </b-col>
                <table :class="tableClasses" id="resolution">
                  <thead>
                    <tr>
                      <th class="text-left"></th>
                      <th class="text-left">Segment #</th>
                      <th class="text-left">Type</th>
                      <th class="text-left">Length</th>
                      <th class="text-left">Format</th>
                      <th class="text-left">Incr.</th>
                      <th class="text-left">Starting</th>
                      <th class="text-left">Ending</th>
                    </tr>
                  </thead>
                  <tbody class="position-relative">
                    <template v-for="(item, itemIndex) in dataDetails">
                      <tr>
                        <td>
                          <font-awesome-icon
                            :icon="['fas', 'trash']"
                            @click="DeleteRole(itemIndex)"
                          />
                        </td>
                        <td>{{item.SegmentNo }}</td>
                        <td>
                          <b-form-select
                            size="sm"
                            v-model="item.SegmentType"
                            :options="ItemType"
                            @change="onDetailChangeSegmentType($event, item.Index)"
                          ></b-form-select>
                        </td>
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            v-model="item.SegmentLength"
                            maxlength="1"
                            :readonly="item.SegmentType ==3 || item.SegmentType ==4 || item.SegmentType ==5"
                            :change="onDetailChangeLength(item.Index)"
                          />
                        </td>
                        <td>
                          <b-form-input
                            v-if="item.SegmentType == 1 || item.SegmentType == 3"
                            type="text"
                            size="sm"
                            :maxlength="item.SegmentLength"
                            v-model="item.MaskFormat"
                            :readonly="item.SegmentType == 2"
                            @change="isSymbol(item.Index)"
                          />
                          <b-form-input
                            v-if="item.SegmentType == 2"
                            type="text"
                            size="sm"
                            :maxlength="item.SegmentLength"
                            v-model="item.MaskFormat"
                            :readonly="item.SegmentType == 2"
                            @change="isSymbol(item.Index)"
                          />
                          <b-form-select
                            v-if="item.SegmentType == 4"
                            size="sm"
                            v-model="item.MaskFormat"
                            value-field="item"
                            text-field="name"
                            :options="ItemFormatYear"
                            @change="onDetailFormat($event, item.Index)"
                          ></b-form-select>
                          <b-form-select
                            v-if="item.SegmentType == 5"
                            size="sm"
                            v-model="item.MaskFormat"
                            value-field="item"
                            text-field="name"
                            :options="ItemFormatMonth"
                            @change="onDetailFormat($event, item.Index)"
                          ></b-form-select>
                        </td>
                        <td>
                          <b-form-checkbox
                            size="sm"
                            v-model="item.Increase"
                            :disabled="item.SegmentType !=2"
                          />
                        </td>
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            v-model="item.StartingValue"
                            value="0"
                            :readonly="item.SegmentType !=2"
                            v-mask="item.NumberMaskInput"
                          />
                        </td>
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            v-model="item.EndingValue"
                            value="0"
                            :readonly="item.SegmentType !=2"
                            v-mask="item.NumberMaskInput"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>

                  <slot name="caption" />
                </table>
              </b-row>

              <b-row>
                <b-col sm="4">
                  <b-form-group>
                    <label for="Number Format">Number Format</label>
                    <b-form-input
                      name="Number Format"
                      type="text"
                      placeholder="Number Format"
                      size="sm"
                      :value="combineNumberFormat"
                      readonly
                      v-model="form.model.NumberFormat"
                      aria-describedby="NumberFormat-feedback"
                    />
                  </b-form-group>
                </b-col>

                <b-col sm="2" class="mt-4">
                  <b-form-checkbox
                    v-model="form.model.IsMonthlyReset"
                    :disabled="disabledMountly"
                  >Monthly Reset</b-form-checkbox>
                </b-col>
                <b-col sm="2" class="mt-4">
                  <b-form-checkbox
                    v-model="form.model.IsYearlyReset"
                    :disabled="disabledYearly"
                  >Yearly Reset</b-form-checkbox>
                </b-col>

                <b-col sm="2">
                  <validation-provider
                    name="Status"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="Status">Status</label>
                      <b-form-select
                        id="status"
                        name="Status"
                        v-model="form.model.InActive"
                        :state="validateState(validationContext)"
                        size="sm"
                        :plain="true"
                        :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                        aria-describedby="status-feedback"
                      />
                      <b-form-invalid-feedback
                        id="status-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
          <DataGrid
            ref="gridMain"
            :fields="headerFields"
            :items="this.$store.state.features.company.numberformat_header.data"
            :info="this.$store.state.features.company.numberformat_header.listInfo"
            :baseUrl="this.$store.state.features.company.numberformat_header.baseUrl"
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
            :caption="caption"
          ></DataGrid>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import { mask } from "vue-the-mask";
import loginServices from "../services/loginservices";

export default {
  name: "Number-Format",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid
  },
  directives: {
    mask
  },
  computed: {
    isSave() {
      return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
    },
    disabledYearly() {
      var isyearly = true;
      if (this.dataDetails.length > 0) {
        for (var i = 0; i < this.dataDetails.length; i++) {
          if (
            this.dataDetails[i]["MaskFormat"] == "YY" ||
            this.dataDetails[i]["MaskFormat"] == "YYYY"
          )
            isyearly = false;
        }
      }
      //if (this.form.isEdit && isyearly)
      //  this.form.model.IsYearlyReset = false;

      return isyearly;
    },
    disabledMountly() {
      var ismountly = true;
      if (this.dataDetails.length > 0) {
        for (var i = 0; i < this.dataDetails.length; i++) {
          if (
            this.dataDetails[i]["MaskFormat"] == "MM" ||
            this.dataDetails[i]["MaskFormat"] == "Month"
          )
            ismountly = false;
        }
      }

      return ismountly;
    },

    combineNumberFormat: function() {
      let theFormat = "";
      for (var i = 0; i < this.dataDetails.length; i++) {
        if (
          this.dataDetails[i]["MaskFormat"].length ==
          parseInt(this.dataDetails[i]["SegmentLength"])
        ) {
          theFormat = theFormat + this.dataDetails[i]["MaskFormat"];
        }
      }
      this.form.model.NumberFormat = theFormat;

      return theFormat;
    },
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
    }
  },
  data: () => {
    return {
      caption: "Number Format",
      isForm: false,
      perPage: 20,
      dataDetails: [],
      ItemFormatYear: [
        { item: "YY", name: "YY" },
        { item: "YYYY", name: "YYYY" }
      ],
      ItemFormatMonth: [
        { item: "MM", name: "MM" },
        { item: "Month", name: "Month" }
      ],
      ItemType: [
        { id: 1, text: "Char", value: 1, defLength: 2, defFormat: "" },
        { id: 2, text: "Number", value: 2, defLength: 4, defFormat: "9999" },
        { id: 3, text: "Symbol", value: 3, defLength: 1, defFormat: "" },
        { id: 4, text: "Date-Year", value: 4, defLength: 2, defFormat: "YY" },
        { id: 5, text: "Date-Month", value: 5, defLength: 2, defFormat: "MM" }
      ],
      headerFields: [
        { key: "DocumentId", label: "Document Code", width: 100 },
        {
          key: "Description",
          label: "Description",
          classes: "text-center",
          width: 200
        },
        {
          key: "LastGeneratedNo",
          label: "Last Generated No",
          classes: "text-center",
          width: 200
        },
        { key: "NumberFormat", label: "Number Format", width: 200 },
        {
          key: "InActive",
          label: "Status",
          _classes: "text-center",
          width: 70,
          filter_select: true,
          filter_select_options: [
            { key: false, value: "Active" },
            { key: true, value: "Inactive" }
          ]
        }
      ],
      alert: "",
      ErrorMessage: "",
      form: {
        valid: false,
        isEdit: false,
        model: {
          FormatHeaderId: null,
          DocumentId: "",
          Description: "",
          LastGeneratedNo: "",
          NumberFormat: "",
          InActive: false,
          IsMonthlyReset: false,
          IsYearlyReset: false,
          NumberFormatDetails: []
        }
      }
    };
  },

  async mounted() {
    if (this.$refs.gridMain != null) {
      await this.$refs.gridMain.doRefresh();
    }
  },

  methods: {
    async doDetailAppendSegment() {
      this.dataDetails.push({
        Index: this.dataDetails.length,
        SegmentNo: this.dataDetails.length + 1,
        SegmentType: 0,
        MaskFormat: "",
        SegmentLength: 0,
        StartingValue: null,
        EndingValue: null,
        Increase: false,
        NumberMaskInput: ""
      });
    },
    async onDetailChangeSegmentType(val, index) {
      let selectedItemType = [];

      if (val > 0 && index > -1) {
        for (var i = 0; i < this.ItemType.length; i++) {
          if (this.ItemType[i]["id"] === val) {
            selectedItemType = this.ItemType[i];
            break;
          }
        }

        if (selectedItemType != null) {
          this.dataDetails[index]["SegmentLength"] =
            selectedItemType["defLength"];
          this.dataDetails[index]["MaskFormat"] = selectedItemType["defFormat"];
          this.form.model.IsMonthlyReset = false;
          this.form.model.IsYearlyReset = false;

          if (val == 2) this.dataDetails[index]["Increase"] = true;
          else this.dataDetails[index]["Increase"] = false;

          this.onDetailChangeLength(index);
        }
      }
    },
    async onDetailFormat(val, index) {
      this.dataDetails[index]["SegmentLength"] = val.length;
    },
    async onDetailChangeLength(idx) {
      if (this.dataDetails[idx] != null) {
        if (this.dataDetails[idx]["SegmentType"] == 2) {
          if (this.dataDetails[idx]["SegmentLength"] > 0) {
            this.dataDetails[idx]["MaskFormat"] = "9".repeat(
              this.dataDetails[idx]["SegmentLength"]
            );
            this.dataDetails[idx]["StartingValue"] =
              "0".repeat(this.dataDetails[idx]["SegmentLength"] - 1) + "1";
            this.dataDetails[idx]["EndingValue"] = "9".repeat(
              this.dataDetails[idx]["SegmentLength"]
            );
            this.dataDetails[idx]["NumberMaskInput"] = "#".repeat(
              this.dataDetails[idx]["SegmentLength"]
            );
          }
        } else {
          this.dataDetails[idx]["StartingValue"] = "0";
          this.dataDetails[idx]["EndingValue"] = "0";
        }
      }
    },

    async DeleteRole(index) {
      this.dataDetails.splice(index, 1);
      for (var i = 0; i < this.dataDetails.length; i++) {
        this.dataDetails[i]["Index"] = i;
        this.dataDetails[i]["SegmentNo"] = i + 1;
      }
    },
    async isSymbol(index) {
      var pattern = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
      if (this.dataDetails[index]["SegmentType"] == 3) {
        if (!pattern.test(this.dataDetails[index]["MaskFormat"])) {
          alert("Please insert symbol");
          this.dataDetails[index]["MaskFormat"] = "".repeat(
            this.dataDetails[index]["SegmentLength"]
          );
        }
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
    async handleGetData(url) {
      await this.$store.dispatch(
        "features/company/numberformat_header/actGetNumberFormatHeader",
        url
      );
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    async onFormCreate() {
      this.resetForm();
      this.ErrorMessage = "";

      this.form.model.FormatHeaderId = "";
      this.form.model.DocumentId = "";
      this.form.model.Description = "";
      this.form.model.LastGeneratedNo = "";
      this.form.model.NumberFormat = "";
      this.form.model.InActive = false;
      this.form.model.IsMonthlyReset = false;
      this.form.model.IsYearlyReset = false;
      this.dataDetails = [];

      this.doDetailAppendSegment();
      this.form.isEdit = false;
      this.isForm = true;
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
    async handleEdit(row) {
      this.ErrorMessage = "";

      this.form.model.FormatHeaderId = row.FormatHeaderId;
      this.form.model.DocumentId = row.DocumentId;
      this.form.model.Description = row.Description;
      this.form.model.LastGeneratedNo = row.LastGeneratedNo;
      this.form.model.NumberFormat = row.NumberFormat;
      this.form.model.InActive = row.InActive == "Active" ? false : true;
      this.form.model.IsMonthlyReset =
        row.IsMonthlyReset == "Yes" ? true : false;
      this.form.model.IsYearlyReset = row.IsYearlyReset == "Yes" ? true : false;
      this.dataDetails = [];

      var response = await this.$store.dispatch(
        "features/company/numberformat_detail/actGetNumberFormatDetail",
        this.form.model
      );
      if (response.status == 200) {
        this.dataDetails = response.data.NumberFormatDetails;
      }
      for (var i = 0; i < this.dataDetails.length; i++) {
        this.dataDetails[i]["Index"] = i;
        this.dataDetails[i]["NumberMaskInput"] = "#".repeat(
          this.dataDetails[i]["SegmentLength"]
        );
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
      });
    },

    async doDelete(row) {
      await this.$store.dispatch(
        "features/company/numberformat_header/actDeleteNumberFormatHeader",
        row
      );

      var response = this.$store.state.features.company.numberformat_header
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
    async validateForm() {
      let valid = true;

      let errMessage = "";
      let row = [];
      for (let i = 0; i < this.dataDetails.length; i++) {
        row = this.dataDetails[i];
        
        if (
          parseInt(row.SegmentType) < 1 ||
          row.MaskFormat == "" ||
          parseInt(row.SegmentLength) < 1
        ) {
          valid = false;
          errMessage = "Segment " +
            row.SegmentNo + " : Type, Length, Format must be filled !";
          break;
        }

        if (
          parseInt(row.SegmentLength) != row.MaskFormat.length
        ) {
          valid = false;
          errMessage = "Segment " +
            row.SegmentNo + " Format is not valid !";
          break;
        }
      }

      if (!valid) {
        this.handleToast("Warning", "danger", errMessage);
      }

      return valid;
    },
    async onSubmit() {
      if (await this.validateForm()) {
        var arr = [];
        this.dataDetails.forEach(function(row, index) {
          arr.push({
            SegmentNo: row.SegmentNo,
            SegmentType: row.SegmentType,
            MaskFormat: row.MaskFormat,
            SegmentLength: row.SegmentLength,
            StartingValue: row.StartingValue,
            EndingValue: row.EndingValue,
            Increase: row.Increase
          });
        });

        //Append details
        this.form.model.NumberFormatDetails = arr;
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/numberformat_header/actUpdateNumberFormatHeader",
            this.form.model
          );
          var response = this.$store.state.features.company.numberformat_header
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
            "features/company/numberformat_header/actCreateNumberFormatHeader",
            this.form.model
          );

          var response = this.$store.state.features.company.numberformat_header
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
      }
    }
  }
};
</script>

<style scoped>
  #resolution-show{
      display:none;
    }
@media only screen and (max-width: 560px) {
    #resolution{
      display:none;
    }

    #resolution-show{
      display:inline-block;
    }
}
</style>
