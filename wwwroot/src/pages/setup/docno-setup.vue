<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)" id="body-form">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold text-uppercase">Document No Setup</span>
                <small>Config</small>
                <div right style="float:right;">
                  <a
                    href="javascript:;"
                    v-if="!form.isEdit && $store.state.roleaccess.AllowEdit"
                    @click="form.isEdit=true"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'edit']" />&nbsp;Edit
                  </a>
                  <b-button
                    variant="blue"
                    type="submit"
                    v-if="form.isEdit && $store.state.roleaccess.AllowNew"
                  >
                    <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                  </b-button>
                  <a
                    href="javascript:;"
                    v-if="form.isEdit"
                    @click="onCancel"
                    class="btn btn-outline-secondary"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />&nbsp;Cancel
                  </a>
                </div>
              </div>
              <template v-for="(item, itemIndex) in form.dataDetails">
                <b-alert show class="font-weight-bold mt-2">
                  <strong>{{item.Group}}</strong>
                </b-alert>
                <b-row
                  v-for="(param, paramIndex) in item.Features"
                  v-bind:key="param.DocFeatureId"
                  class="ml-1"
                >
                  <b-col sm="6" lg="4" style="padding-top:6px;">{{param.Description}}</b-col>
                  <b-col sm="6" lg="2">
                    <b-input-group prepend>
                      <b-form-input
                        v-model="param.DocNo"
                        readonly
                        size="sm"
                        class="font-weight-bold"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button
                          v-b-tooltip.hover
                          title="Select Document No"
                          size="sm"
                          variant="outline-primary"
                          @click="onModalSearchDocNo(param.DocFeatureId, '')"
                          v-if="form.isEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                        <b-button
                          v-b-tooltip.hover
                          title="Clear"
                          variant="outline-danger"
                          v-if="form.isEdit"
                          @click="param.DocNo='', param.Description=''"
                          size="sm"
                        >
                          <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col sm="6" lg="3">
                    <b-input-group prepend>
                      <b-input-group-prepend>
                        <b-button 
                          v-b-tooltip.hover 
                          title="Approval Setup (if necessary)"
                          size="sm"
                          variant="outline-secondary"
                          @click="openApprovalSetupForm(param)"
                          v-if="form.isEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-prepend >
                        <b-button variant="secondary" size="sm" v-if="param.ApprovalSetups.length > 0" >
                        Approval Setups <b-badge variant="danger">{{param.ApprovalSetups.length > 0 ? param.ApprovalSetups.length : ''}}</b-badge>
                      </b-button>
                    </b-input-group>                
                  </b-col>
                </b-row>
              </template>
              <b-col sm="12" md="12" class="mt-3 pl-1 pb-0 mb-0">
                <b-input-group>
                  <template v-slot:prepend>
                    <b-form-select
                      class="ml-2 font-weight-bold text-dark"
                      name="Module"
                      v-model="form.model.TrxModule"
                      size="md"
                      :plain="true"
                      :options="listTrxModule"
                      style="max-height:43px;"
                    />
                  </template>
                  <b-alert show class="ml-2 font-weight-bold text-uppercase">
                    <strong>Transaction Type By</strong>
                  </b-alert>
                  <b-form-select
                    class="ml-2 font-weight-bold text-purple"
                    name="Transaction Type"
                    v-model="form.model.TransactionType"
                    size="md"
                    :plain="true"
                    :options="listTransactionType"
                    style="max-height:43px;"
                  />
                </b-input-group>
              </b-col>
              <template v-for="(item, itemIndex) in filterByTrx" class="mt-0">
                <!--b-alert show class="font-weight-bold mt-2">{{item.Group}}</b-alert-->
                <b-row
                  v-for="(param, paramIndex) in item.Features"
                  v-bind:key="param.DocFeatureId"
                  class="ml-1 mt-0 pt-0"
                >
                  <b-col sm="6" lg="4" style="padding-top:6px;">{{param.Description}}</b-col>
                  <b-col sm="6" lg="2">
                    <b-input-group prepend>
                      <b-form-input
                        v-model="param.DocNo"
                        readonly
                        size="sm"
                        class="font-weight-bold"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button
                          v-b-tooltip.hover
                          title="Select Document No"
                          size="sm"
                          variant="outline-primary"
                          @click="onModalSearchDocNo(param.DocFeatureId, param.TransactionType)"
                          v-if="form.isEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                        </b-button>
                        <b-button
                          v-b-tooltip.hover
                          title="Clear"
                          variant="outline-danger"
                          v-if="form.isEdit"
                          @click="param.DocNo=''"
                          size="sm"
                        >
                          <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col sm="6" lg="3">
                    <b-input-group prepend>
                      <b-input-group-prepend>
                        <b-button 
                          v-b-tooltip.hover 
                          title="Approval Setup (if necessary)"
                          size="sm"
                          variant="outline-secondary"
                          @click="openApprovalSetupForm(param)"
                          v-if="form.isEdit"
                        >
                          <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                        </b-button>
                      </b-input-group-prepend >
                        <b-button variant="secondary" size="sm" v-if="param.ApprovalSetups.length > 0" >
                        Approval Setups <b-badge variant="danger">{{param.ApprovalSetups.length > 0 ? param.ApprovalSetups.length : ''}}</b-badge>
                      </b-button>
                    </b-input-group>                
                  </b-col>
                </b-row>
              </template>
              <div></div>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <!-- Modal -->
    <DocNumberModal ref="dlgDocNo" :actSelectedRow="onSelectedDocNo"></DocNumberModal>
    <ApprovalModal ref="dlgApproval" :actSelectedRow="onSelectedApproval"></ApprovalModal>
    <!-- Modal -->

    <div id="dialog-approval">
      <b-modal v-model="IsFormApproval" 
      @ok="handleOk"
      @hide="resetModalApproval"
      @cancel="handleCancel">
        <template v-slot:modal-title>{{form.approval.Description}} Approval Setups</template>
        <div class="d-block text-left">
          <b-card-text>
            <b-row class="mt-0">
              <b-col sm="12">
                <b-button variant="yellow" size="sm" type="button" @click="onModalSearchApproval(form.approval)" >
                  <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Approval Setup
                </b-button>
              </b-col>
            </b-row>
            <!-- DETIL BEGIN -->
            <b-row class="mt-1">
              <b-col>
                <table
                  id="table-approval"
                  width="100%"
                  class="table-light table-striped table-hover table-bordered"
                >
                  <thead>
                    <tr>
                      <th class="text-center" width="50px">
                        <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                      </th>
                      <th class="text-left" width="50%">Approval Code</th>
                      <th class="text-left">Mode Status</th>                      
                    </tr>
                  </thead>
                  <tbody class="position-relative">
                    <template v-for="(item, itemIndex) in form.approval.ApprovalSetups">
                      <tr>
                        <td class="text-center">
                          <a href="#" @click="deleteApprovalDetail(itemIndex)">
                          <font-awesome-icon
                            :icon="['fas', 'trash']"                            
                          /></a>
                        </td>
                        <td>
                          <b-form-input size="sm"
                                          v-model="item.ApprovalCode"
                                          readonly
                                          aria-describedby="approval-feedback"></b-form-input>
                        </td>  
                        <td>
                          <b-form-select
                            name="Transaction Type"
                            v-model="item.ModeStatus"
                            :plain="true"
                            :options="listStatus"
                            value-field="value"
                            text-field="text"
                            size="sm"
                          />
                        </td>
                                              
                      </tr>
                    </template>
                  </tbody>
                  <slot name="caption" />
                </table>
              </b-col>
            </b-row>
            <!-- DETIL END -->
          </b-card-text>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import loginServices from "@/services/loginservices";
import { DocNumberModal, ApprovalModal } from "@/pages/modal/index.js";
import util from "@/helper/utils";

export default {
  name: "DocNumberSetup",
  layout: "dashboard",
  components: {
    VueElementLoading,
    DocNumberModal,
    ApprovalModal
  },
  data() {
    return {
      caption: "Document Number Setup",
      isForm: false,
      blockLoader: false,
      perPage: 20,
      listTrxModule: [],
      listTransactionType: [],
      listStatus : [
        {value:util.docStatus('new'), text:'NEW'},  {value:util.docStatus('approved'), text:'APPROVED'},
        {value:util.docStatus('submit'), text:'SUBMIT'},  {value:util.docStatus('open'), text:'OPEN'},
      ],
      isNewByTrxType: false,
      IsFormApproval: false,
      form: {
        valid: false,
        isEdit: false,
        dataDetails: [],
        dataDetails2: [],
        model: {
          TransactionType: "",
          DocFeatureId: 0,
          TrxModule: 0,
          DocNumberSetups: Array,
          TrxTypeSetups: Array
        },
        approval: {
          Description: "",
          TransactionType: "",
          DocFeatureId: 0,
          TrxModule: 0,
          ModeStatus: 0,
          ApprovalCode: "",
          ApprovalSetups:[],
        }
      }
    };
  },
  async mounted() {
    this.onBind();
  },
  computed: {
    filterByTrx() {
      return this.form.dataDetails2.filter(
        el =>
          el.Group == this.form.model.TransactionType &&
          el.TrxModule == this.form.model.TrxModule
      );
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
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onBind() {
      // START GET TRANSACTION TYPE
      var arrTransactionType = [];
      await this.$store.dispatch(
        "features/company/transaction_type/actGetRawData",
        "MSTransactionType?"
      );
      var msTrxType = this.$store.state.features.company.transaction_type.data;

      msTrxType.forEach(function(row) {
        arrTransactionType.push({
          value: row.TransactionType,
          text: row.TransactionType
        });
      });
      this.listTransactionType = arrTransactionType;

      if (this.listTransactionType.length > 0) {
        this.form.model.TransactionType = this.listTransactionType[0].value;
      }

      // END GET TRANSACTION TYPE

      let data = await this.$store.dispatch(
        "features/finance/constants/actGetDocNumberSetup"
      );

      var arrTrxModules = [];
      if (data != undefined) {
        this.form.dataDetails = data.DocNumberSetups;
        this.form.dataDetails2 = data.TrxTypeSetups;
        data.TrxModules.forEach(function(item) {
          arrTrxModules.push({
            value: item.TrxModule,
            text: item.Caption
          });
        });
      }

      this.listTrxModule = arrTrxModules;

      if (this.listTrxModule.length > 0) {
        this.form.model.TrxModule = this.listTrxModule[0].value;
      }
    },
    async onChangeTransactionType() {
      let currentTrxType = this.form.model.TransactionType;
    },
    async onModalSearchDocNo(row, trxtype) {
      this.$refs.dlgDocNo
        .open({ DocFeatureId: row, TransactionType: trxtype })
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedDocNo(item, modelReff) {
      this.form.dataDetails.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            if (
              detail.DocFeatureId == modelReff.DocFeatureId &&
              detail.TransactionType == modelReff.TransactionType
            ) {
              detail.DocNo = item.DocumentId;
            }
          });
        }
      });

      let trxModule = this.form.model.TrxModule;

      this.form.dataDetails2.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            if (
              detail.DocFeatureId == modelReff.DocFeatureId &&
              detail.TransactionType == modelReff.TransactionType
            ) {
              detail.DocNo = item.DocumentId;
              detail.TrxModule = trxModule;
            }
          });
        }
      });
    },
    async openApprovalSetupForm(row) {
      this.form.approval.Description = row.Description;
      this.form.approval.TransactionType = row.TransactionType;
      this.form.approval.DocFeatureId = row.DocFeatureId;
      this.form.approval.TrxModule = row.TrxModule;
      this.form.approval.ModeStatus = row.ModeStatus;
      this.form.approval.ApprovalCode = row.ApprovalCode;
      this.form.approval.ApprovalSetups = row.ApprovalSetups;

      this.IsFormApproval = true;
    },
    resetModalApproval() {
      this.form.approval.Description = '';
      this.form.approval.TransactionType = '';
      this.form.approval.DocFeatureId = 0;
      this.form.approval.TrxModule = 0;
      this.form.approval.ModeStatus = 1;
      this.form.approval.ApprovalCode = '';
      this.form.approval.ApprovalSetups = [];

    },
    handleOk() {
      let approvalDocFeatureId = this.form.approval.DocFeatureId;
      let approvalTransactionType = this.form.approval.TransactionType;
      let setups = this.form.approval.ApprovalSetups;

      this.form.dataDetails.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            if (
              detail.DocFeatureId == approvalDocFeatureId &&
              detail.TransactionType == approvalTransactionType
            ) {
              detail.ApprovalSetups = setups;
            }
          });
        }
      });

      let trxModule = this.form.model.TrxModule;

      this.form.dataDetails2.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            if (
              detail.DocFeatureId == approvalDocFeatureId &&
              detail.TransactionType == approvalTransactionType
            ) {
              detail.ApprovalSetups = setups;
            }
          });
        }
      });

      this.resetModalApproval();

      this.IsFormApproval = false;
    },
    handleCancel(str) {
      this.IsFormApproval = false;
    },
    async deleteApprovalDetail(index) {
      this.form.approval.ApprovalSetups.splice(index, 1); 
    },
    async onModalSearchApproval(row) {
      this.$refs.dlgApproval
        .open(row)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedApproval(item, modelReff) {
      this.form.approval.ApprovalSetups.push({
        TransactionType: this.form.approval.TransactionType,
        DocFeatureId: this.form.approval.DocFeatureId,
        TrxModule: this.form.approval.TrxModule,
        ModeStatus: util.docStatus('new'),
        ApprovalCode: item.ApprovalCode,
      });
    },
    async handleSubmit() {
      this.showLoader(true);

      let params = [];

      this.form.dataDetails.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            params.push({
              DocNumberId: detail.DocNumberId,
              TrxModule: detail.TrxModule,
              DocFeatureId: detail.DocFeatureId,
              TransactionType: detail.TransactionType,
              DocNo: detail.DocNo,
              Description: detail.Description,
              ApprovalSetups : detail.ApprovalSetups,
            });
          });
        }
      });

      let params2 = [];
      this.form.dataDetails2.forEach(function(group) {
        if (Array.isArray(group.Features)) {
          group.Features.forEach(function(detail) {
            params2.push({
              DocNumberId: detail.DocNumberId,
              TrxModule: detail.TrxModule,
              DocFeatureId: detail.DocFeatureId,
              TransactionType: detail.TransactionType,
              DocNo: detail.DocNo,
              Description: detail.Description,
              ApprovalSetups : detail.ApprovalSetups,
            });
          });
        }
      });

      this.form.model.DocNumberSetups = params;
      this.form.model.TrxTypeSetups = params2;

      await this.$store.dispatch(
        "features/finance/constants/actUpdateDocNumberSetup",
        this.form.model
      );

      var response = this.$store.state.features.finance.constants.resultUpdate;

      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.isForm = false;
        this.form.isEdit = false;

        await this.onBind();

        this.handleToast("Confirmation", "success", "Successfully updated");
      }

      this.showLoader(false);
    },
    async onCancel() {
      this.form.isEdit = false;
      this.resetForm();
      this.onBind();
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
    },
    async onSubmitApproval() {
      this.$bvModal
        .msgBoxConfirm("Save your Approval Setup changes ?", {
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
            //this.handleSubmit();
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
#body-form .row {
  font-size: 12px;
  vertical-align: middle;
  background-color: #f5f5f5;
  margin: 5px 1px;
  padding: 2px;
}

#table-approval thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-approval tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-approval tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-approval input:disabled {
  background-color: #e8eaf6;
  cursor: text;
  margin: 0em;
  border: 1px solid #c2cfd6;
}

</style>