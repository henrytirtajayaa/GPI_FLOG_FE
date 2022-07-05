
<template>
  <div class="animated fadeIn">
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50" />
    <b-row>
      <b-col sm="3">
        <b-form-select
          style="float:right;"
          v-model="form.model.StatementType"
          :options="statementTypes"
          class="mb-2 font-weight-bold bg-grey"
          value-field="StatementType"
          text-field="Caption"
          @change="onChangeStatementType"
        ></b-form-select>
      </b-col>
    </b-row>
    <div>
      <!-- TAB GRID/LIST BEGIN -->
      <b-tabs pills card active-nav-item-class="bg-warning">
        <!-- TAB LAYOUT BEGIN -->
        <b-tab active @click="isTabMain=true" >
          <template v-slot:title class="bg-yellow">
            <font-awesome-icon :icon="['fas', 'arrows-alt']" />&nbsp;Statement Layout
          </template>
          <b-row>
            <b-col cols="12" sm="12">
              <b-card no-body v-show="isFormLayout" style="border:none;">
                <validation-observer ref="observerLayout" v-slot="{ handleSubmit }">
                  <b-form @submit.stop.prevent="handleSubmit(onSubmitLayout)">
                    <b-row>
                      <b-col sm="12">
                        <b-card>
                          <div slot="header">
                            <span class="font-weight-bold">Layout</span>
                            <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                            <div right style="float:right;">
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
                            <b-col sm="12">
                              <b-row>
                                <b-col sm="2">
                                  <label for="StatementCategory">Section</label>
                                  <validation-provider
                                    name="Statement Section"
                                    :rules="{ required: true, min_value:1 }"
                                    v-slot="validationContext"
                                  >
                                    <b-form-select
                                      name="StatementCategory"
                                      v-model="form.model.LayoutDetail.CategoryId"
                                      :state="validateState(validationContext)"
                                      :plain="true"
                                      :options="listStatementCategories"
                                      value-field="CategoryId"
                                      text-field="CategoryCaption"
                                      :disabled="form.model.LayoutDetail.DetailId>0"
                                      size="sm"
                                      aria-describedby="statement-ctg-feedback"
                                    />

                                    <b-form-invalid-feedback
                                      id="statement-ctg-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </validation-provider>
                                </b-col>
                                <b-col sm="3">
                                  <label>Sub Section</label>
                                  <validation-provider
                                    name="Sub Section"
                                    :rules="{ required: true, min_value:1 }"
                                    v-slot="validationContext"
                                  >
                                    <b-form-select
                                      name="StatementSubCategory"
                                      v-model="form.model.LayoutDetail.SubCategoryId"
                                      :state="validateState(validationContext)"
                                      :disabled="form.model.LayoutDetail.DetailId>0"
                                      :plain="true"
                                      :options="listSubCategories"
                                      value-field="SubCategoryId"
                                      text-field="SubCategoryCaption"
                                     
                                      size="sm"
                                      aria-describedby="statement-sub-ctg-feedback"
                                    />
                                    <b-form-invalid-feedback
                                      id="statement-sub-ctg-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </validation-provider>
                                </b-col>
                                <b-col sm="4">
                                  <label>Account Name</label>
                                  <validation-provider
                                    name="Account Name"
                                    :rules="{ required: true }"
                                    v-slot="validationContext"
                                  >
                                    <b-form-input
                                      v-model="form.model.LayoutDetail.AccountName"
                                      class="font-weight-bold"
                                      :state="validateState(validationContext)"
                                      autocomplete="false"
                                      size="sm"
                                      aria-describedby="layout-account-name-feedback"
                                    ></b-form-input>
                                    <b-form-invalid-feedback
                                      id="layout-account-name-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </validation-provider>
                                </b-col>
                                <b-col sm="2">
                                  <label>Show Zero (0)</label>
                                  <validation-provider
                                    name="Show Zero (0)"
                                    :rules="{ required: true }"
                                    v-slot="validationContext"
                                  >
                                    <b-form-select
                                      name="ShowZeroValue"
                                      v-model="form.model.LayoutDetail.ShowZeroValue"
                                      :state="validateState(validationContext)"
                                      :plain="true"
                                      :options="[{value:true,text:'YES'},{value:false,text:'NO'}]"
                                      size="sm"
                                      aria-describedby="show-zero-value-feedback"
                                    />
                                    <b-form-invalid-feedback
                                      id="show-zero-value-feedback"
                                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                  </validation-provider>
                                </b-col>
                                <b-col sm="1">
                                  <label>Index</label>
                                  <b-form-input
                                    v-model="form.model.LayoutDetail.PosIndex"
                                    class="text-center"
                                    type="number"
                                    max="200"
                                    maxlength="3"
                                    size="sm"
                                    aria-describedby="layout-account-name-feedback"
                                  ></b-form-input>
                                </b-col>
                              </b-row>
                            </b-col>
                            <!-- END FORM -->
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col class="mt-1">
                        <b-button variant="purple" size="sm" type="button" @click="onModalAddCOA" 
                        :disabled="form.model.LayoutDetail.SubCategoryId <= 0 || form.model.LayoutDetail.AccountName==''">
                          <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add CoA
                          <b-spinner small v-if="showAddCoaSpinner"></b-spinner>
                        </b-button>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2" style="margin:1px;">
                      <template v-for="(coa, itemIndex) in form.dataDetails">
                        <b-col sm="6" v-bind:key="itemIndex" class="bg-light">
                          <a 
                            href="javascript:;"
                            style="text-decoration:none;color:#e64a19;"
                            v-if="actionButton.AllowEdit"
                            @click="deleteRowDetailSub(itemIndex)"
                          >
                            <font-awesome-icon :icon="['fas', 'trash']" size="sm" />
                          </a>
                          &nbsp;<span>{{coa.AccountId}}</span>&nbsp;&nbsp;{{coa.Description}}
                        </b-col>
                      </template>
                    </b-row>
                  </b-form>
                </validation-observer>
              </b-card>

              <!-- GRID LAYOUT BEGIN -->
              <b-card width="100%" v-show="!isFormLayout">
                <b-col sm="12" class="table-responsive">
                  <b-row class="mb-2">
                    <b-col>
                      <b-button
                        variant="purple"
                        size="sm"
                        type="button"
                        v-if="actionButton.AllowEdit"
                        @click="onFormLayoutCreate"
                      >
                        <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Account Layout
                      </b-button>
                    </b-col>
                  </b-row>
                  <table
                    id="table-layout"
                    width="100%"
                    class="table-light table-striped table-hover table-bordered"
                  >
                    <thead>
                      <tr>
                        <th class="text-center" style="vertical-align:middle;width:70px;">
                          <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                        </th>
                        <th class="text-left" width="200">SECTION</th>
                        <th class="text-left" width="200">SUB SECTION</th>
                        <th class="text-left">NAME</th>
                        <th class="text-center" width="110">SHOW ZERO (0)</th>
                        <th class="text-center" width="50">IDX</th>
                      </tr>
                    </thead>
                    <tbody class="position-relative">
                      <template v-for="(item, itemIndex) in listLayoutDetails">
                        <tr v-bind:key="itemIndex">
                          <td class="text-center">
                            <a
                              href="javascript:;"
                              style="text-decoration:none;color:red;"
                              @click="deleteRowLayout(item.DetailId)"
                              v-if="actionButton.AllowEdit"
                            >
                              <font-awesome-icon :icon="['fas', 'trash']" variant="danger" />
                            </a>
                            &nbsp;
                            <a
                              href="javascript:;"
                              style="text-decoration:none;"
                              @click="handleEditLayout(item)"
                              v-if="actionButton.AllowEdit"
                            >
                              <font-awesome-icon :icon="['fas', 'edit']" variant="primary" />
                            </a>
                            <span v-else>{{itemIndex+1}}</span>
                          </td>
                          <td>
                            <span>{{item.CategoryCaption}}</span>
                          </td>
                          <td>
                            <span>{{item.SubCategoryCaption}}</span>
                          </td>
                          <td>
                            <span>{{item.AccountName}}</span>
                          </td>
                          <td class="text-center">
                            <span>{{item.ShowZeroValue ? "YES" : "NO"}}</span>
                          </td>
                          <td class="text-center">
                            <span>{{item.PosIndex}}</span>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </b-col>
              </b-card>
              <!-- GRID LAYOUT END -->
            </b-col>
          </b-row>
        </b-tab>
        <!-- TAB LAYOUT END -->
        <!-- TAB CATEGORY BEGIN -->
        <b-tab @click="isTabMain=false">
          <template v-slot:title>
            <font-awesome-icon :icon="['fas', 'cog']" />&nbsp;Section
          </template>
          <b-card-text>
            <b-row>
              <b-col cols="12" sm="12">
                <!-- FORM CATEGORY BEGIN -->
                <b-card no-body v-show="isFormCategory">
                  <validation-observer ref="observerCtg" v-slot="{ handleSubmit }">
                    <b-form @submit.stop.prevent="handleSubmit(onSubmitCategory)">
                      <b-row>
                        <b-col sm="12">
                          <b-card>
                            <div slot="header">
                              <span class="font-weight-bold">Layout Section</span>
                              <small>{{ (form.isEdit) ? "Edit" : "New" }}</small>
                              <div right style="float:right;">
                                <b-button
                                  variant="blue"
                                  type="submit"
                                  v-if="actionButton.AllowSave"
                                >
                                  <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                                </b-button>
                                <b-button @click="onFormClose">
                                  <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                                </b-button>
                              </div>
                            </div>
                            <b-row>
                              <!-- BEGIN FORM -->
                              <b-col sm="12">
                                <b-row>
                                  <b-col sm="3">
                                    <label>Section Key</label>
                                    <validation-provider
                                      name="Section Key"
                                      :rules="{ required: true }"
                                      v-slot="validationContext"
                                    >
                                      <b-form-input
                                        v-model="form.model.Category.CategoryKey"
                                        class="font-weight-bold text-uppercase"
                                        :state="validateState(validationContext)"
                                        autocomplete="false"
                                        :disabled="form.model.Category.CategoryId>0"
                                        size="sm"
                                        aria-describedby="ctg-key-feedback"
                                      ></b-form-input>
                                      <b-form-invalid-feedback
                                        id="ctg-key-feedback"
                                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                    </validation-provider>
                                  </b-col>
                                  <b-col sm="6">
                                    <label>Section Caption</label>
                                    <validation-provider
                                      name="Section Caption"
                                      :rules="{ required: true }"
                                      v-slot="validationContext"
                                    >
                                      <b-form-input
                                        v-model="form.model.Category.CategoryCaption"
                                        class="font-weight-bold"
                                        :state="validateState(validationContext)"
                                        autocomplete="false"
                                        size="sm"
                                        aria-describedby="ctg-caption-feedback"
                                      ></b-form-input>
                                      <b-form-invalid-feedback
                                        id="ctg-caption-feedback"
                                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                    </validation-provider>
                                  </b-col>
                                </b-row>
                                <b-row class="mt-2 mb-1">
                                  <b-col>
                                    <b-button
                                      variant="yellow"
                                      size="sm"
                                      type="button"
                                      :disabled="form.model.Category.CategoryKey==''"
                                      @click="appendSubCategory"
                                    >
                                      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Sub Section
                                    </b-button>
                                  </b-col>
                                </b-row>
                                <b-row>
                                  <b-col sm="8">
                                    <b-card>
                                      <template
                                        v-for="(subCtg, itemIndex) in form.dataSubCategories"
                                      >
                                        <b-row class="mt-1" v-bind:key="itemIndex" v-if="subCtg.Status > 0">
                                          <b-col sm="1" class="text-center">
                                            <a
                                              href="javascript:;"
                                              style="text-decoration:none;color:red;"
                                              @click="deleteRowSubCategory(itemIndex)"
                                              v-if="actionButton.AllowEdit"
                                            >
                                              <font-awesome-icon
                                                :icon="['fas', 'times-circle']"
                                                variant="danger"
                                              />
                                            </a>
                                          </b-col>
                                          <b-col sm="6">
                                            <b-form-input
                                              v-model="subCtg.SubCategoryCaption"
                                              autocomplete="false"
                                              size="sm"
                                            ></b-form-input>
                                          </b-col>
                                          <b-col sm="3">
                                            <b-form-select
                                              name="IsInflow"
                                              v-model="subCtg.Inflow"
                                              size="sm"
                                              :options="[{value:true,text:'INFLOW'},{value:false,text:'OUTFLOW'}]"
                                            />
                                          </b-col>
                                          <b-col sm="2">
                                            <b-form-input
                                              v-model="subCtg.PosIndex"
                                              autocomplete="false"
                                              type="number"
                                              min="0"
                                              size="sm"
                                            ></b-form-input>
                                          </b-col>
                                        </b-row>
                                      </template>
                                    </b-card>
                                  </b-col>
                                </b-row>
                              </b-col>
                              <!-- END FORM -->
                            </b-row>
                          </b-card>
                        </b-col>
                      </b-row>
                    </b-form>
                  </validation-observer>
                </b-card>
                <!-- FORM CATEGORY END -->
                <!-- GRID CATEGORY BEGIN -->
                <b-card width="100%" v-show="!isFormCategory">
                  <b-col sm="12" class="table-responsive">
                    <b-row class="mb-2">
                      <b-col>
                        <b-button
                          variant="purple"
                          size="sm"
                          type="button"
                          v-if="actionButton.AllowEdit"
                          @click="onFormCategoryCreate"
                        >
                          <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;New Layout Section
                        </b-button>
                      </b-col>
                    </b-row>
                    <table
                      id="table-category"
                      width="100%"
                      class="table-light table-striped table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th class="text-center" style="vertical-align:middle;width:70px;">
                            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                          </th>
                          <th class="text-left" width="210">KEY</th>
                          <th class="text-left">SECTION</th>
                        </tr>
                      </thead>
                      <tbody class="position-relative">
                        <template v-for="(item, itemIndex) in listCategories">
                          <tr>
                            <td class="text-center">
                              <a
                                href="javascript:;"
                                style="text-decoration:none;color:red;"
                                @click="deleteRowCategory(item.CategoryId)"
                                v-if="actionButton.AllowEdit"
                              >
                                <font-awesome-icon :icon="['fas', 'trash']" variant="danger" />
                              </a>
                              &nbsp;
                              <a
                                href="javascript:;"
                                style="text-decoration:none;"
                                @click="handleEditCategory(item)"
                                v-if="actionButton.AllowEdit"
                              >
                                <font-awesome-icon :icon="['fas', 'edit']" variant="primary" />
                              </a>
                              <span v-else>{{itemIndex+1}}</span>
                            </td>
                            <td>
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.CategoryKey"
                                readonly
                              />
                            </td>
                            <td>
                              <b-form-input
                                type="text"
                                size="sm"
                                v-model="item.CategoryCaption"
                                autocomplete="false"
                                readonly
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <table
                                id="table-detail"
                                class="table-light table-striped table-hover table-bordered"
                                width="80%"
                              >
                                <thead>
                                  <tr>
                                    <th class="text-center" width="70"></th>
                                    <th class="text-left">SUB SECTION</th>
                                    <th class="text-center" width="250">TYPE</th>
                                    <th class="text-center" width="50">IDX</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(sub, itemIndex) in item.SubCategories" v-bind:key="itemIndex">
                                    <td></td>
                                    <td>{{sub.SubCategoryCaption}}</td>
                                    <td class="text-center">{{sub.Inflow?"INFLOW":"OUTFLOW"}}</td>
                                    <td class="text-center">{{sub.PosIndex}}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </b-col>
                </b-card>
                <!-- GRID CATEGORY END -->
              </b-col>
            </b-row>
          </b-card-text>
        </b-tab>
        <!-- TAB CATEGORY END -->
      </b-tabs>
      <!-- TAB GRID/LIS END -->
    </div>

    <CheckAccountModal ref="dlgCOA" :actSelectedRow="onSelectedCOAs"></CheckAccountModal>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import { mask } from "vue-the-mask";
import moment from "moment";
import util from "@/helper/utils";
import loginServices from "../../services/loginservices";
import { CheckAccountModal } from "@/pages/modal/index.js";

export default {
  name: "StatementLayout",
  layout: "dashboard",
  components: {
    VueElementLoading,
    CheckAccountModal
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
      tabularStep: 0,
      minCalendarDate: moment().format("YYYY-01-01"),
      maxCalendarDate: moment()
        .endOf("month")
        .format("YYYY-MM-DD"),
      dateFormatString: "DD/MM/YYYY",
      isTabMain: true,
      formCaption: "Financial Statement Layout",
      blockLoader: false,
      statementTypes: [
        { StatementType: 1, Caption: "BALANCE SHEET" },
        { StatementType: 2, Caption: "PROFIT LOSS" },
        { StatementType: 3, Caption: "CASH FLOW" }
      ],
      isFormCategory: false,
      isFormLayout: false,
      perPage: 10,
      listCategories: [],
      listSubCategories: [],
      listLayoutDetails: [],
      showAddCoaSpinner: false,
      form: {
        valid: false,
        isEdit: false,
        model: {
          StatementType: 1,
          Category: {
            StatementType: 0,
            CategoryId: 0,
            CategoryKey: "",
            CategoryCaption: "",
            SubCategories: []
          },
          LayoutDetail: {
            DetailId: 0,
            CategoryId: 0,
            SubCategoryId: 0,
            AccountName: "",
            PosIndex: 0,
            IsCashflow: false,
            ShowZeroValue: true,
            IsCashFlowDynamic: false,
            AccountIds: []
          }
        },
        dataSubCategories: [],
        dataDetails: []
      }
    };
  },
  watch: {
    "form.model.TransactionType"(newVal) {},
    "form.dataDetails": {
      handler: function(after, before) {},
      deep: true
    },
    "form.model.LayoutDetail.CategoryId"(newVal) {
      let ctgs = this.$store.state.features.finance.glstatement.category.data;
      let arr = [];
      ctgs.forEach(function(ctg) {
        if (ctg.CategoryId == newVal) {
          arr = ctg.SubCategories;
          return;
        }
      });
      this.listSubCategories = arr;      
    }
  },
  async mounted() {
    //GET CATEGORIES
    await this.handleGetCategories();

    //GET LAYOUTS
    await this.handleGetLayouts();
  },
  computed: {
    maxVoidCalendarDate() {
      return "";
    },
    listStatementCategories() {
      let ctgs = this.$store.state.features.finance.glstatement.category.data;
      return ctgs;
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
    async handleGetLayouts(url) {
      await this.$store.dispatch(
        "features/finance/glstatement/layout/actGetData",
        "GetGLStatementLayout?StatementType=" + this.form.model.StatementType
      );

      let layouts = this.$store.state.features.finance.glstatement.layout.data;

      this.listLayoutDetails = layouts;

      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );
    },
    async handleGetCategories(url) {
      await this.$store.dispatch(
        "features/finance/glstatement/category/actGetData",
        "GetGLStatementCtg?StatementType=" + this.form.model.StatementType
      );

      await loginServices.doLoginCompany(
        this.$store.state.user,
        this.$store.state.companySecurity,
        this.$store.state.token.replace("Bearer ", "")
      );

      let categories = this.$store.state.features.finance.glstatement.category
        .data;

      this.listCategories = categories;
    },
    async onChangeStatementType() {
      await this.handleGetCategories();
      await this.handleGetLayouts();

      await this.onFormClose();
    },
    async appendSubCategory(row) {
      this.form.dataSubCategories.push({
        Index: this.form.dataSubCategories.length,
        SubCategoryId: 0,
        CategoryId: this.form.model.Category.CategoryId,
        SubCategoryKey: "",
        SubCategoryCaption: "",
        PosIndex: this.form.dataSubCategories.length + 1,
        IsParamTotal: false,
        Inflow: true,
        Status : 1,
      });
    },
    async onFormClose() {
      this.ErrorMessage = "";
      this.isFormLayout = false;
      this.isFormCategory = false;
      this.form.isEdit = false;

      this.resetForm();
    },
    resetForm() {
      //CATEGORY
      this.form.model.Category.CategoryId = 0;
      this.form.model.Category.StatementType = 0;
      this.form.model.Category.CategoryKey = "";
      this.form.model.Category.CategoryCaption = "";
      this.form.model.Category.SubCategories = [];

      this.form.dataSubCategories = [];

      //LAYOUTS
      this.form.model.LayoutDetail.DetailId = 0;
      this.form.model.LayoutDetail.CategoryId = 0;
      this.form.model.LayoutDetail.SubCategoryId = 0;
      this.form.model.LayoutDetail.AccountName = "";
      this.form.model.LayoutDetail.PosIndex = 0;
      this.form.model.LayoutDetail.IsCashflow = false;
      this.form.model.LayoutDetail.ShowZeroValue = true;
      this.form.model.LayoutDetail.IsCashFlowDynamic = false;
      this.form.model.LayoutDetail.AccountIds = [];

      this.form.dataDetails = [];

      this.actionButton.AllowSave = true;
      this.actionButton.AllowEdit = true;
      this.actionButton.AllowPosting = false;
      this.actionButton.AllowVoid = false;

      this.$nextTick(() => {
        this.$refs.observerCtg.reset();
      });
      this.$nextTick(() => {
        this.$refs.observerLayout.reset();
      });
    },
    async onFormCategoryCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isFormCategory = true;
    },
    async onFormLayoutCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isFormLayout = true;
    },
    async handleEditCategory(row) {
      this.isFormCategory = true;

      //BINDING EDITTED DATA
      this.form.model.Category.CategoryId = row.CategoryId;
      this.form.model.Category.StatementType = row.StatementType;
      this.form.model.Category.CategoryKey = row.CategoryKey;
      this.form.model.Category.CategoryCaption = row.CategoryCaption;
      this.form.model.Category.SubCategories = row.SubCategories;

      this.form.dataSubCategories = row.SubCategories;

      //BEGIN SUB CATEGORIES
      var details = row.SubCategories;

      let arrDetails = [];
      if (details.length) {
        details.forEach(function(row, index) {
          arrDetails.push({
            Index: index,
            SubCategoryId: row.SubCategoryId,
            CategoryId: row.CategoryId,
            SubCategoryKey: row.SubCategoryKey,
            SubCategoryCaption: row.SubCategoryCaption,
            IsParamTotal: row.IsParamTotal,
            Inflow: row.Inflow,
            PosIndex: row.PosIndex,
            Status:1
          });
        });
      }

      this.form.dataSubCategories = arrDetails;

      //END SUB CATEGORIES

      //ACTIVATE BUTTONS
      if (this.form.model.Category.CategoryId > 0) {
        this.actionButton.AllowEdit = true;
        this.actionButton.AllowSave = true;
      } else {
        this.actionButton.AllowSave = true;
        this.actionButton.AllowEdit = true;
      }

      this.form.isEdit = true;
    },
    async deleteRowCategory(ctgId) {
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
            this.doDeleteCategory(ctgId);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async deleteRowSubCategory(index) {
      const h = this.$createElement;

      const messageVNode = h('div', { class: ['foobar'] }, [
          h('p', { class: ['text-left'] }, [
            'Related layout which using this section will also be deleted !',
            h('br'),
            h('strong', 'Do you want to continue ? ')
          ]),
        ])
        
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          titleHtml: "<code>Delete Confirmation</code>",
          size: "md",
          buttonSize: "sm",
          okVariant: "blue",
          centered: true,
          headerClass: "p-1 border-bottom-0",
          footerClass: "p-1 border-top-0"
        })
        .then(ok => {
          if (ok) {
            //this.form.dataSubCategories.splice(index, 1);
            this.form.dataSubCategories[index].Status = 0;
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async doDeleteCategory(ctgId) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/glstatement/category/actDelete",
        ctgId
      );

      var response = this.$store.state.features.finance.glstatement.category
        .resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Delete failed."
        );
      } else {
        await this.handleGetCategories();

        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },
    async onSubmitCategory() {
      this.showLoader(true);

      this.form.model.Category.StatementType = this.form.model.StatementType;
      this.form.model.Category.SubCategories = this.form.dataSubCategories;

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "features/finance/glstatement/category/actUpdate",
          this.form.model
        );
        var response = this.$store.state.features.finance.glstatement.category
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
          this.isFormCategory = false;
          this.form.isEdit = false;

          await this.handleGetCategories();
          await this.handleGetLayouts();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/finance/glstatement/category/actCreate",
          this.form.model
        );
        var response = this.$store.state.features.finance.glstatement.category
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
          this.isFormCategory = false;
          this.form.isEdit = false;

          await this.handleGetCategories();

          this.handleToast("Confirmation", "success", "Successfully saved");
        }
      }

      this.showLoader(false);
    },
    async onModalAddCOA() {
      this.$refs.dlgCOA
        .open('AccountIds', this.form.dataDetails)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCOAs(selectedRows) {
      this.form.dataDetails = selectedRows;
    },
    async handleEditLayout(row) {
      this.isFormLayout = true;
      
      //LIST OF SECTIONS
      let ctgs = this.$store.state.features.finance.glstatement.category.data;
      let arr = [];
      ctgs.forEach(function(ctg) {
        if (ctg.CategoryId == row.CategoryId) {
          arr = ctg.SubCategories;
          return;
        }
      });
      this.listSubCategories = arr;    
      
      //BINDING EDITTED DATA
      this.form.model.LayoutDetail.DetailId = row.DetailId;
      this.form.model.LayoutDetail.CategoryId = row.CategoryId;
      this.form.model.LayoutDetail.SubCategoryId = row.SubCategoryId;
      this.form.model.LayoutDetail.AccountName = row.AccountName;
      this.form.model.LayoutDetail.PosIndex = row.PosIndex;
      this.form.model.LayoutDetail.IsCashflow = row.IsCashflow;
      this.form.model.LayoutDetail.ShowZeroValue = row.ShowZeroValue;
      this.form.model.LayoutDetail.IsCashFlowDynamic = row.IsCashFlowDynamic;
      this.form.model.LayoutDetail.AccountIds = [];

      //BEGIN SUB CATEGORIES
      var details = row.DetailAccounts;

      let arrDetails = [];
      if (details.length) {
        details.forEach(function(row, index) {
          arrDetails.push({
            Index: index,
            DetailId: row.DetailId,
            AccountId: row.AccountId,
            Description: row.Description
          });
        });
      }

      this.form.dataDetails = arrDetails;

      //END SUB CATEGORIES

      //ACTIVATE BUTTONS
      if (this.form.model.Category.CategoryId > 0) {
        this.actionButton.AllowEdit = true;
        this.actionButton.AllowSave = true;
      } else {
        this.actionButton.AllowSave = true;
        this.actionButton.AllowEdit = true;
      }

      this.form.isEdit = true;
    },
    async doDeleteLayout(detailId) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/glstatement/layout/actDelete",
        detailId
      );

      var response = this.$store.state.features.finance.glstatement.layout
        .resultDelete;
      if (response.status != 200) {
        this.handleToast(
          "Confirmation",
          "danger",
          response.data.ErrorDescription != null
            ? response.data.ErrorDescription
            : "Delete failed."
        );
      } else {
        await this.handleGetLayouts();

        this.handleToast("Confirmation", "success", response.data.Message);
      }

      this.showLoader(false);
    },
    async deleteRowLayout(detailId) {
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
            this.doDeleteLayout(detailId);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async deleteRowDetailSub(index) {
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
    async onSubmitLayout() {
      this.showLoader(true);

      let accountIds = [];

      for (var i = 0; i < this.form.dataDetails.length; i++) {
        accountIds[i] = this.form.dataDetails[i].AccountId;
      }

      this.form.model.LayoutDetail.AccountIds = accountIds;

      if (this.form.isEdit) {
        await this.$store.dispatch(
          "features/finance/glstatement/layout/actUpdate",
          this.form.model.LayoutDetail
        );
        var response = this.$store.state.features.finance.glstatement.layout
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
          this.isFormLayout = false;
          this.form.isEdit = false;

          await this.handleGetLayouts();

          this.handleToast("Confirmation", "success", "Successfully updated");
        }
      } else {
        await this.$store.dispatch(
          "features/finance/glstatement/layout/actCreate",
          this.form.model.LayoutDetail
        );
        var response = this.$store.state.features.finance.glstatement.layout
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
          this.isFormLayout = false;
          this.form.isEdit = false;

          await this.handleGetLayouts();

          this.handleToast("Confirmation", "success", "Successfully saved");
        }
      }

      this.showLoader(false);
    }
  }
};
</script>

<style scoped>
#table-category thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-category tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-category tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-layout thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

#table-layout tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-layout tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 5px;
  background-color: #f5f5f5;
}

</style>

