<template>
  <div class="animated fadeIn">
    <validation-observer ref="observer" v-slot="{ handleSubmit }" v-show="isForm">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <span class="font-weight-bold">Charge</span>
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
                <b-col sm="4" lg="3">
                  <validation-provider
                    name="Charges Code"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="ChargesCode">Charges Code</label>
                      <span style="color:red;">*</span>
                      <b-form-input
                        name="Charges Code"
                        type="text"
                        size="sm"
                        class="font-weight-bold text-purple"
                        placeholder="Charges Code"
                        v-model="form.model.ChargesCode"
                        :state="validateState(validationContext)"
                        aria-describedby="Charges-feedback"
                        :disabled="form.isEdit"
                      />
                      <b-form-invalid-feedback
                        id="Charges-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="8" lg="6">
                  <validation-provider
                    name="Charges Name"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="ChargesCode">Charges Name</label>
                      <span style="color:red;">*</span>
                      <b-form-input
                        name="ChargesName"
                        type="text"
                        size="sm"
                        placeholder="ChargesName"
                        v-model="form.model.ChargesName"
                        :state="validateState(validationContext)"
                        aria-describedby="name-feedback"
                      />
                      <b-form-invalid-feedback id="name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4" lg="3">
                  <validation-provider
                    name="Transaction Type"
                    :rules="{ required: true }"
                    v-slot="validationContext"
                  >
                    <b-form-group>
                      <label for="TrxType">Transaction Type</label>
                      <span style="color:red;">*</span>
                      <b-form-select
                        name="Transaction Type"
                        v-model="form.model.TransactionType"
                        :state="validateState(validationContext)"
                        :plain="true"
                        :options="listTransactionType"
                        size="sm"
                        aria-describedby="trxtype-feedback"
                      />
                      <b-form-invalid-feedback
                        id="trxtype-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <b-col sm="8" lg="6">
                  <label v-b-tooltip.hover title="Module(s) which using this charge">Module</label>
                  <span style="color:red;">*</span>
                  <b-form-group size="sm">
                    <b-form-checkbox v-model="form.model.IsPurchasing" style="float:left">Purchasing</b-form-checkbox>
                    <b-form-checkbox
                      v-model="form.model.IsSales"
                      style="float:left"
                      class="ml-4"
                    >Sales</b-form-checkbox>
                    <b-form-checkbox
                      v-model="form.model.IsFinancial"
                      style="float:left"
                      class="ml-4"
                    >Financial</b-form-checkbox>
                    <b-form-checkbox
                      v-model="form.model.IsInventory"
                      style="float:left"
                      class="ml-4"
                    >Inventory</b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4" lg="3">
                  <label class="font-weight-bold">
                    Have
                    <code>COSTING</code> charge ?
                  </label>
                  <b-form-group size="sm">
                    <b-form-checkbox
                      v-model="form.model.HasCosting"
                      style="float:left"
                    >YES, at least one Buying</b-form-checkbox>
                  </b-form-group>
                </b-col>
                <b-col sm="4" lg="3">
                  <label class="font-weight-bold">
                    Is this a
                    <code>DEPOSIT CHARGE</code>&nbsp;?
                  </label>
                  <b-form-group size="sm">
                    <b-form-checkbox v-model="form.model.IsDeposit" style="float:left">YES</b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>

            <div>
              <!-- BEGIN TABS -->
              <b-tabs pills card>
                <!-- TAB MAIN -->
                <b-tab active ref="tabMain">
                  <template v-slot:title>
                    <font-awesome-icon :icon="['fas', 'trophy']" />&nbsp;Main
                  </template>
                  <b-card-group deck>
                    <!-- Charges Type -->
                    <b-card class="text-left" border-variant="success">
                      <b-card-title>
                        <code>{{ form.model.TransactionType }}</code>
                      </b-card-title>
                      <b-card-text>
                        <b-row sm="12">
                          <b-col sm="3">
                            <validation-provider
                              name="Revenue Account No"
                              :rules="{ required: true }"
                              v-slot="validationContext"
                            >
                              <label>Revenue Account No</label>
                              <span style="color:red;">*</span>
                              <b-input-group prepend>
                                <b-form-input
                                  v-model="form.model.RevenueAccountNo"
                                  size="sm"
                                  :state="validateState(validationContext)"
                                  readonly
                                  aria-describedby="RevenueAccountNo-feedback"
                                ></b-form-input>
                                <b-input-group-append>
                                  <b-button
                                    variant="outline-success"
                                    size="sm"
                                    @click="onModalSearchAccount('RevenueAccountNo')"
                                  >
                                    <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                  </b-button>
                                  <b-button
                                    variant="outline-danger"
                                    size="sm"
                                    v-if="form.model.RevenueAccountNo"
                                    @click="form.model.RevenueAccountNo=''"
                                  >
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                                <b-form-invalid-feedback
                                  id="RevenueAccountNo-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-input-group>
                            </validation-provider>
                          </b-col>
                          <b-col sm="3">
                            <validation-provider
                              name="Cost Account No"
                              :rules="{ required: true }"
                              v-slot="validationContext"
                            >
                              <label>Cost Account No</label>
                              <span style="color:red;">*</span>
                              <b-input-group prepend>
                                <b-form-input
                                  v-model="form.model.CostAccountNo"
                                  size="sm"
                                  :state="validateState(validationContext)"
                                  readonly
                                  aria-describedby="CostAccountNo-feedback"
                                ></b-form-input>
                                <b-input-group-append>
                                  <b-button
                                    variant="outline-success"
                                    size="sm"
                                    @click="onModalSearchAccount('CostAccountNo')"
                                  >
                                    <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                  </b-button>
                                  <b-button
                                    variant="outline-danger"
                                    size="sm"
                                    v-if="form.model.CostAccountNo"
                                    @click="form.model.CostAccountNo=''"
                                  >
                                    <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                  </b-button>
                                </b-input-group-append>
                                <b-form-invalid-feedback
                                  id="CostAccountNo-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </b-input-group>
                            </validation-provider>
                          </b-col>

                          <b-col sm="3">
                            <label>Temp Revenue Account No</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.TempRevenueAccountNo"
                                size="sm"
                                readonly
                                aria-describedby="TempRevenueAccountNo-feedback"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-success"
                                  size="sm"
                                  @click="onModalSearchAccount('TempRevenueAccountNo')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button
                                  variant="outline-danger"
                                  size="sm"
                                  v-if="form.model.TempRevenueAccountNo"
                                  @click="form.model.TempRevenueAccountNo=''"
                                >
                                  <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>

                          <b-col sm="3">
                            <label>Tax Schedules</label>
                            <b-input-group prepend>
                              <b-form-input
                                v-model="form.model.TaxScheduleCode"
                                size="sm"
                                readonly
                                aria-describedby="TempRevenueAccountNo-feedback"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-button
                                  variant="outline-success"
                                  size="sm"
                                  @click="onModalSearchSchedule('TaxScheduleCode')"
                                >
                                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                </b-button>
                                <b-button
                                  variant="outline-danger"
                                  size="sm"
                                  v-if="form.model.TaxScheduleCode"
                                  @click="form.model.TaxScheduleCode=''"
                                >
                                  <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
                                </b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mt-3">
                          <b-col sm="5" lg="3">
                            <label>Shipping Line Type</label>
                            <b-form-select v-model="form.model.ShippingLineType" size="sm">
                              <b-form-select-option value="NONE">NONE</b-form-select-option>
                              <b-form-select-option value="SEA">SEA</b-form-select-option>
                              <b-form-select-option value="AIR">AIR</b-form-select-option>
                              <b-form-select-option value="LAND">LAND</b-form-select-option>
                            </b-form-select>
                          </b-col>
                          <b-col sm="4" lg="3">
                            <b-form-group>
                              <label>Charge Group Code</label>
                              <b-form-select
                                id="GroupCode"
                                name="GroupCode"
                                size="sm"
                                v-model="form.model.ChargeGroupCode"
                                :plain="true"
                                :options="GroupCode"
                                @change="handleGetnameGroup()"
                              />
                            </b-form-group>
                          </b-col>
                          <b-col sm="8" lg="3">
                            <b-form-group>
                              <label for="ChargesGroupCode">Charge Group Name</label>
                              <b-form-input
                                name="ChargeGroupName"
                                type="text"
                                size="sm"
                                placeholder="ChargeGroupName"
                                v-model="form.model.ChargeGroupName"
                                disabled
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-card-text>
                    </b-card>
                  </b-card-group>
                </b-tab>
                <!-- TAB EXTENTION -->
                <b-tab >
                  <template v-slot:title>
                    <font-awesome-icon :icon="['fas', 'puzzle-piece']" />&nbsp;Shipping Line
                  </template>
                  <b-card-group deck>
                    <b-card class="text-left" border-variant="success">
                      <b-card-title>
                        <code>{{ form.model.TransactionType }}</code>
                      </b-card-title>
                      <b-card-text>
                        <b-row>
                          <b-col>
                            <b-button
                              variant="yellow"
                              size="sm"
                              type="button"
                              :disabled="form.model.ChargesCode==''"
                              @click="onAddNewChargeDetail"
                            >
                              <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add
                            </b-button>
                          </b-col>
                        </b-row>
                        <b-row class="mt-2">
                          <b-col
                            sm="12"
                            class="position-relative table-responsive"
                            style="height:400px;"
                          >
                            <table
                              id="table-detail"
                              width="100%"
                              class="table-light table-striped table-hover table-bordered"
                            >
                              <thead>
                                <tr>
                                  <th
                                    class="text-center"
                                    rowspan="2"
                                    style="vertical-align: middle;"
                                    width="40px"
                                  >
                                    <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                                  </th>
                                  <th class="text-center" width="130">SHIPPING LINE CODE</th>
                                  <th class="text-center">SHIPPING LINE NAME</th>
                                  <th class="text-center" width="150">REVENUE ACCOUNT</th>
                                  <th class="text-center" width="150">COST ACCOUNT</th>
                                  <th class="text-center" width="180">TEMP REVENUE ACCOUNT</th>
                                </tr>
                              </thead>
                              <tbody class="position-relative">
                                <template v-for="(item, itemIndex) in form.dataDetails">
                                  <tr>
                                    <td class="text-center">
                                      <b-button
                                        variant="danger"
                                        pill
                                        size="sm"
                                        @click="deleteRow(itemIndex)"
                                      >
                                        <font-awesome-icon :icon="['fas', 'trash']" />
                                      </b-button>
                                    </td>
                                    <td>
                                      <b-input-group prepend>
                                        <b-form-input
                                          type="text"
                                          placeholder="Shipping Line"
                                          v-model="item.ShippingLineCode"
                                          aria-describedby="shipperline-name"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchShippingLine(item)"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </td>
                                    <td>{{item.ShippingLineName}}</td>
                                    <td>
                                      <b-input-group prepend>
                                        <b-form-input
                                          type="text"
                                          placeholder="Revenue Account"
                                          v-model="item.RevenueAccountNo"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchCOADetail(item, 'RevenueAccountNo')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </td>
                                    <td>
                                      <b-input-group prepend>
                                        <b-form-input
                                          type="text"
                                          placeholder="Cost Account"
                                          v-model="item.CostAccountNo"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchCOADetail(item, 'CostAccountNo')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </td>
                                    <td>
                                      <b-input-group prepend>
                                        <b-form-input
                                          type="text"
                                          placeholder="Temp Revenue"
                                          v-model="item.TempRevenueAccountNo"
                                          size="sm"
                                          readonly
                                        />
                                        <b-input-group-append>
                                          <b-button
                                            variant="outline-primary"
                                            size="sm"
                                            @click="onModalSearchCOADetail(item, 'TempRevenueAccountNo')"
                                          >
                                            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                          </b-button>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </td>
                                  </tr>
                                </template>
                              </tbody>
                              <tfoot></tfoot>
                              <slot name="caption" />
                            </table>
                          </b-col>
                        </b-row>
                      </b-card-text>
                    </b-card>
                  </b-card-group>
                </b-tab>
              </b-tabs>

              <!-- END TABS -->
            </div>
            <b-row class="mt-3">
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
                      size="sm"
                      v-model="form.model.InActive"
                      :state="validateState(validationContext)"
                      :plain="true"
                      :options="[{value:false,text:'Active'},{value:true,text:'Inactive'}]"
                      aria-describedby="status-feedback"
                    />
                    <b-form-invalid-feedback id="status-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

    <AccountModal ref="dlgAccount" :actSelectedRow="onSelectedCOA"></AccountModal>
    <AccountModal ref="dlgAccountDetail" :actSelectedRow="onSelectedCOADetail"></AccountModal>
    <ScheduleModal ref="dlgSchedule" :actSelectedRow="onSelectSchedule"></ScheduleModal>
    <ShippingLineModal ref="dlgShippingLine" :actSelectedRow="onSelectedShippingLine"></ShippingLineModal>

    <b-tabs pills card v-show="!isForm">
      <!-- TAB CHARGES START -->
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp; Charges
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid
                ref="gridMain"
                :fields="headerFields"
                :items="this.$store.state.features.company.charges.data"
                :info="this.$store.state.features.company.charges.listInfo"
                :baseUrl="this.$store.state.features.company.charges.baseUrl"
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
      </b-tab>
      <!-- TAB CHARGES END -->
      <!-- TAB CHARGES START -->
      <b-tab @click="isTabDeposit">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'archive']" />&nbsp; Deposit
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  ref="gridDeposit"
                  :fields="headerFields"
                  :items="this.$store.state.features.company.charges_deposit.data"
                  :info="this.$store.state.features.company.charges_deposit.listInfo"
                  :baseUrl="this.$store.state.features.company.charges_deposit.baseUrl"
                  :actGetData="handleGetDeposit"
                  :actCreate="onFormCreate"
                  :actEditRow="handleEdit"
                  :actDeleteRow="handleDelete"
                  addTableClasses="table-bordered"
                  disableNewButton
                  :isEdit="this.$store.state.roleaccess.AllowEdit"
                  :isDelete="this.$store.state.roleaccess.AllowDelete"
                  responsive
                  items-per-page-select
                  loading
                  hover
                  sorter
                  pagination
                  column-filter
                  caption="Deposits"
                ></DataGrid>
              </b-card>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
      <!-- TAB CHARGES END -->
    </b-tabs>
  </div>
</template>
<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import {
  AccountModal,
  ScheduleModal,
  ShippingLineModal
} from "@/pages/modal/index.js";
import loginServices from "../services/loginservices";
import cloneDeep from "lodash.cloneDeep";

export default {
  name: "Charges",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    AccountModal,
    ScheduleModal,
    ShippingLineModal
  },
  data: () => {
    return {
      caption: "Charges",
      isForm: false,
      isShowSchedule: false,
      isTabMain: true,
      perPage: 20,
      selectfield: "",
      GroupCode: [],
      itemDeposit: [],
      DepositInfo: [],
      listTransactionType: [],
      //DataGrid HEADERS Declarations, you can
      headerFields: [
        { key: "ChargesCode", label: "Charges Code", width: 300 },
        { key: "ChargesName", label: "Charges Name", classes: "text-center" },
        {
          key: "TransactionType",
          label: "Transaction Type",
          classes: "text-center"
        },
        {
          key: "ShippingLineType",
          label: "Shipping Type",
          classes: "text-center"
        },
        {
          key: "InActive",
          label: "Status",
          _classes: "text-center",
          width: 100,
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
        addrFieldelectSchedule: "TaxScheduleCode",
        model: {
          ChargesCode: "",
          ChargeGroupCode: "",
          ChargesName: "",
          ChargeGroupName: "",
          TransactionType: "",
          IsPurchasing: false,
          IsSales: false,
          IsInventory: false,
          IsFinancial: false,
          IsAsset: false,
          IsDeposit: false,
          RevenueAccountNo: "",
          TempRevenueAccountNo: "",
          CostAccountNo: "",
          TaxScheduleCode: "",
          ShippingLineType: "NONE",
          HasCosting: false,
          InActive: false,
          ChargesDetails: []
        },
        dataDetails: []
      }
    };
  },
  async mounted() {
    if (this.$refs.gridDeposit != null) {
      await this.$refs.gridDeposit.doRefresh();
    }

    if (this.$refs.gridMain != null) {
      await this.$refs.gridMain.doRefresh();
    }
    await this.$store.dispatch(
      "features/company/charge_group/actGetData",
      null
    );
    var arr = [];
    arr.push({ value: "", text: "NONE" });

    this.$store.state.features.company.charge_group.data.forEach(function(
      row,
      index
    ) {
      arr.push({ value: row.ChargeGroupCode, text: row.ChargeGroupCode });
    });
    this.GroupCode = arr;

    //);

    // START GET TRANSACTION TYPE
    var arrTransactionType = [];
    await this.$store.dispatch(
      "features/company/transaction_type/actGetData",
      "MSTransactionType?"
    );
    var data = this.$store.state.features.company.transaction_type.data;

    data.forEach(function(row) {
      arrTransactionType.push({
        value: row.TransactionType,
        text: row.TransactionType
      });
    });
    this.listTransactionType = arrTransactionType;
    // END GET TRANSACTION TYPE
  },
  computed: {
    isSave() {
      return this.form.isEdit ? this.$store.state.roleaccess.AllowEdit : true;
    }
  },
  methods: {
    async handleGetnameGroup() {
      var name = this.form.model.ChargeGroupCode;
      var GroupName = "";
      this.$store.state.features.company.charge_group.data.forEach(function(
        row,
        index
      ) {
        if (row.ChargeGroupCode == name) {
          GroupName = row.ChargeGroupName;
        }
      });
      this.form.model.ChargeGroupName = GroupName;
    },
    async onModalSearchAccount(row) {
      this.$refs.dlgAccount
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onModalSearchSchedule(row) {
      this.$refs.dlgSchedule
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCOA(item, modelReff) {
      this.form.model[modelReff] = item.AccountId;
    },
    async onSelectSchedule(item, modelReff) {
      this.form.model[modelReff] = item.TaxScheduleCode;
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
      await this.$store.dispatch("features/company/charges/actGetCharges", url);
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetDeposit(url) {
      await this.$store.dispatch(
        "features/company/charges_deposit/actGetCharges",
        url
      );
      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async isTabDeposit() {
      this.itemDeposit = this.$store.state.features.company.charges_deposit.data;
      this.DepositInfo = this.$store.state.features.company.charges_deposit.listInfo;
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isForm = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    async onFormCreate() {
      this.resetForm();

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
      this.form.model.ChargesId = row.ChargesId;
      this.form.model.ChargesCode = row.ChargesCode;
      this.form.model.ChargeGroupCode = row.ChargeGroupCode;
      this.form.model.ChargeGroupName = row.ChargeGroupName;
      this.form.model.TransactionType = row.TransactionType;
      this.form.model.ChargesName = row.ChargesName;
      this.form.model.IsPurchasing = row.IsPurchasing;
      this.form.model.IsSales = row.IsSales;
      this.form.model.IsInventory = row.IsInventory;
      this.form.model.IsFinancial = row.IsFinancial;
      this.form.model.IsAsset = row.IsAsset;
      this.form.model.IsDeposit = row.IsDeposit;

      this.form.model.RevenueAccountNo = row.RevenueAccountNo;
      this.form.model.TempRevenueAccountNo = row.TempRevenueAccountNo;
      this.form.model.CostAccountNo = row.CostAccountNo;
      this.form.model.TaxScheduleCode = row.TaxScheduleCode;
      this.form.model.ShippingLineType = row.ShippingLineType;

      this.form.model.HasCosting = row.HasCosting;
      this.form.model.InActive = row.InActive == "Inactive" ? true : false;

      this.form.dataDetails = cloneDeep(row.ChargesDetails);

      this.form.isEdit = true;
      this.isForm = true;
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.ErrorMessage = "";
      this.form.model.ChargesCode = "";
      this.form.model.ChargesName = "";
      this.form.model.ChargeGroupCode = "";
      this.form.model.ChargeGroupName = "";
      this.form.model.TransactionType = "";
      this.form.model.IsPurchasing = false;
      this.form.model.IsSales = false;
      this.form.model.IsInventory = false;
      this.form.model.IsFinancial = false;
      this.form.model.IsAsset = false;
      this.form.model.IsDeposit = false;

      this.form.model.RevenueAccountNo = "";
      this.form.model.TempRevenueAccountNo = "";
      this.form.model.CostAccountNo = "";
      this.form.model.TaxScheduleCode = "";
      this.form.model.ShippingLineType = "NONE";

      this.form.model.HasCosting = false;
      this.form.model.InActive = false;
      this.form.model.ChargesDetails = [];

      this.form.dataDetails = [];

      this.$refs.tabMain.activate();

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async doDelete(row) {
      await this.$store.dispatch("features/company/charges/actDelete", row);

      var response = this.$store.state.features.company.charges.resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription
        );
      } else {
        this.$refs.gridMain.doRefresh();
        this.$refs.gridDeposit.doRefresh();

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
    validateForm() {
      let valid = true;

      if (this.form.model.IsDeposit && this.form.dataDetails != undefined) {
        if (this.form.dataDetails.length > 0) {
          let validShippingLine = true;
          this.form.dataDetails.forEach(function(detail) {
            if (detail.ShippingLineCode == "") {
              validShippingLine = false;
              return;
            }
          });

          if (!validShippingLine) {
            valid = false;
            this.handleToast(
              "Warning",
              "danger",
              "Detail - Shipping Line must not empty !"
            );
          }

          let validAccountNo = true;
          this.form.dataDetails.forEach(function(detail) {
            if (detail.RevenueAccountNo == "" || detail.CostAccountNo == "") {
              validAccountNo = false;
              return;
            }
          });

          if (!validAccountNo) {
            valid = false;
            this.handleToast(
              "Warning",
              "danger",
              "Detail - Revenue & Cost Account must not empty !"
            );
          }
        }
      }

      return valid;
    },
    async onSubmit() {
      if (this.validateForm()) {
        //ENSURE DETAILS IS EMPTY IF DEPOSIT
        if (this.form.model.IsDeposit) {
          //this.form.dataDetails = [];
        }

        this.form.model.ChargesDetails = this.form.dataDetails;

        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/company/charges/actUpdateCharges",
            this.form.model
          );
          var response = this.$store.state.features.company.charges
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
            this.$refs.gridDeposit.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully updated");
          }
        } else {
          await this.$store.dispatch(
            "features/company/charges/actCreateCharges",
            this.form.model
          );

          var response = this.$store.state.features.company.charges
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
            this.$refs.gridDeposit.doRefresh();

            this.handleToast("Confirmation", "success", "Successfully saved");
          }
        }
      }
    },
    async onAddNewChargeDetail() {
      
      this.form.dataDetails.push({
        RowIndex: this.form.dataDetails.length + 1,
        ChargesId: this.form.model.ChargesId,
        TrxModule: 0,
        ShippingLineId: "00000000-0000-0000-0000-000000000000",
        ShippingLineCode: "",
        ShippingLineName: "",
        RevenueAccountNo: "",
        TempRevenueAccountNo: "",
        CostAccountNo: "",
        IsDeleted: false
      });
    },
    async onModalSearchShippingLine(row) {
      this.$refs.dlgShippingLine
        .open(row, this.form.model[row])
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedShippingLine(shippingLine, modelReff) {
      if (modelReff != undefined && shippingLine != undefined) {
        modelReff.ShippingLineId = shippingLine.ShippingLineId;
        modelReff.ShippingLineCode = shippingLine.ShippingLineCode;
        modelReff.ShippingLineName = shippingLine.ShippingLineName;
      }
    },
    async deleteRow(index) {
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
    async onModalSearchCOADetail(row, reffType) {
      let currentVal = "";
      if (reffType == "RevenueAccountNo") {
        currentVal = row.RevenueAccountNo;
      } else if (reffType == "CostAccountNo") {
        currentVal = row.CostAccountNo;
      } else {
        currentVal = row.TempRevenueAccountNo;
      }

      this.$refs.dlgAccountDetail
        .open(row, currentVal, reffType)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCOADetail(selItem, modelReff, reffType) {
      modelReff[reffType] = selItem.AccountId;
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