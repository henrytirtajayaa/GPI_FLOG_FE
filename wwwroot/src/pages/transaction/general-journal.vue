<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <!-- TAB FORM BEGIN -->
    <b-card no-body v-show="isForm">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <b-row>
            <b-col sm="12">
              <b-card>
                <div slot="header">
                  <span class="font-weight-bold">{{formCaption}}</span>
                  <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                  <div right style="float:right;">
                    <b-button
                      variant="red"
                      v-b-modal.modal-void-reason
                      v-if="actionButton.AllowVoid"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'ban']"
                        v-b-tooltip.hover
                        title="Void this Transaction"
                      />&nbsp;Void
                    </b-button>
                    <b-button
                      variant="green"
                      @click="clickPosting"
                      v-if="actionButton.AllowPosting"
                      v-b-tooltip.hover
                      title="Posting this Transaction"
                    >
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                    </b-button>
                    <b-button
                      v-if="form.model.DocumentNo != ''"
                      @click="onModalShowDistJournal"
                      v-b-tooltip.hover
                      title="View Distribution Journal"
                    >
                      <font-awesome-icon :icon="['fas', 'balance-scale']" />
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="actionButton.AllowSave">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </div>
                </div>
                <b-row>
                  <!-- BEGIN FORM -->
                  <b-col sm="10">
                    <b-row>
                      <b-col sm="3">
                        <label>Document Date</label>
                        <b-input-group>
                          <b-form-input
                            v-model="form.display.DocumentDate"
                            type="text"
                            :placeholder="dateFormatString"
                            class="text-center"
                            size="sm"
                            readonly
                            aria-describedby="doc-date-feedback"
                          ></b-form-input>
                          <b-input-group-append v-if="actionButton.AllowEdit">
                            <b-form-datepicker
                              v-model="form.model.TransactionDate"
                              button-only
                              size="sm"
                              left
                              locale="en-US"
                              @input="dateChanged"
                              :min="minCalendarDate"
                              :max="maxCalendarDate"
                              dark
                            ></b-form-datepicker>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                      <b-col sm="4">
                        <b-form-group>
                          <label for="DocumentNo" class="text-center">General Journal Entry No</label>
                          <b-form-input
                            name="Document No"
                            type="text"
                            placeholder="Document No"
                            v-model="form.model.DocumentNo"
                            class="text-center font-weight-bold"
                            readonly
                            variant="blue"
                            size="sm"
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="3">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col>
                              <label>Currency Code</label>
                              <validation-provider
                                name="Currency Code"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-input-group prepend>
                                  <b-form-input
                                    v-model="form.model.CurrencyCode"
                                    class="font-weight-bold text-center"
                                    :state="validateState(validationContext)"
                                    readonly
                                    size="sm"
                                    aria-describedby="currency-code-feedback"
                                  ></b-form-input>
                                  <b-input-group-append
                                    v-if="actionButton.AllowEdit && !form.isEdit"
                                  >
                                    <b-button
                                      variant="outline-primary"
                                      size="sm"
                                      @click="onModalSearchCurrency('CurrencyCode','CurrencyName')"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback
                                    id="currency-code-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col class="mt-3">
                              <label>
                                Rate Amount
                                <code>{{form.model.IsMultiply ? "*" : "/"}}</code>
                              </label>
                              <validation-provider
                                name="Currency Code"
                                :rules="{ required: true, min_value:1 }"
                                v-slot="validationContext"
                              >
                                <b-input-group :prepend="form.display.CurrencySymbol" size="sm">
                                  <money
                                    v-model="form.model.ExchangeRate"
                                    v-bind="moneyOptions"
                                    style="width:100px;"
                                    size="sm"
                                    :state="validateState(validationContext)"
                                    :class="validationContext.errors.length == 0 ? 'currency-money-field is-valid' : 'currency-money-field is-invalid'"
                                    disabled
                                    aria-describedby="rate-amount-feedback"
                                  ></money>
                                  <b-input-group-append
                                    v-if="(form.model.TransactionDate != '' && form.model.CurrencyCode != '' && (form.FunctionalCurrency != form.model.CurrencyCode)) && actionButton.AllowEdit"
                                  >
                                    <b-button
                                      variant="outline-primary"
                                      size="sm"
                                      @click="openModalExchangeRate"
                                    >
                                      <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback
                                    class="is-invalid"
                                    id="rate-amount-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col sm="9">
                        <b-card sm="12" style="margin:0; padding:0;">
                          <b-row>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="SourceDocument">Source Document</label>
                                <b-form-select
                                  v-model="form.model.SourceDocument"
                                  :options="[{value:'',text:'---'},{value:'ASSET',text:'ASSET'},{value:'RECEIVABLE',text:'RECEIVABLE'},{value:'PAYABLE',text:'PAYABLE'}]"
                                  size="sm"
                                  :disabled="!actionButton.AllowEdit"
                                />
                              </b-form-group>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col>
                              <label for="Description">Description</label>
                              <validation-provider
                                name="Description"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <b-form-textarea
                                  name="Description"
                                  placeholder="Description"
                                  v-model="form.model.Description"
                                  :state="validateState(validationContext)"
                                  size="sm"
                                  aria-describedby="description-feedback"
                                  :readonly="!actionButton.AllowEdit"
                                />
                                <b-form-invalid-feedback
                                  id="description-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </validation-provider>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- END FORM -->
                  <!-- BEGIN DOCUMENT STATUS -->
                  <b-col sm="2">
                    <label class="font-weight-bold text-uppercase">
                      <code>Branch</code>
                    </label>
                    <b-form-select
                      :disabled="!actionButton.AllowEdit"
                      v-model="form.model.BranchCode"
                      size="sm"
                      :options="companyBranches"
                      plain
                      class="form-control bg-warning text-dark font-weight-bold"
                      value-field="BranchCode"
                      html-field="BranchCode"
                    ></b-form-select>
                    <b-input-group>
                      <b-button
                        class="mt-4 px-2 bg-dark text-white form-control"
                        @click="openToastDocumentStatus"
                        pill
                        v-b-tooltip.hover
                        title="Document Status"
                      >
                        <font-awesome-icon :icon="['fas', 'bell']" size="sm" />&nbsp;
                        <span class="text-uppercase">
                          <code>{{form.display.DocumentStatus}}</code>
                        </span>
                      </b-button>
                    </b-input-group>
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                </b-row>
                <b-row class="mb-2">
                  <b-col>
                    <b-button
                      variant="yellow"
                      size="sm"
                      type="button"
                      @click="onModalAddCOA"
                      v-if="actionButton.AllowEdit"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Account
                    </b-button>
                  </b-col>
                </b-row>
                <!-- TABLE DETAIL BEGIN -->
                <b-row>
                  <b-col sm="12" class="table-responsive">
                    <table
                      id="table-detail"
                      width="100%"
                      class="table-light table-striped table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th class="text-center" rowspan="2" style="vertical-align:middle;">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-left" width="210">ACCOUNT NO</th>
                          <th class="text-left">ACCOUNT NAME</th>
                          <th class="text-center" width="220">ORIGINATING DEBIT</th>
                          <th class="text-center" width="220">ORIGINATING CREDIT</th>
                        </tr>
                        <tr>
                          <th class="text-left" colspan="2">DESCRIPTION</th>
                          <th class="text-center">FUNCTIONAL DEBIT</th>
                          <th class="text-center">FUNCTIONAL CREDIT</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in form.dataDetails">
                          <tr>
                            <td rowspan="2" class="text-center">
                              <a
                                href="javascript:;"
                                style="text-decoration:none;color:red;"
                                @click="deleteRowDetail(itemIndex)"
                                v-if="actionButton.AllowEdit"
                              >
                                <font-awesome-icon
                                  size="lg"
                                  :icon="['fas', 'trash']"
                                  variant="danger"
                                />
                              </a>
                              <span v-else>{{itemIndex+1}}</span>
                            </td>
                            <td>
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.AccountId"
                                readonly
                              />
                            </td>
                            <td>
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.AccountDescription"
                                readonly
                                autocomplete="false"
                              />
                            </td>
                            <td class="text-center">
                              <money
                                v-model="item.OriginatingDebit"
                                v-bind="moneyOptions"
                                size="sm"
                                :disabled="item.OriginatingCredit>0 || !actionButton.AllowEdit"
                                class="currency-money-field"
                              ></money>
                            </td>
                            <td class="text-center">
                              <money
                                v-model="item.OriginatingCredit"
                                v-bind="moneyOptions"
                                size="sm"
                                :disabled="item.OriginatingDebit>0 || !actionButton.AllowEdit"
                                class="currency-money-field"
                              ></money>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="border-top:0px;">
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.Description"
                                placeholder="Some description here"
                                :readonly="!actionButton.AllowEdit"
                              />
                            </td>
                            <td class="text-center" style="border-top:0px;">
                              <money
                                v-model="item.FunctionalDebit"
                                v-bind="moneyOptions"
                                size="sm"
                                class="currency-money-field"
                                disabled
                              ></money>
                            </td>
                            <td class="text-center" style="border-top:0px;">
                              <money
                                v-model="item.FunctionalCredit"
                                v-bind="moneyOptions"
                                size="sm"
                                class="currency-money-field"
                                disabled
                              ></money>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th class="text-right" colspan="3">ORIGINATING TOTAL</th>
                          <th class="text-center">
                            <money
                              v-model="form.display.OriginatingDebitAmount"
                              v-bind="moneyOptions"
                              size="sm"
                              class="currency-money-field"
                              disabled
                            ></money>
                          </th>
                          <th class="text-center">
                            <money
                              v-model="form.display.OriginatingCreditAmount"
                              v-bind="moneyOptions"
                              size="sm"
                              class="currency-money-field"
                              disabled
                            ></money>
                          </th>
                        </tr>
                        <tr>
                          <th class="text-right" colspan="3">FUNCTIONAL TOTAL</th>
                          <th class="text-center">
                            <money
                              v-model="form.display.FunctionalDebitAmount"
                              v-bind="moneyOptions"
                              size="sm"
                              class="currency-money-field"
                              disabled
                            ></money>
                          </th>
                          <th class="text-center">
                            <money
                              v-model="form.display.FunctionalCreditAmount"
                              v-bind="moneyOptions"
                              size="sm"
                              class="currency-money-field"
                              disabled
                            ></money>
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </b-col>
                </b-row>
                <!-- TABLE DETAIL END -->
              </b-card>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-card>
    <!-- TAB FORM END -->
    <!-- TAB GRID/LIST BEGIN -->
    <b-tabs pills card v-show="!isForm" v-model="tabularStep">
      <!-- TAB PROGRESS BEGIN -->
      <b-tab active @click="isTabMain=true">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'tasks']" />&nbsp;Progress
        </template>
        <b-row>
          <b-col cols="12" sm="12">
            <b-card width="100%">
              <DataGrid
                ref="gridProgress"
                :fields="this.$store.state.features.finance.journal_entry.progress.headers"
                :items="this.$store.state.features.finance.journal_entry.progress.data"
                :info="this.$store.state.features.finance.journal_entry.progress.listInfo"
                :baseUrl="this.$store.state.features.finance.journal_entry.progress.baseUrl"
                :actGetData="handleGetProgress"
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
                caption="List of General Journal Entry - Progress"
              ></DataGrid>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
      <!-- TAB PROGRESS END -->
      <!-- TAB HISTORY BEGIN -->
      <b-tab @click="isTabMain=false">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'history']" />&nbsp;History
        </template>
        <b-card-text>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card width="100%">
                <DataGrid
                  ref="gridHistory"
                  :fields="this.$store.state.features.finance.journal_entry.history.headers"
                  :items="this.$store.state.features.finance.journal_entry.history.data"
                  :info="this.$store.state.features.finance.journal_entry.history.listInfo"
                  :baseUrl="this.$store.state.features.finance.journal_entry.history.baseUrl"
                  :actGetData="handleGetHistory"
                  :actEditRow="handleEdit"
                  addTableClasses="table-bordered"
                  responsive
                  items-per-page-select
                  loading
                  hover
                  sorter
                  pagination
                  column-filter
                  caption="List of General Journal Entry - History"
                  disableNewButton
                  :isDelete="false"
                  :isEdit="false"
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

    <CurrencyModal ref="dlgCurrency" :actSelectedRow="onSelectedCurrency"></CurrencyModal>
    <AccountModal ref="dlgCOA" :actSelectedRow="onSelectedCOA" :noDirectEntry="true"></AccountModal>
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <DistributionJournalModal ref="dlgDistJournal"></DistributionJournalModal>

    <b-modal
      id="modal-void-reason"
      ref="modal-void"
      title="Please type your reason to VOID "
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <form ref="formvoid" @submit.stop.prevent="handleVoid">
        <b-row>
          <b-col sm="6">
            <label>Void Date</label>
            <b-input-group>
              <b-form-input
                v-model="form.display.VoidDate"
                type="text"
                :placeholder="dateFormatString"
                class="text-center"
                size="sm"
                readonly
                aria-describedby="doc-date-feedback"
              ></b-form-input>
              <b-input-group-append
                v-if="actionButton.AllowVoid && (form.model.TransactionDate != maxVoidCalendarDate)"
              >
                <b-form-datepicker
                  v-model="form.model.VoidDate"
                  button-only
                  size="sm"
                  left
                  @input="dateChangedVoid"
                  :min="form.model.TransactionDate"
                  :max="maxVoidCalendarDate"
                  dark
                ></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-form-group
              :state="voidState"
              label="Reason"
              label-for="name-input"
              invalid-feedback="Reason must not empty"
            >
              <b-form-input
                id="name-input"
                v-model="form.VoidReason"
                :state="voidState"
                autocomplete="false"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>

    <!-- BEGIN DOCUMENT STATUS -->
    <b-toast id="document-status-toaster" variant="warning" solid>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="green" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{form.display.DocumentStatus}}</strong>
          <small class="text-muted mr-2"></small>
        </div>
      </template>
      <p>Created By :&nbsp;{{form.display.CreatedByName}}&nbsp;on&nbsp;{{form.display.CreatedDate}}</p>
    </b-toast>
    <!-- END DOCUMENT STATUS -->
  </div>
</template>

<script>
  import DataGrid from "@/components/Tables/DataGrid";
  import SelectGrid from "@/components/tables/SelectGrid";
  import VueElementLoading from "vue-element-loading";
  import {
    CurrencyModal,
    AccountModal,
    ExchangeRateModal, DistributionJournalModal
  } from "@/pages/modal/index.js";
  import { mask } from "vue-the-mask";
  import moment from "moment";
  import util from "@/helper/utils";
  import loginServices from '../../services/loginservices'
  import cloneDeep from "lodash.cloneDeep";

  export default {
    name: "GeneralJournal",
    layout: "dashboard",
    components: {
      DataGrid,
      SelectGrid,
      VueElementLoading,
      CurrencyModal,
      AccountModal,
      ExchangeRateModal, DistributionJournalModal
    },
    directives: {
      mask
    },
    data() {
      return {
        actionButton: { AllowSave: true, AllowEdit: true, AllowPosting: false, AllowVoid: false },
        companyBranches : [],
        tabularStep: 0,
        minCalendarDate: moment().format("YYYY-01-01"),
        maxCalendarDate: moment().endOf('month').format("YYYY-MM-DD"),
        dateFormatString: "DD/MM/YYYY",
        isTabMain: true,
        formCaption: "General Journal Entry",
        caption: "General Journal Entry",
        blockLoader: false,
        isForm: false,
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 0,
          masked: false,
          allowBlank: false,
          min: 0
          //max: Number.MAX_SAFE_INTEGER
        },
        perPage: 10,
        voidState: null,
        form: {
          valid: false,
          isEdit: false,
          defaultRateType: 0,
          FunctionalCurrency: "",
          model: {
            JournalEntryHeaderId: "",
            TransactionDate: moment().format("YYYY-MM-DD"),
            BranchCode : "",
            DocumentNo: "",
            CurrencyCode: "",
            ExchangeRate: 0,
            SourceDocument: "",
            Description: "",
            OriginatingTotal: 0,
            FunctionalTotal: 0,
            Status: 1,
            RequestEntryDetails: Array,
            IsMultiply: true,
            VoidDate: moment().format("YYYY-MM-DD"),
          },
          dataDetails: [],
          display: {
            DocumentDate: moment().format("DD/MM/YYYY"),
            CurrencySymbol: "",
            OriginatingDebitAmount: 0,
            OriginatingCreditAmount: 0,
            FunctionalDebitAmount: 0,
            FunctionalCreditAmount: 0,
            DocumentStatus: "",
            CreatedName: "",
            CreatedDate: "",
            StatusComment: "",
            VoidDate: moment().format("DD/MM/YYYY"),
          },
          status: {
            VoidName: "",
            VoidDate: moment().format("DD/MM/YYYY"),
          },
          VoidReason: ""
        }
      };
    },
    watch: {
      "form.model.ExchangeRate"(newVal) {
        this.doCalculateDetails();
      },
      "form.dataDetails": {
        handler: function (after, before) {
          this.doCalculateDetails();
        },
        deep: true
      }
    },
    async mounted() {
      //OBTAIN MINIMUM CALENDAR INPUT
      let minimumInputDate = await this.$store.dispatch(
        "features/finance/constants/actGetMinInputDateFinancial"
      );
      if (minimumInputDate != undefined){
        this.minCalendarDate = moment(minimumInputDate).format("YYYY-MM-DD");
        this.companyBranches = cloneDeep(this.$store.state.features.finance.constants
          .companyBranches);

        let selectedBranch = this.companyBranches.filter(x=>x.Default);
        if(selectedBranch != undefined)
          this.form.model.BranchCode =  selectedBranch[0].BranchCode;       
      }

      await this.$store.dispatch(
        "features/company/financial_setup/actGet",
        "FinancialSetup?"
      );

      await this.$store.dispatch(
        "features/finance/journal_entry/progress/actGetData",
        "GetJournalEntryProgress?"
      );
      await this.$store.dispatch(
        "features/finance/journal_entry/history/actGetData",
        "GetJournalEntryHistory?"
      );

      if (this.$refs.gridProgress != null) {
        await this.$refs.gridProgress.doRefresh();
      }

      await this.initDefaultForm();
    },
    computed: {
      maxVoidCalendarDate() {
        let trxDate = moment(this.form.model.TransactionDate, 'YYYY-MM-DD');
        if (moment() <= trxDate) {
          return this.form.model.TransactionDate
        } else {
          return moment().format('YYYY-MM-DD')
        }
      },
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
      async initDefaultForm() {
        var financialSetup = this.$store.state.features.company.financial_setup
          .data;

        if (Array.isArray(financialSetup) && financialSetup.length) {
          financialSetup = financialSetup[0];

          this.form.FunctionalCurrency = financialSetup.FuncCurrencyCode;
          this.form.defaultRateType = financialSetup.DefaultRateType;

          //OBTAIN DEFAULT CURRENCY SETTINGS
          if (this.form.model.CurrencyCode != "") {
            await this.$store.dispatch(
              "features/company/currency/actGetCurrency",
              "currency?CurrencyCode=" + this.form.model.CurrencyCode
            );

            let currencySetup = this.$store.state.features.company.currency.data;
            if (Array.isArray(currencySetup)) {
              currencySetup = currencySetup[0];
              this.moneyOptions.precision = currencySetup.DecimalPlaces;
              this.form.model.ExchangeRate = 1;
              this.form.display.CurrencySymbol = currencySetup.Symbol;
            }
          }

          await this.changeCurrentExchangeRate();
        }
      },
      async changeCurrentExchangeRate(rateType) {
        this.form.model.ExchangeRate = 1;

        //OBTAIN DEFAULT EXCHANGE RATE AMOUNT
        if (this.form.model.CurrencyCode != "" && this.form.defaultRateType > 0) {
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actGetCurrentExchangeRate",
            "GetCurrentExchangeRate?CurrencyCode=" +
            this.form.model.CurrencyCode +
            "&TransactionDate=" +
            this.form.model.TransactionDate +
            "&RateType=" +
            this.form.defaultRateType
          );
          this.form.model.ExchangeRate = this.$store.state.features.company.exchange_rate_header.dataExcRate;
          this.form.model.IsMultiply = this.$store.state.features.company.exchange_rate_header.dataExcIsMultiply;
        }
      },
      async dateChanged() {
        this.form.display.DocumentDate = "";
        if (this.form.model.TransactionDate != null)
          this.form.display.DocumentDate = moment(
            this.form.model.TransactionDate
          ).format(this.dateFormatString);

        await this.changeCurrentExchangeRate();
      },
      async dateChangedVoid() {
        this.form.display.VoidDate = "";
        if (this.form.model.VoidDate != null)
          this.form.display.VoidDate = moment(
            this.form.model.VoidDate
          ).format(this.dateFormatString);
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
      async doCalculateDetails() {
        let orgTotal = 0,
          funcTotal = 0;
        let rate = this.form.model.ExchangeRate;
        let isMultiply = this.form.model.IsMultiply;

        let orgSubtotalDebit = 0,
          orgSubtotalCredit = 0;
        let funcSubtotalDebit = 0,
          funcSubtotalCredit = 0;

        if (
          Array.isArray(this.form.dataDetails) &&
          this.form.dataDetails.length
        ) {
          this.form.dataDetails.forEach(function (detail) {
            if (isMultiply) {
              detail.FunctionalDebit = rate * detail.OriginatingDebit;
              detail.FunctionalCredit = rate * detail.OriginatingCredit;
            } else {
              detail.FunctionalDebit = (detail.OriginatingDebit / rate);
              detail.FunctionalCredit = (detail.OriginatingCredit / rate);
            }

            orgTotal += detail.OriginatingDebit;
            funcTotal += detail.FunctionalDebit;

            orgSubtotalDebit += detail.OriginatingDebit;
            orgSubtotalCredit += detail.OriginatingCredit;
            funcSubtotalDebit += detail.FunctionalDebit;
            funcSubtotalCredit += detail.FunctionalCredit;
          });
        }

        this.form.display.OriginatingDebitAmount = orgSubtotalDebit;
        this.form.display.OriginatingCreditAmount = orgSubtotalCredit;
        this.form.display.FunctionalDebitAmount = funcSubtotalDebit;
        this.form.display.FunctionalCreditAmount = funcSubtotalCredit;

        this.form.model.OriginatingTotal = orgTotal;
        this.form.model.FunctionalTotal = funcTotal;
      },
      validateState({ dirty, validated, valid = null }) {
        return dirty || validated ? valid : null;
      },
      async handleGetProgress(url) {
        await this.$store.dispatch(
          "features/finance/journal_entry/progress/actGetData",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async handleGetHistory(url) {
        await this.$store.dispatch(
          "features/finance/journal_entry/history/actGetData",
          url
        );
        await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
      },
      async onModalSearchCurrency(row) {
        this.$refs.dlgCurrency
          .open(row, this.form.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedCurrency(item, modelReff) {
        this.form.model[modelReff] = item.CurrencyCode

        if (item.DecimalPlaces != undefined)
          this.moneyOptions.precision = item.DecimalPlaces
        this.form.display.CurrencySymbol = item.Symbol

        if (item.CurrencyCode != this.form.FunctionalCurrency) {
          await this.changeCurrentExchangeRate()
        } else {
          this.form.model.ExchangeRate = 1
          this.form.model.IsMultiply = true
        }

      },
      async openModalExchangeRate(row) {
        this.$refs.dlgExchangeRate
          .open(
            this.form.model.CurrencyCode,
            this.form.model.TransactionDate,
            this.form.defaultRateType,
            this.moneyOptions,
            this.form.model.ExchangeRate
          )
          .then(res => {
            //console.log(res);
          })
          .catch(res => {
            //console.log(res);
          });
      },
      async onSelectedExchangeRate(item) {
        if (item != undefined)
          this.form.model.ExchangeRate = item.ExchangeRateAmount;
        this.form.model.IsMultiply = item.CalcIsMultiply;
        this.doCalculateDetails();
      },
      async onModalAddCOA() {
        this.$refs.dlgCOA
          .open()
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async onSelectedCOA(row) {
        this.form.dataDetails.push({
          Index: this.form.dataDetails.length,
          JournalEntryDetailId: "",
          AccountId: row.AccountId,
          AccountDescription: row.Description,
          OriginatingDebit: 0,
          FunctionalDebit: 0,
          OriginatingCredit: 0,
          FunctionalCredit: 0,
          Description: "",
          Status: 1
        });
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
      async onFormClose() {
        this.ErrorMessage = "";
        this.isForm = false;
        this.form.isEdit = false;

        this.resetForm();
      },
      resetForm() {
        this.form.model.JournalEntryHeaderId = null;
        this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
        this.form.display.DocumentDate = moment().format(this.dateFormatString);
        this.form.model.DocumentNo = "";
        this.form.model.CurrencyCode = "";
        this.form.model.ExchangeRate = 0;
        this.form.model.SourceDocument = "";
        this.form.model.Description = "";
        this.form.model.OriginatingTotal = 0;
        this.form.model.FunctionalTotal = 0;
        this.form.model.Status = 1;
        this.form.model.IsMultiply = true;

        let selectedBranch = this.companyBranches.filter(x=>x.Default);
        if(selectedBranch != undefined)
          this.form.model.BranchCode =  selectedBranch[0].BranchCode;

        this.form.model.RequestEntryDetails = this.form.dataDetails = [];

        this.form.display.CurrencySymbol = "";
        this.form.display.OriginatingDebitAmount = 0;
        this.form.display.OriginatingCreditAmount = 0;
        this.form.display.FunctionalDebitAmount = 0;
        this.form.display.FunctionalCreditAmount = 0;
        this.moneyOptions.precision = 0;

        this.form.display.CreatedName = "";
        this.form.display.CreatedDate = "";
        this.form.status.VoidName = "";
        this.form.status.VoidDate = "";

        this.form.display.StatusComment = "";

        this.actionButton.AllowSave = true
        this.actionButton.AllowEdit = true
        this.actionButton.AllowPosting = false
        this.actionButton.AllowVoid = false

        this.initDefaultForm();

        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      },
      async onFormCreate() {
        this.resetForm();

        this.form.display.DocumentStatus = "NEW";

        this.form.isEdit = false;
        this.isForm = true;
      },

      async handleEdit(row) {
        this.isForm = true;

        //BINDING EDITTED DATA
        this.form.model.JournalEntryHeaderId = row.JournalEntryHeaderId;
        this.form.model.TransactionDate = moment(row.TransactionDate).format(
          "YYYY-MM-DD"
        );
        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);
        this.form.model.DocumentNo = row.DocumentNo;
        this.form.model.CurrencyCode = row.CurrencyCode;
        this.form.model.ExchangeRate = row.ExchangeRate;
        this.form.model.SourceDocument = row.SourceDocument;
        this.form.model.Description = row.Description;
        this.form.model.OriginatingTotal = row.OriginatingTotal;
        this.form.model.FunctionalTotal = row.FunctionalTotal;
        this.form.model.Status = util.docStatus(row.Status);
        this.form.model.BranchCode = row.BranchCode;
        this.form.model.IsMultiply = row.IsMultiply;
        this.form.model.VoidDate = this.form.model.TransactionDate;

        this.moneyOptions.precision = row.DecimalPlaces;

        this.form.display.DocumentStatus = row.Status;
        this.form.display.StatusComment = row.StatusComment;
        this.form.display.VoidDate = this.form.display.DocumentDate;

        this.form.status.VoidName = row.VoidByName;
        this.form.status.VoidDate = row.VoidDate != undefined ? moment(row.VoidDate).format('DD/MM/YYYY HH:mm:ss') : '';

        this.form.display.CreatedByName = row.CreatedName;
        this.form.display.CreatedDate = moment(row.CreatedDate).format('DD/MM/YYYY HH:mm:ss');

        this.form.display.CurrencySymbol = "";

        //ACTIVATE BUTTONS
        if (this.form.model.JournalEntryHeaderId != '' && this.form.model.DocumentNo != '') {
          if (this.form.model.Status == util.docStatus('New')) {
            this.actionButton.AllowEdit = true
            this.actionButton.AllowSave = true
            this.actionButton.AllowPosting = true
            this.actionButton.AllowVoid = false
          } else if (this.form.model.Status == util.docStatus('posted')) {
            this.actionButton.AllowVoid = true
            this.actionButton.AllowSave = false
            this.actionButton.AllowEdit = false
            this.actionButton.AllowPosting = false
          } else {
            this.actionButton.AllowVoid = false
            this.actionButton.AllowSave = false
            this.actionButton.AllowEdit = false
            this.actionButton.AllowPosting = false
          }
        } else {
          this.actionButton.AllowSave = true
          this.actionButton.AllowEdit = true
          this.actionButton.AllowPosting = false;
          this.actionButton.AllowVoid = false;
        }

        var details = await this.$store.dispatch(
          "features/finance/journal_entry/detail/actGetData",
          row.JournalEntryHeaderId
        );

        let arrDetails = [];
        if (details.length) {
          details.forEach(function (row, index) {
            arrDetails.push({
              Index: index,
              JournalEntryDetailId: row.JournalEntryDetailId,
              AccountId: row.AccountId,
              AccountDescription: row.AccountDescription,
              OriginatingDebit: row.OriginatingDebit,
              OriginatingCredit: row.OriginatingCredit,
              FunctionalDebit: row.FunctionalDebit,
              FunctionalCredit: row.FunctionalCredit,
              Description: row.Description,
              Status: row.Status
            });
          });
        }

        this.form.dataDetails = arrDetails;

        this.form.isEdit = true;

      },
      async doDelete(row) {
        this.showLoader(true);

        await this.$store.dispatch("features/finance/journal_entry/progress/actDelete", row);

        var response = this.$store.state.features.finance.journal_entry.progress.resultDelete;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.$refs.gridProgress.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      async handleDelete(row) {
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
              this.doDelete(row);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      validateForm() {
        let valid = true;

        if (
          this.form.display.OriginatingDebitAmount <= 0 ||
          this.form.display.OriginatingCreditAmount <= 0
        ) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Originating amount must not 0 (zero) !"
          );
        }

        if (
          this.form.display.FunctionalDebitAmount <= 0 ||
          this.form.display.FunctionalCreditAmount <= 0
        ) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Functional amount must not 0 (zero) !"
          );
        }

        if (
          this.form.display.OriginatingDebitAmount !=
          this.form.display.OriginatingCreditAmount
        ) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Originating Debit amount MUST equal with Originating Credit amount !"
          );
        }

        if (
          this.form.display.FunctionalDebitAmount !=
          this.form.display.FunctionalCreditAmount
        ) {
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "Functional Debit amount MUST equal with Functional Credit amount !"
          );
        }

        return valid;
      },
      async onSubmit() {
        if (this.validateForm()) {
          this.showLoader(true);

          this.form.dataDetails.forEach(function(item,index){
            item.RowIndex = index+1;
          });

          this.form.model.RequestEntryDetails = this.form.dataDetails;

          if (this.form.isEdit) {
            await this.$store.dispatch(
              "features/finance/journal_entry/progress/actUpdate",
              this.form.model
            );
            var response = this.$store.state.features.finance.journal_entry
              .progress.resultUpdate;

            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription != undefined
                  ? response.data.ErrorDescription
                  : "Update failed !"
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridProgress.doRefresh();

              this.handleToast("Confirmation", "success", "Successfully updated");
            }
          } else {
            await this.$store.dispatch(
              "features/finance/journal_entry/progress/actCreate",
              this.form.model
            );
            var response = this.$store.state.features.finance.journal_entry
              .progress.resultCreate;

            if (response.status != 200) {
              this.handleToast(
                "Confirmation",
                "danger",
                response.data.ErrorDescription != undefined
                  ? response.data.ErrorDescription
                  : "Submit failed !"
              );
            } else {
              this.isForm = false;
              this.form.isEdit = false;

              this.$refs.gridProgress.doRefresh();

              this.handleToast("Confirmation", "success", "Successfully saved");
            }
          }

          this.showLoader(false);
        }
      },
      async doPostingJournal(row) {

        if (this.validateForm()) {
        this.showLoader(true);

        this.form.model.Reason = "";

        this.form.dataDetails.forEach(function(item,index){
            item.RowIndex = index+1;
          });

        this.form.model.RequestEntryDetails = this.form.dataDetails;
        
        await this.$store.dispatch("features/finance/journal_entry/progress/actPosting", this.form.model);

        var response = this.$store.state.features.finance.journal_entry.progress.resultUpdate;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridProgress.doRefresh();
          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
        }
      },
      async clickPosting(index) {
        this.$bvModal
          .msgBoxConfirm("Posting " + this.form.model.DocumentNo + " ? (make sure you already save all your changes)", {
            title: "Posting Journal Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: 'YES',
            cancelTitle: 'NO',
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false,
          })
          .then(ok => {
            if (ok) {
              this.doPostingJournal(index);
            }
          })
          .catch(err => {
            // An error occurred
          });
      },
      async doVoidJournal(row) {
        this.showLoader(true);

        this.form.model.Reason = this.form.VoidReason;

        await this.$store.dispatch("features/finance/journal_entry/progress/actVoid", this.form.model);

        var response = this.$store.state.features.finance.journal_entry.progress.resultUpdate;
        if (response.status != 200) {
          this.handleToast(
            "Confirmation",
            "danger",
            response.data.ErrorDescription != null
              ? response.data.ErrorDescription
              : "Delete failed."
          );
        } else {
          this.isForm = false;
          this.form.isEdit = false;

          this.$refs.gridHistory.doRefresh();

          this.handleToast("Confirmation", "success", response.data.Message);
        }

        this.showLoader(false);
      },
      /* VOID MODAL */
      resetModal() {
        this.form.VoidReason = ''
        this.voidState = null
      },
      checkFormValidity() {
        const valid = this.$refs.formvoid.checkValidity()
        this.voidState = valid
        return valid
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleVoid()
      },
      handleCancel(bvModalEvt) {
        this.resetModal();
        // Prevent modal from closing
        this.$bvModal.hide('modal-void-reason')
      },
      handleVoid() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        // Push the name to submitted names
        this.doVoidJournal();

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-void-reason')
        })
      },
      async onModalShowDistJournal(row) {
        this.$refs.dlgDistJournal
          .open(this.form.model.DocumentNo)
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
      async openToastDocumentStatus(){
        this.$bvToast.show('document-status-toaster');
      },
    }
  };
</script>

<style scoped>
#table-detail thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
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
  padding: 5px;
  background-color: #f5f5f5;
}

.v-money {
  width: 200px;
}

#table-detail input:disabled {
  background-color: #e8eaf6;
  cursor: text;
  margin: 0em;
  border: 1px solid #c2cfd6;
}

@media only screen and (max-width: 1024px) {
  h5 {
    font-size: 14px;
  }
  #table-detail thead th {
    font-size: 10px;
    border: 1px solid #cfd8dc;
    padding: 5px;
    background-color: #f5f5f5;
  }

  #table-detail tbody td {
    font-size: 10px;
    border-left: 0.5px solid #cfd8dc;
    border-right: 0.5px solid #cfd8dc;
    border-bottom: 1px solid #cfd8dc;
    padding: 3px;
    background-color: white;
  }

  #table-detail tfoot th {
    font-size: 10px;
    border: 1px solid #cfd8dc;
    padding: 5px;
    background-color: #f5f5f5;
  }

  .v-money {
    width: 200px;
  }

  #table-detail input:disabled {
    background-color: #e8eaf6;
    cursor: text;
    margin: 0em;
    border: 1px solid #c2cfd6;
  }
}
</style>
