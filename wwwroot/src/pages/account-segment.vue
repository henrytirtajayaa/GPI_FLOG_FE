<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12" lg="10"> 
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Account Segment</span>
                <div right style="float:right;" v-show="showButton">
                  <b-button
                    type="button"
                    v-show="actionButton.AllowEdit"
                    v-if="!isEdit"
                    @click="handleEdit"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />&nbsp;Edit
                  </b-button>
                  <b-button variant="blue" type="submit" v-show="isEdit">
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>

                  <b-button @click="onFormClose" v-show="isEdit">
                    <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                  </b-button>
                </div>
              </div>
              <b-row>
                <b-col sm="4" class="mb-2" v-if="isEdit && actionButton.AllowEdit">
                  <b-button variant="success" size="sm" @click="doDetailAppendSegment()">
                    <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;New Segment
                  </b-button>
                </b-col>
                <table id="table-sub">
                  <thead>
                    <th class="text-sm-center" width="13%">Segment No</th>
                    <th class="text-sm-center">Description</th>
                    <th class="text-sm-center" width="10%">Main</th>
                    <th class="text-sm-center" width="10%">Length</th>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in dataSegments">
                      <tr v-bind:key="index">
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            class="text-center"
                            :disabled="!isEdit"
                            readonly
                            :hide-details="true"
                            v-model="item.SegmentNo"
                          />
                        </td>
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            :disabled="!isEdit"
                            v-model="item.Description"
                          />
                        </td>
                        <td>
                          <b-form-checkbox
                            v-model="item.IsMainAccount"
                            :disabled="!isEdit"
                            @change="changeMainAccount(index)"
                          ></b-form-checkbox>
                        </td>
                        <td>
                          <b-form-input
                            type="text"
                            size="sm"
                            maxlength="1"
                            v-mask="maxLengthMask"
                            class="text-center"
                            :disabled="!isEdit"
                            v-model="item.Length"
                          />
                        </td>
                        <td
                          width="5px"
                          class="text-center"
                          style="border:0px;background-color:#ffffff"
                        ></td>
                      </tr>
                    </template>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" style="text-align:right;">
                        <span style="text-align:right;margin-right:20px;" disabled>Total</span>
                      </td>
                      <td>
                        <b-form-input
                          type="text"
                          size="sm"
                          disabled
                          class="text-center font-weight-bold text-primary"
                          v-model="CurrentCOALength"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" style="text-align:right;">
                        <span style="text-align:right;margin-right:20px;">Max</span>
                      </td>
                      <td>
                        <b-form-input
                          type="text"
                          size="sm"
                          v-model="MaxCOALength"
                          :hide-details="true"
                          class="text-center font-weight-bold"
                          :readonly="true"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import DataGrid from "@/components/Tables/DataGrid";
import loginServices from "../services/loginservices";
import { mask } from "vue-the-mask";
import cloneDeep from "lodash.cloneDeep";

export default {
  layout: "dashboard",
  components: {
    VueElementLoading,
    DataGrid
  },
  directives: {
    mask
  },
  data() {
    return {
      actionButton: {
        AllowSave: true,
        AllowEdit: true,
        AllowPosting: false,
        AllowVoid: false
      },
      dataSegments: [],
      accountData: 0,
      isForm: false,
      isEdit: false,
      blockLoader: false,
      MaxCOALength: 0,
      CurrentCOALength: 0,
      showButton: true,
      maxLengthMask: "#",
      headerFields: [
        {
          key: "AccountId",
          label: "Account Code",
          classes: "text-center",
          filter: true
        },
        {
          key: "Description",
          label: "Description",
          filter: true
        }
      ]
    };
  },
  watch: {
    dataSegments: {
      handler: function(after, before) {
        this.doCalculateDetails();
      },
      deep: true
    }
  },
  async mounted() {
    await this.bindFormData();

    await this.checkAccountData();
  },
  methods: {
    showLoader(val) {
      if (!val) {
        setTimeout(() => {
          this.blockLoader = false;
        }, 300);
      } else {
        this.blockLoader = val;
      }
    },
    async checkAccountData() {
      await this.$store.dispatch(
        "features/company/account/actGetAccount",
        "Account?"
      );

      var accountData = this.$store.state.features.company.account.data;
      this.accountData = accountData.length;

      if (this.accountData > 0 && this.$store.state.roleaccess.AllowEdit) {
        this.actionButton.AllowEdit = false;
      } else {
        this.actionButton.AllowEdit = true;
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
    async onFormClose() {
      this.ErrorMessage = "";
      this.isEdit = false;

      this.resetForm();
    },
    async changeMainAccount(index) {
      if (index > -1) {
        for (let i = 0; i < this.dataSegments.length; i++) {
          if (i != index) {
            this.dataSegments[i].IsMainAccount = false;
          }
        }
      }
    },
    async bindFormData() {
      await this.$store.dispatch(
        "features/company/account_segment/actGetAccountSegment",
        null
      );

      var data = this.$store.state.features.company.account_segment.data;
      this.MaxCOALength = this.$store.state.features.company.account_segment.CoaTotalLength;

      this.dataSegments = cloneDeep(data);
    },
    async handleEdit() {
      await this.checkAccountData();
      if (this.actionButton.AllowEdit) this.isEdit = true;
    },
    async doCalculateDetails() {
      let currentLength = 0;

      if (Array.isArray(this.dataSegments) && this.dataSegments.length) {
        this.dataSegments.forEach(function(detail) {
          currentLength += parseInt(detail.Length);
        });
      }

      this.CurrentCOALength = currentLength;
    },
    validateForm() {
      let valid = true;

      if (this.dataSegments.length <= 0) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Segment details must not empty !"
        );
      }

      if (this.dataSegments.length > 10) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Maximum segment allowed is 10 !"
        );
      }

      if (valid) {
        this.dataSegments.forEach(function(det) {
          if (det.Description == "" || det.Length < 1) {
            valid = false;
            return;
          }
        });

        if (!valid) {
          this.handleToast(
            "Warning",
            "danger",
            "Segment Description & Length must be filled !"
          );
        }
      }

      if (valid) {
        if (this.CurrentCOALength > this.MaxCOALength) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Total Segment Length must not exceed " + this.MaxCOALength + " !"
          );
        }
      }

      return valid;
    },
    async doDetailAppendSegment() {
      this.dataSegments.push({
        SegmentNo: this.dataSegments.length + 1,
        SegmentId: "",
        Description: "",
        Length: 0,
        IsMainAccount: false
      });
    },
    async onSubmit() {
      if (this.validateForm()) {
        this.showLoader(true);

        if (this.isEdit) {
          await this.$store.dispatch(
            "features/company/account_segment/actPostAccountSegment",
            this.dataSegments
          );

          var response = this.$store.state.features.company.account_segment.resultPost;
          if (response.status != 200) {
            this.handleToast(
              "Confirmation",
              "danger",
              response.data.ErrorDescription != undefined
                ? response.data.ErrorDescription
                : "Update failed !"
            );
          } else {
            this.isEdit = false;
            await this.bindFormData();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        }

        this.showLoader(false);
      }
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
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
  border: 1px solid rgb(165, 165, 165);
  padding: 1px !important;
  font-size: 12px;
  text-transform: uppercase;
  text-align: center;
  height: 20px !important;
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
