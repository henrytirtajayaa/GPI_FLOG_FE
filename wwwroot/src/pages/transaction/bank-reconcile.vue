
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
                      v-if="actionButton.AllowPosting && form.model.BalanceDifference == 0"
                      v-b-tooltip.hover
                      title="Posting this Transaction"
                    >
                      <font-awesome-icon :icon="['fas', 'check-circle']" />&nbsp;Posting
                    </b-button>
                    <b-button variant="blue" type="submit" v-if="actionButton.AllowSave">
                      <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Save
                    </b-button>
                    <b-button @click="onFormClose">
                      <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
                    </b-button>
                  </div>
                </div>
                <b-alert show variant="danger" size="sm" v-if="!form.AllowNewReconcile">
                  <span class="font-weight-bold text-uppercase">Outstanding Bank Reconcile for this Checkbook already created !</span>&nbsp;<small>Please complete the outstanding reconcile in order to proceed.</small>
                </b-alert>
                <b-row class="mb-0">
                  <!-- BEGIN FORM -->
                  <b-col sm="5">
                    <b-row>
                      <b-col sm="6">
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
                      <b-col sm="6">
                        <b-form-group>
                          <label for="DocumentNo" class="text-center">Document No</label>
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
                      <b-col sm="12">
                        <b-card>
                          <b-row>
                            <b-col sm="8">
                              <validation-provider
                                name="Checkbook Code"
                                :rules="{ required: true }"
                                v-slot="validationContext"
                              >
                                <label>Checkbook Code</label>
                                <b-input-group prepend>
                                  <b-form-input
                                    size="sm"
                                    v-model="form.model.CheckbookCode"
                                    placeholder="Choose Checkbook"
                                    readonly
                                    :state="validateState(validationContext)"
                                    aria-describedby="checkbook-feedback"
                                  ></b-form-input>
                                  <b-input-group-append v-if="form.isEdit==false">
                                    <b-button
                                      size="sm"
                                      variant="outline-primary"
                                      @click="isShowCheckbook=true"
                                    >
                                      <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                                    </b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback
                                    id="checkbook-feedback"
                                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                </b-input-group>
                              </validation-provider>
                            </b-col>
                            <b-col sm="4">
                              <b-form-group>
                                <label for="CurrencyCode">Currency</label>
                                <b-form-input
                                  name="CurrencyCode"
                                  type="text"
                                  placeholder="Currency Code"
                                  v-model="form.model.CurrencyCode"
                                  size="sm"
                                  readonly
                                />
                              </b-form-group>
                            </b-col>
                            <b-col sm="12">
                              <label for="Description">Description</label>
                              <b-form-textarea
                                name="Description"
                                placeholder="Description"
                                v-model="form.model.Description"
                                size="sm"
                                aria-describedby="description-feedback"
                                :readonly="!actionButton.AllowEdit"
                              />
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="5">
                    <b-row>
                      <b-col sm="12">
                        <b-card>
                          <b-row class="mt-2">
                            <b-col sm="6" class="text-right">
                              <label style="margin-top:3px;" class="font-weight-bold">Bank Statement Ending</label>
                            </b-col>
                            <b-col sm="6">
                              <b-input-group>
                                <b-form-input
                                  v-model="form.display.BankCutoffEnd"
                                  type="text"
                                  :placeholder="dateFormatString"
                                  class="text-center font-weight-bold"
                                  size="sm"
                                  readonly
                                  aria-describedby="doc-date-feedback"
                                ></b-form-input>
                                <b-input-group-append
                                  v-if="actionButton.AllowEdit && form.model.CheckbookCode != ''"
                                >
                                  <b-form-datepicker
                                    v-model="form.model.BankCutoffEnd"
                                    button-only
                                    size="sm"
                                    left
                                    locale="en-US"
                                    @input="dateChanged"
                                    :min="form.model.BankCutoffStart"
                                    dark
                                  ></b-form-datepicker>
                                </b-input-group-append>
                              </b-input-group>
                            </b-col>
                          </b-row>
                          <b-row class="mt-2">
                            <b-col sm="6">&nbsp;</b-col>
                            <b-col sm="6">
                              <validation-provider
                                name="Bank Statement Ending Balance"
                                :rules="{ required: true, min_value:0 }"
                                v-slot="validationContext"
                              >
                                <money
                                  v-model="form.model.BankEndingOrgBalance"
                                  v-bind="moneyOptions"
                                  size="sm"
                                  style="width:85%;"
                                  :state="validateState(validationContext)"
                                  :class="validationContext.errors.length == 0 ? 'currency-money-field is-valid' : 'currency-money-field is-invalid'"
                                  aria-describedby="bank-ending-balance-feedback"
                                  :disabled="!actionButton.AllowEdit || form.model.CheckbookCode == ''"
                                ></money>
                                <b-form-invalid-feedback
                                  id="bank-ending-balance-feedback"
                                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                              </validation-provider>
                            </b-col>
                          </b-row>
                          <b-row class="mt-2">
                            <b-col sm="6" class="text-right">
                              <label
                                style="margin-top:3px;"
                                class="text-blue font-weight-bold"
                              >Checkbook Ending</label>
                            </b-col>
                            <b-col sm="6">
                              <money
                                v-model="form.model.CheckbookEndingOrgBalance"
                                v-bind="moneyOptions"
                                style="width:85%;"
                                size="sm"
                                class="currency-money-field"
                                disabled
                                aria-describedby="rate-amount-feedback"
                              ></money>
                            </b-col>
                          </b-row>
                          <hr />
                          <b-row class="mt-2">
                            <b-col sm="6" class="text-right">
                              <label style="margin-top:3px;">Difference</label>
                            </b-col>
                            <b-col sm="6">
                              <money
                                v-model="form.model.BalanceDifference"
                                v-bind="moneyOptions"
                                style="width:85%;"
                                size="sm"
                                class="currency-money-field"
                                disabled
                                aria-describedby="rate-amount-feedback"
                              ></money>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- END FORM -->
                  <!-- BEGIN DOCUMENT STATUS -->
                  <b-col sm="2" v-if="form.isEdit">
                    <b-card
                      bg-variant="dark"
                      text-variant="white"
                      :title="form.display.DocumentStatus">
                      <b-card-text>
                        <div v-if="form.display.DocumentStatus == 'Void'">
                          <label>
                            <small>Void By :</small>
                            <br />
                            {{form.status.VoidName}}
                          </label>
                          <label>
                            <small>Void Date :</small>
                            <br />
                            {{form.status.VoidDate}}
                          </label>
                          <br />
                          <label>
                            <small>Comments :</small>
                            <br />
                            {{form.display.StatusComment}}
                          </label>
                        </div>
                        <div v-else>
                          <label>
                            <small>Created By :</small>
                          </label>
                          <br />
                          {{form.display.CreatedName}}
                          <br />
                          <label>
                            <small>Created Date :</small>
                          </label>
                          <br />
                          {{form.display.CreatedDate}}
                        </div>
                      </b-card-text>
                    </b-card>
                  </b-col>
                  <!-- END DOCUMENT STATUS -->
                </b-row>
                <b-row class="mt-0">
                  <b-col sm="8"></b-col>
                </b-row>

                <!-- TABLE DETAIL BEGIN -->
                <b-row class="mt-2">
                  <b-col sm="10">
                    <div>
                      <b-card no-body>
                        <b-tabs pills card>
                          <b-tab title="CHECKBOOK ACTIVITIES" active>
                            <b-col sm="12" class="table-responsive">
                              <table
                                id="table-detail"
                                width="100%"
                                class="table-light table-striped table-hover table-bordered"
                              >
                                <thead>
                                  <tr class="font-weight-bold">
                                    <th
                                      colspan="6"
                                      class="text-uppercase text-right"
                                      style="background-color:#fff;"
                                    >Previous Reconcile As Of {{form.model.BankCutoffStart | formattedDMY}}</th>
                                    <th>
                                      <money
                                        v-model="form.model.PrevCheckbookBalance"
                                        v-bind="moneyOptions"
                                        style="width:100%;"
                                        size="sm"
                                        class="currency-money-field font-weight-bold"
                                        disabled
                                        aria-describedby="rate-amount-feedback"
                                      ></money>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th class="text-center" width="100">TRX. DATE</th>
                                    <th class="text-left" width="150">DOCUMENT TYPE</th>
                                    <th class="text-left" width="150">DOCUMENT NO</th>
                                    <th class="text-left">SUBJECT</th>
                                    <th
                                      class="text-center"
                                      style="vertical-align:middle;width:40px;"
                                      v-b-tooltip.hover
                                      title="Tick if activity is valid."
                                    >
                                      <font-awesome-icon
                                        :icon="['fas', 'star']"
                                        class="text-green"
                                      />
                                    </th>
                                    <th class="text-center" width="150">IN</th>
                                    <th class="text-center" width="150">OUT</th>
                                  </tr>
                                </thead>
                               
                                <tbody class="position-relative">
                                  <template v-for="(item, itemIndex) in form.dataDetails">
                                    <tr>
                                      <td
                                        class="text-center"
                                      >{{item.TransactionDate | formattedDMY}}</td>
                                      <td>{{item.DocumentType}}</td>
                                      <td>{{item.DocumentNo}}</td>
                                      <td>{{item.PaidSubject}}</td>
                                      <td
                                        class="text-center"
                                        style="vertical-align:middle;width:40px;"
                                      >
                                        <b-form-checkbox
                                          style="padding-left:30px;"
                                          v-model="item.IsChecked"
                                          v-if="actionButton.AllowEdit"
                                        ></b-form-checkbox>
                                        <font-awesome-icon
                                          v-else
                                          size="lg"
                                          :icon="['fas', 'check']"
                                          variant="danger"
                                        />
                                      </td>
                                      <td>
                                        <b-input-group prepend>
                                          <money
                                            v-model="item.OriginatingDebit"
                                            v-bind="moneyOptions"
                                            class="currency-money-field"
                                            disabled
                                            style="width:100%"
                                          ></money>
                                        </b-input-group>
                                      </td>
                                      <td>
                                        <b-input-group prepend>
                                          <money
                                            v-model="item.OriginatingCredit"
                                            v-bind="moneyOptions"
                                            class="currency-money-field"
                                            disabled
                                            style="width:100%"
                                          ></money>
                                        </b-input-group>
                                      </td>
                                    </tr>
                                  </template>
                                </tbody>
                                <tfoot>
                                  <template>
                                    <tr>
                                      <th colspan="5" class="text-right text-uppercase"></th>
                                      <th>
                                        <money
                                          v-model="form.display.OriginatingDebit"
                                          v-bind="moneyOptions"
                                          class="currency-money-field"
                                          disabled
                                          style="width:100%;"
                                        ></money>
                                      </th>
                                      <th>
                                        <money
                                          v-model="form.display.OriginatingCredit"
                                          v-bind="moneyOptions"
                                          class="currency-money-field"
                                          disabled
                                          style="width:100%;"
                                        ></money>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th
                                        colspan="6"
                                        class="text-right text-uppercase"
                                        v-b-tooltip.hover
                                        title="Balance = Activity In - Activity Out"
                                      >Balance of Checked Activities</th>
                                      <th colspan="1">
                                        <money
                                          v-model="form.model.TotalActivity"
                                          v-bind="moneyOptions"
                                          class="currency-money-field font-weight-bold"
                                          style="width:100%;"
                                          disabled
                                        ></money>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th colspan="6" class="text-right text-uppercase">Adjustments</th>
                                      <th colspan="1">
                                        <money
                                          v-model="form.model.OriginatingTotalAdjustment"
                                          v-bind="moneyOptions"
                                          class="currency-money-field font-weight-bold"
                                          style="width:100%;"
                                          disabled
                                        ></money>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th
                                        colspan="6"
                                        class="text-right text-blue text-uppercase"
                                      >Checkbook Ending</th>
                                      <th colspan="1">
                                        <money
                                          v-model="form.model.CheckbookEndingOrgBalance"
                                          v-bind="moneyOptions"
                                          class="currency-money-field text-blue font-weight-bold"
                                          :value="CheckbookOriginatingBalance"
                                          style="width:100%;"
                                          disabled
                                        ></money>
                                      </th>
                                    </tr>
                                  </template>
                                </tfoot>
                              </table>
                            </b-col>
                          </b-tab>
                          <b-tab title="CHECKBOOK ADJUSTMENTS">
                            <!-- TABLE ADJUSTMENT BEGIN -->
                            <b-row>
                              <b-col>
                                <b-button
                                  variant="yellow"
                                  size="sm"
                                  type="button"
                                  v-if="actionButton.AllowEdit"
                                  :disabled="form.model.CheckbookCode==''"
                                  @click="onModalSearchCharges('ChargesCode','ChargesCode','checkbook')"
                                >
                                  <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add Checkbook Adjustment
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
                                  id="table-adjustment"
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
                                      <th class="text-center" width="140">TRX. DATE</th>
                                      <th class="text-center" width="80">DOC TYPE</th>
                                      <th class="text-left" width="120">CHARGES CODE</th>
                                      <th class="text-left">CHARGES NAME</th>
                                      <th class="text-center">ORIGINATING AMOUNT</th>
                                    </tr>
                                    <tr>
                                      <th class="text-center" colspan="2">RATE</th>
                                      <th class="text-left" colspan="2">DESCRIPTION</th>
                                      <th class="text-center" width="100">FUNCTIONAL AMOUNT</th>
                                    </tr>
                                  </thead>
                                  <tbody class="position-relative">
                                    <template v-for="(item, itemIndex) in form.dataAdjustments">
                                      <tr>
                                        <td rowspan="2">
                                          <b-button
                                            v-if="actionButton.AllowEdit"
                                            variant="outline-danger"
                                            pill
                                            size="sm"
                                            @click="deleteRowAdjustment(itemIndex)"
                                          >
                                            <font-awesome-icon :icon="['fas', 'trash']" />
                                          </b-button>
                                          <span v-else class="mx-2 ml-3">{{itemIndex+1}}</span>  
                                        </td>
                                        <td>
                                          <b-input-group>
                                            <b-form-input
                                              v-model="item.DisplayDate"
                                              type="text"
                                              :placeholder="dateFormatString"
                                              class="text-center"
                                              size="sm"
                                              readonly
                                              aria-describedby="doc-date-feedback"
                                            ></b-form-input>
                                            <b-input-group-append v-if="actionButton.AllowEdit">
                                              <b-form-datepicker
                                                v-model="item.TransactionDate"
                                                button-only
                                                size="sm"
                                                left
                                                locale="en-US"
                                                @input="dateChangedAdjItem(itemIndex)"
                                                :min="minCalendarDate"
                                                :max="maxCalendarDate"
                                                dark
                                              ></b-form-datepicker>
                                            </b-input-group-append>
                                          </b-input-group>
                                        </td>
                                        <td>
                                          <b-form-select
                                            name="DocumentType"
                                            v-model="item.DocumentType"
                                            size="sm"
                                            :plain="true"
                                            :options="[{value:'IN',text:'IN'},{value:'OUT',text:'OUT'}]"
                                            :disabled="!actionButton.AllowEdit"
                                          />
                                        </td>

                                        <td>
                                          <b-form-input
                                            placeholder="Charges Code"
                                            type="text"
                                            size="sm"
                                            v-model="item.ChargesCode"
                                            readonly
                                          />
                                        </td>
                                        <td>
                                          <b-form-input
                                            placeholder="Charges Name"
                                            type="text"
                                            size="sm"
                                            v-model="item.ChargesName"
                                            readonly
                                          />
                                        </td>
                                        <td>
                                          <money
                                            v-model="item.OriginatingAmount"
                                            v-bind="moneyOptions"
                                            size="sm"
                                            class="currency-money-field"
                                            :disabled="!actionButton.AllowEdit"
                                          ></money>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <b-input-group size="sm" prepend>
                                            <money
                                              v-model="item.ExchangeRate"
                                              v-bind="moneyOptions"
                                              size="sm"
                                              class="currency-money-field"
                                              style="width:100px;"
                                              disabled
                                            ></money>
                                            <b-input-group-append
                                              v-if="actionButton.AllowEdit && item.TransactionDate != '' && form.model.CurrencyCode != '' && form.FunctionalCurrency != form.model.CurrencyCode"
                                            >
                                              <b-button
                                                variant="outline-primary"
                                                size="sm"
                                                @click="openModalExchangeRate(item)"
                                              >
                                                <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
                                              </b-button>
                                            </b-input-group-append>
                                          </b-input-group>
                                        </td>
                                        <td colspan="3">
                                          <b-form-input
                                            placeholder="Description"
                                            type="text"
                                            size="sm"
                                            v-model="item.Description"
                                            :readonly="!actionButton.AllowEdit"
                                          />
                                        </td>
                                        <td>
                                          <money
                                            v-model="item.FunctionalAmount"
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
                                      <th class="text-right" colspan="5">ORIGINATING TOTAL AMOUNT</th>
                                      <th>
                                        <money
                                          v-model="form.model.OriginatingTotalAdjustment"
                                          v-bind="moneyOptions"
                                          size="sm"
                                          class="currency-money-field"
                                          disabled
                                        ></money>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th class="text-right" colspan="5">FUNCTIONAL TOTAL AMOUNT</th>
                                      <th>
                                        <money
                                          v-model="form.model.FunctionalTotalAdjustment"
                                          v-bind="moneyOptions"
                                          size="sm"
                                          class="currency-money-field"
                                          disabled
                                        ></money>
                                      </th>
                                    </tr>
                                  </tfoot>
                                  <slot name="caption" />
                                </table>
                              </b-col>
                            </b-row>
                            <!-- TABLE ADJUSTMENT END -->
                          </b-tab>
                        </b-tabs>
                      </b-card>
                    </div>
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
                :fields="this.$store.state.features.finance.bank_reconcile.progress.headers"
                :items="this.$store.state.features.finance.bank_reconcile.progress.data"
                :info="this.$store.state.features.finance.bank_reconcile.progress.listInfo"
                :baseUrl="this.$store.state.features.finance.bank_reconcile.progress.baseUrl"
                :actGetData="handleGetProgress"
                :actCreate="onFormCreate"
                :actEditRow="handleEdit"
                :actDeleteRow="handleDelete"
                addTableClasses="table-bordered"
                responsive
                items-per-page-select
                loading
                hover
                sorter
                pagination
                column-filter
                caption="Bank Reconciliation - Progress"
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
                  :fields="this.$store.state.features.finance.bank_reconcile.history.headers"
                  :items="this.$store.state.features.finance.bank_reconcile.history.data"
                  :info="this.$store.state.features.finance.bank_reconcile.history.listInfo"
                  :baseUrl="this.$store.state.features.finance.bank_reconcile.history.baseUrl"
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
                  caption="Bank Reconciliation - History"
                  disableNewButton
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

    <!-- BEGIN MODAL CHECKBOOK -->
    <b-modal v-model="isShowCheckbook" hide-footer size="lg">
      <template v-slot:modal-title>Select Checkbook</template>
      <div class="d-block text-center">
        <SelectGrid
          ref="gridCheckbookSelect"
          :fields="[{label: 'Checkbook Code', key: 'CheckbookCode'},
                      {label: 'Checkbook Name', key: 'CheckbookName'},
                      {label: 'Currency Code', key: 'CurrencyCode'},
                      {label: 'Bank Account No', key: 'BankAccountCode'}]"
          :items="this.$store.state.features.company.checkbook.data"
          :info="this.$store.state.features.company.checkbook.listInfo"
          :baseUrl="this.$store.state.features.company.checkbook.baseUrl"
          :actGetData="handleGetCheckbookSelect"
          :selectedItem="form.model.CheckbookCode"
          selectedFieldName="CheckbookCode"
          :actSelectRow="handleSelectCheckbook"
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
    <!-- END MODAL CHECKBOOK -->
    <!-- BEGIN MODAL -->
    <ChargesModal ref="dlgCharges" :actSelectedRow="onSelectedCharges"></ChargesModal>
    <ExchangeRateModal ref="dlgExchangeRate" :actSelectedRow="onSelectedExchangeRate"></ExchangeRateModal>
    <!-- END MODAL -->
  </div>
</template>

<script>
import DataGrid from "@/components/Tables/DataGrid";
import SelectGrid from "@/components/tables/SelectGrid";
import VueElementLoading from "vue-element-loading";
import { ChargesModal, ExchangeRateModal } from "@/pages/modal/index.js";
import { mask } from "vue-the-mask";
import moment from "moment";
  import util from "@/helper/utils";
  import loginServices from '../../services/loginservices'

export default {
  name: "BankReconcile",
  layout: "dashboard",
  components: {
    DataGrid,
    SelectGrid,
    VueElementLoading,
    ChargesModal, ExchangeRateModal
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
      formCaption: "Bank Reconciliation",
      caption: "Bank Reconciliation",
      blockLoader: false,
      isForm: false,
      moneyOptions: {decimal: ",",thousands: ".",prefix: "",suffix: "",precision: 0,masked: false,allowBlank: false,min: 0},
      moneyOptionsMinus: {decimal: ",",thousands: ".",prefix: "(",suffix: ")",precision: 0,masked: false,allowBlank: false,min: 0},
      perPage: 10,
      voidState: null,
      isShowCheckbook: false,
      defaultRateType: 0,
      FunctionalCurrency : "",
      form: {
        AllowNewReconcile : true,
        valid: false,
        isEdit: false,
        model: {
          BankReconcileId: "00000000-0000-0000-0000-000000000000",
          TransactionDate: moment().format("YYYY-MM-DD"),
          DocumentNo: "",
          CheckbookCode: "",
          CurrencyCode: "",
          BankCutoffStart: moment().format("YYYY-MM-DD"),
          BankCutoffEnd: moment().format("YYYY-MM-DD"),
          PrevBankReconcileId : "00000000-0000-0000-0000-000000000000",
          Description: "",
          BankEndingOrgBalance: 0,
          CheckbookEndingOrgBalance: 0,
          Status: 1,
          ReconcileDetails: Array,
          ReconcileAdjustments: Array,
          VoidDate: moment().format("YYYY-MM-DD"),
          PrevCheckbookBalance: 0,
          TotalActivity: 0,
          OriginatingTotalAdjustment: 0,
          BalanceDifference: 0,
          FunctionalTotalAdjustment: 0,
          PrevReconcileDocNo : "",
        },
        dataDetails: [],
        dataAdjustments: [],
        display: {
          DocumentDate: moment().format("DD/MM/YYYY"),
          DocumentStatus: "",
          OriginatingDebit: 0,
          OriginatingCredit: 0,
          CreatedName: "",
          CreatedDate: "",
          StatusComment: "",
          VoidDate: moment().format("DD/MM/YYYY"),
          BankCutoffEnd: moment().format("DD/MM/YYYY"),
          BankCutoffStart: moment().format("DD/MM/YYYY")
        },
        status: {
          VoidName: "",
          VoidDate: moment().format("DD/MM/YYYY")
        },
        VoidReason: ""
      }
    };
  },
  watch: {
    "form.model.BankCutoffEnd"(newVal) {
      this.dateChangedCutoffEnd();
    },
    "form.model.BankEndingOrgBalance"(newVal) {
      this.form.model.BalanceDifference = newVal - this.form.model.CheckbookEndingOrgBalance;
    },
    "form.dataDetails": {
      handler: function(after, before) {
        this.doCalculateDetails();
      },
      deep: true
    },
    "form.dataAdjustments": {
      handler: function(after, before) {
        this.doCalculateAdjustments();
      },
      deep: true
    }
  },
  filters: {
    formattedDMY: function(value, dateFormat) {
      if (dateFormat == undefined) dateFormat = "DD/MM/YYYY ";
      return moment(value)
        .format(dateFormat);
    }
  },
  async mounted() {
    //OBTAIN MINIMUM CALENDAR INPUT
    let minimumInputDate = await this.$store.dispatch(
      "features/finance/constants/actGetMinInputDateFinancial"
    );
    if (minimumInputDate != undefined)
      this.minCalendarDate = moment(minimumInputDate).format("YYYY-MM-DD");

    await this.$store.dispatch(
      "features/company/financial_setup/actGet",
      "FinancialSetup?"
    );

    await this.$store.dispatch(
      "features/finance/bank_reconcile/progress/actGetData",
      "GetProgressBankReconcile?"
    );
    await this.$store.dispatch(
      "features/finance/bank_reconcile/history/actGetData",
      "GetHistoryBankReconcile?"
    );

    await this.$store.dispatch(
      "features/company/checkbook/actGetCheckbook",
      "Checkbook?&InActive=false"
    );

    //CALL INITIAL SETUP
    await this.initForm();
  },
  computed: {
    maxVoidCalendarDate() {
      let trxDate = moment(this.form.model.TransactionDate, "YYYY-MM-DD");
      if (moment() <= trxDate) {
        return this.form.model.TransactionDate;
      } else {
        return moment().utc().format("YYYY-MM-DD");
      }
    },
    CheckbookOriginatingBalance: function() {
      let checkbookBalance =
        this.form.model.PrevCheckbookBalance +
        this.form.model.TotalActivity +
        this.form.model.OriginatingTotalAdjustment;
     
      return checkbookBalance;
    }    
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
    async dateChanged() {
      this.form.display.DocumentDate = "";
      if (this.form.model.TransactionDate != null)
        this.form.display.DocumentDate = moment(
          this.form.model.TransactionDate
        ).format(this.dateFormatString);
    },
    async dateChangedCutoffEnd() {
      this.form.display.BankCutoffEnd = "";
      if (this.form.model.BankCutoffEnd != null)
        this.form.display.BankCutoffEnd = moment(
          this.form.model.BankCutoffEnd
        ).format(this.dateFormatString);

      await this.obtainBankActivitiesByCheckbook();
    },
    async dateChangedVoid() {
      this.form.display.VoidDate = "";
      if (this.form.model.VoidDate != null)
        this.form.display.VoidDate = moment(this.form.model.VoidDate).format(
          this.dateFormatString
        );
    },
    async getCurrentExchangeRate(ymd) {
      //OBTAIN DEFAULT EXCHANGE RATE AMOUNT
      if (this.form.model.CurrencyCode != "" && this.form.defaultRateType > 0) {
        if(this.form.model.CurrencyCode != this.form.FunctionalCurrency){
          await this.$store.dispatch(
            "features/company/exchange_rate_header/actGetCurrentExchangeRate",
            "GetCurrentExchangeRate?CurrencyCode=" +
            this.form.model.CurrencyCode +
            "&TransactionDate=" +
            ymd +
            "&RateType=" +
            this.form.defaultRateType
          );
          return this.$store.state.features.company.exchange_rate_header.dataExcRate;
        }else{
          return 1;
        }        
      }
    },
    async dateChangedAdjItem(index) {
      if(this.form.dataAdjustments[index] != undefined){
        this.form.dataAdjustments[index].DisplayDate = "";
        if (this.form.dataAdjustments[index].TransactionDate != null)
          this.form.dataAdjustments[index].DisplayDate = moment(
            this.form.dataAdjustments[index].TransactionDate
        ).format(this.dateFormatString);

        let rate = await this.getCurrentExchangeRate(this.form.dataAdjustments[index].TransactionDate);
        this.form.dataAdjustments[index].ExchangeRate = rate;
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
    async initForm() {
      //DO INIT IF ANY
      let finSetup = this.$store.state.features.company.financial_setup.data[0];
      
      this.form.defaultRateType = finSetup.DefaultRateType;
      this.form.FunctionalCurrency = finSetup.FuncCurrencyCode;
    },
    async doCalculateDetails() {
      let totalActivities = 0;
      let orgDebit = 0;
      let orgCredit = 0;

      if (
        Array.isArray(this.form.dataDetails) &&
        this.form.dataDetails.length
      ) {
        this.form.dataDetails.forEach(function(detail) {
          orgDebit += detail.OriginatingDebit;
          orgCredit += detail.OriginatingCredit;

          if (detail.IsChecked == true) {
            totalActivities +=
              detail.OriginatingDebit - detail.OriginatingCredit;
          }
        });
      }

      this.form.display.OriginatingDebit = orgDebit;
      this.form.display.OriginatingCredit = orgCredit;
      this.form.model.TotalActivity = totalActivities;
      
      let checkbookBalance =
        this.form.model.PrevCheckbookBalance +
        this.form.model.TotalActivity +
        this.form.model.OriginatingTotalAdjustment;

      this.form.model.CheckbookEndingOrgBalance = checkbookBalance;

      this.form.model.BalanceDifference = (this.form.model.BankEndingOrgBalance - this.form.model.CheckbookEndingOrgBalance);
    },
    validateState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async handleGetProgress(url) {
      await this.$store.dispatch(
        "features/finance/bank_reconcile/progress/actGetData",
        url
      );
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
    },
    async handleGetHistory(url) {
      await this.$store.dispatch(
        "features/finance/bank_reconcile/history/actGetData",
        url
      );
      await loginServices.doLoginCompany(this.$store.state.user, this.$store.state.companySecurity, this.$store.state.token.replace('Bearer ', ""))
    },
    async obtainPrevBankReconcile() {
      var response = await this.$store.dispatch(
        "features/finance/bank_reconcile/history/actGetPrevBankReconcile",
        this.form.model
      );
      if (response.status == 200) {
        if (response.data.BankReconcile != undefined) {
          let data = response.data.BankReconcile;
          this.form.model.BankCutoffStart = data.BankCutoffEnd;
          
          this.form.model.PrevCheckbookBalance = data.CheckbookEndingOrgBalance;    
          this.form.model.PrevBankReconcileId = data.BankReconcileId;
          this.form.model.PrevReconcileDocNo = data.DocumentNo;
        } else {
          this.form.model.BankCutoffStart = this.minCalendarDate;
          
          this.form.model.PrevCheckbookBalance = 0;
          this.form.model.PrevBankReconcileId = "00000000-0000-0000-0000-000000000000";
          this.form.model.PrevReconcileDocNo = "";
        }

        if (response.data.AllowNew != undefined) {
          this.form.AllowNewReconcile = response.data.AllowNew;

          if(this.form.AllowNewReconcile){
            this.actionButton.AllowSave = true;
            this.actionButton.AllowEdit = true;
          }else{
            this.actionButton.AllowSave = false;
            this.actionButton.AllowEdit = false;
          }
        }
      }
    },
    async obtainBankActivitiesByCheckbook() {

      if (this.form.model.CheckbookCode != "" && this.form.model.Status == 1) {
        this.showLoader(true);

        var response = await this.$store.dispatch(
          "features/finance/bank_reconcile/history/actGetActivitiesBankReconcile",
          this.form.model
        );
        if (response.status == 200) {
          if (Array.isArray(response.data.CheckbookActivities)) {
            let data = response.data.CheckbookActivities;

            this.form.dataDetails = [];

            let arr = [];
            if (data.length) {
              for (var i = 0; i < data.length; i++) {
                arr.push({
                  Index: i,
                  TransactionId: data[i].TransactionId,
                  Modul : data[i].Modul,
                  DocumentNo: data[i].DocumentNo,
                  DocumentType: data[i].DocumentType,
                  PaidSubject: data[i].PaidSubject,
                  TransactionDate: data[i].TransactionDate,
                  OriginatingDebit: data[i].OriginatingDebit,
                  OriginatingCredit: data[i].OriginatingCredit,
                  IsChecked: data[i].IsChecked
                });
              }
            }

            this.form.dataDetails = arr;
          }
        }

        this.showLoader(false);
      }
    },
    async handleGetCheckbookSelect(url) {
      if (url.toLowerCase().lastIndexOf("InActive") < 0) {
        url = url + "&InActive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&InActive"));
        url = clean_uri + "&InActive=false";
      }

      if (url.lastIndexOf("Checkbook") < 0) {
        url = "Checkbook?" + url;
      }

      await this.$store.dispatch(
        "features/company/checkbook/actGetCheckbook",
        url
      );

      this.$refs.gridCheckbookSelect.doRefresh();
    },
    async handleSelectCheckbook(row) {
      this.form.model.CheckbookCode = row.CheckbookCode;
      this.form.model.CurrencyCode = row.CurrencyCode;
      if (row.DecimalPlaces != undefined){
        this.moneyOptions.precision = row.DecimalPlaces;
        this.moneyOptionsMinus.precision = row.DecimalPlaces;
      }        

      await this.obtainPrevBankReconcile();
      await this.obtainBankActivitiesByCheckbook();

      this.isShowCheckbook = false;
    },
    async onModalSearchCharges(row) {
      let finSetup = this.$store.state.features.company.financial_setup.data[0];

      this.$refs.dlgCharges
        .open(
          row,
          this.form.model[row],
          finSetup.CheckbookChargesType,
          "Checkbook"
        )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedCharges(row) {
      let trxDate =  moment().utc().format("YYYY-MM-DD");
      let rate = 1; 
      
      if(this.form.model.CurrencyCode != this.form.FunctionalCurrency){
        rate = await this.getCurrentExchangeRate(trxDate);
      }

      this.form.dataAdjustments.push({
        Index: this.form.dataAdjustments.length,
        ChargesId: row.ChargesId,
        TransactionDate: trxDate,
        DisplayDate: moment(trxDate).format(this.dateFormatString),
        TransactionType: "NORMAL",
        DocumentType: "IN",
        ChargesCode: row.ChargesCode,
        ChargesName: row.ChargesName,
        CurrencyCode: this.form.model.CurrencyCode,
        ExchangeRate: rate,
        IsMultiply: true,
        PaidSubject: "",
        Description: "",
        OriginatingAmount: 0,
        FunctionalAmount: 0
      });
    },
    async doCalculateAdjustments() {
      let originatingAmount = 0;
      let functionalAmount = 0;

      if (
        Array.isArray(this.form.dataAdjustments) &&
        this.form.dataAdjustments.length
      ) {
        this.form.dataAdjustments.forEach(function(detail) {
          let funcValue = detail.IsMultiply
            ? detail.OriginatingAmount * detail.ExchangeRate
            : detail.OriginatingAmount / detail.ExchangeRate;
          detail.FunctionalAmount = funcValue;

          if(detail.DocumentType == 'IN'){
            originatingAmount += detail.OriginatingAmount;
            functionalAmount += funcValue;
          }else{
            originatingAmount -= detail.OriginatingAmount;
            functionalAmount -= funcValue;
          }          
        });
      }
      this.form.model.OriginatingTotalAdjustment = originatingAmount;
      this.form.model.FunctionalTotalAdjustment = functionalAmount;

      let checkbookBalance =
        this.form.model.PrevCheckbookBalance +
        this.form.model.TotalActivity +
        this.form.model.OriginatingTotalAdjustment;

      this.form.model.CheckbookEndingOrgBalance = checkbookBalance;
      
      this.form.model.BalanceDifference = this.form.model.BankEndingOrgBalance - this.form.model.CheckbookEndingOrgBalance;
    },

    async openModalExchangeRate(row) {
      this.$refs.dlgExchangeRate
        .open(
          this.form.model.CurrencyCode,
          row.TransactionDate,
          this.form.defaultRateType,
          this.moneyOptions, 1, row.Index
        )
        .then(res => {
          //console.log(res);
        })
        .catch(res => {
          //console.log(res);
        });
    },
    async onSelectedExchangeRate(item) {
      if (item != undefined) {
        this.form.dataAdjustments[item.ReffIndex].ExchangeRate = item.ExchangeRateAmount;
        this.form.dataAdjustments[item.ReffIndex].IsMultiply = item.CalcIsMultiply;
      }
    },
    async deleteRowAdjustment(index) {
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
            this.form.dataAdjustments.splice(index, 1);
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
      this.form.AllowNewReconcile = true;
      this.form.model.BankReconcileId = "00000000-0000-0000-0000-000000000000";
      this.form.model.TransactionDate = moment().format("YYYY-MM-DD");
      this.form.model.DocumentNo = "";
      this.form.model.CheckbookCode = "";
      this.form.model.CurrencyCode = "";
      this.form.model.BankCutoffStart = moment().format("YYYY-MM-DD");
      this.form.model.BankCutoffEnd = moment().format("YYYY-MM-DD");
      this.form.model.Description = "";
      this.form.model.BankEndingOrgBalance = 0;
      this.form.model.CheckbookEndingOrgBalance = 0;
      this.form.model.Status = 1;
      this.form.model.ReconcileDetails = [];
      this.form.model.ReconcileAdjustments = [];
      this.form.model.BalanceDifference = 0;
      this.form.model.OriginatingTotalAdjustment = 0;
      this.form.model.PrevCheckbookBalance = 0;
      this.form.model.PrevBankReconcileId = "00000000-0000-0000-0000-000000000000";
      this.form.model.PrevReconcileDocNo = "";

      this.form.dataDetails = [];
      this.form.dataAdjustments = [];

      this.form.display.DocumentDate = moment().format(this.dateFormatString);
      this.form.display.OriginatingDebit = 0;
      this.form.display.OriginatingCredit = 0;

      this.form.display.CreatedName = "";
      this.form.display.CreatedDate = "";
      this.form.status.VoidName = "";
      this.form.status.VoidDate = "";

      this.form.display.StatusComment = "";

      this.actionButton.AllowSave = true;
      this.actionButton.AllowEdit = true;
      this.actionButton.AllowPosting = false;
      this.actionButton.AllowVoid = false;

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onFormCreate() {
      this.resetForm();

      this.form.isEdit = false;
      this.isForm = true;
    },
    async handleEdit(row) {
      this.isForm = true;

      //BINDING EDITTED DATA
      this.form.model.BankReconcileId = row.BankReconcileId;
      this.form.model.TransactionDate = this.form.model.TransactionDate = moment(
        row.TransactionDate
      ).format("YYYY-MM-DD");
      this.form.model.DocumentNo = row.DocumentNo;
      this.form.model.CheckbookCode = row.CheckbookCode;
      this.form.model.CurrencyCode = row.CurrencyCode;
      this.form.model.BankCutoffStart = moment(row.BankCutoffStart).format(
        "YYYY-MM-DD"
      );
      this.form.model.BankCutoffEnd = moment(row.BankCutoffEnd).format(
        "YYYY-MM-DD"
      );
      this.form.model.Description = row.Description;
      this.form.model.BankEndingOrgBalance = row.BankEndingOrgBalance;
      this.form.model.CheckbookEndingOrgBalance = row.CheckbookEndingOrgBalance;
      this.form.model.Status = util.docStatus(row.Status);
      this.form.model.VoidDate = this.form.model.TransactionDate;
      this.form.model.BalanceDifference =
        this.form.model.BankEndingOrgBalance -
        this.form.model.CheckbookEndingOrgBalance;

      //OBTAIN PREV BALANCE
      this.form.model.PrevCheckbookBalance = row.PrevCheckbookBalance;
      this.form.model.PrevBankReconcileId = row.PrevBankReconcileId;
      this.form.model.PrevReconcileDocNo = row.PrevReconcileDocNo;

      this.form.display.DocumentDate = moment(
        this.form.model.TransactionDate
      ).format(this.dateFormatString);

      this.form.display.DocumentStatus = row.Status;
      this.form.display.StatusComment = row.StatusComment;
      this.form.display.VoidDate = this.form.display.DocumentDate;

      this.form.status.VoidName = row.VoidByName;
      this.form.status.VoidDate =
        row.VoidDate != undefined
          ? moment(row.VoidDate).format("DD/MM/YYYY HH:mm:ss")
          : "";

      this.form.display.CreatedName = row.CreatedByName;
      this.form.display.CreatedDate = moment(row.CreatedDate).format(
        "DD/MM/YYYY HH:mm:ss"
      );

      //BEGIN DETAILS
      this.form.dataDetails = [];

      let arrDetail = [];
      if (row.ReconcileDetails.length) {
        for (var i = 0; i < row.ReconcileDetails.length; i++) {
          let orgDebit = 0;
          let orgCredit = 0;
          if (row.ReconcileDetails[i]["DocumentType"] == "CHECKBOOK IN" || row.ReconcileDetails[i]["DocumentType"] == "IN" || row.ReconcileDetails[i]["TransactionType"] == "ADVANCE RECEIPT" || row.ReconcileDetails[i]["DocumentType"] == "RECEIPT") {
            orgDebit = row.ReconcileDetails[i]["OriginatingAmount"];
            orgCredit = 0;
          } else {
            orgCredit = row.ReconcileDetails[i]["OriginatingAmount"];
            orgDebit = 0;
          }

          arrDetail.push({
            Index : i,
            DocumentType : row.ReconcileDetails[i]["DocumentType"],
            TransactionType : row.ReconcileDetails[i]["TransactionType"],
            TransactionDate : row.ReconcileDetails[i]["TransactionDate"],
            TransactionId : row.ReconcileDetails[i]["TransactionId"],
            Modul : row.ReconcileDetails[i]["Modul"],
            IsChecked : row.ReconcileDetails[i]["IsChecked"],
            PaidSubject : row.ReconcileDetails[i]["PaidSubject"],
            DocumentNo : row.ReconcileDetails[i]["DocumentNo"],
            OriginatingAmount : row.ReconcileDetails[i]["OriginatingAmount"],
            OriginatingDebit : orgDebit,
            OriginatingCredit : orgCredit,
          });          
        }
      }
      
      this.form.dataDetails = arrDetail;
      this.form.model.ReconcileDetails = [];
      //END DETAILS

      //BEGIN ADJUSTMENTS
      this.form.model.ReconcileAdjustments = [];
      this.form.dataAdjustments = [];

      let arrAdjustment = [];
      if (row.ReconcileAdjustments.length) {
        for (var i = 0; i < row.ReconcileAdjustments.length; i++) {
          let orgDebit = 0;
          let orgCredit = 0;
          if (row.ReconcileAdjustments[i]["DocumentType"] == "IN") {
            orgDebit = row.ReconcileAdjustments[i]["OriginatingAmount"];
            orgCredit = 0;
          } else {
            orgCredit = row.ReconcileAdjustments[i]["OriginatingAmount"];
            orgDebit = 0;
          }

          arrAdjustment.push({
            Index : i,
            ChargesId: row.ReconcileAdjustments[i].ChargesId,
            TransactionDate : row.ReconcileAdjustments[i]["TransactionDate"],
            DisplayDate : moment(row.ReconcileAdjustments[i]["TransactionDate"]).utc().format(this.dateFormatString),
            TransactionType : row.ReconcileAdjustments[i]["TransactionType"],
            DocumentType : row.ReconcileAdjustments[i]["DocumentType"],
            ChargesCode: row.ReconcileAdjustments[i].ChargesCode,
            ChargesName: row.ReconcileAdjustments[i].ChargesName,
            CurrencyCode: row.ReconcileAdjustments[i].CurrencyCode,
            ExchangeRate: row.ReconcileAdjustments[i].ExchangeRate,
            IsMultiply: row.ReconcileAdjustments[i].IsMultiply,
            PaidSubject: row.ReconcileAdjustments[i].PaidSubject,
            Description: row.ReconcileAdjustments[i].Description,
            OriginatingAmount: row.ReconcileAdjustments[i].OriginatingAmount,
            FunctionalAmount: row.ReconcileAdjustments[i].FunctionalAmount
          });     
        }
      }
      this.form.dataAdjustments = arrAdjustment;

      //END ADJUSTMENTS

      //ACTIVATE BUTTONS
      if (
        this.form.model.BankReconcileId != "" &&
        this.form.model.DocumentNo != ""
      ) {
        if (this.form.model.Status == util.docStatus("New")) {
          this.actionButton.AllowEdit = true;
          this.actionButton.AllowSave = true;
          this.actionButton.AllowPosting = true;
          this.actionButton.AllowVoid = false;
        } else if (this.form.model.Status == util.docStatus("posted")) {
          if(row.AllowVoid != undefined){
            this.actionButton.AllowVoid = row.AllowVoid;
          }else{
            this.actionButton.AllowVoid = true;
          }
          
          this.actionButton.AllowSave = false;
          this.actionButton.AllowEdit = false;
          this.actionButton.AllowPosting = false;
        } else {
          this.actionButton.AllowVoid = false;
          this.actionButton.AllowSave = false;
          this.actionButton.AllowEdit = false;
          this.actionButton.AllowPosting = false;
        }
      } else {
        this.actionButton.AllowSave = true;
        this.actionButton.AllowEdit = true;
        this.actionButton.AllowPosting = false;
        this.actionButton.AllowVoid = false;
      }

      this.form.isEdit = true;
    },
    async doDelete(row) {
      this.showLoader(true);

      await this.$store.dispatch(
        "features/finance/bank_reconcile/progress/actDelete",
        row
      );

      var response = this.$store.state.features.finance.bank_reconcile.progress
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
      
      let checked = false;
      if(this.form.dataDetails.length > 0){
        this.form.dataDetails.forEach(function(detail) {
          if( detail.IsChecked){
            checked =true;
            return
          }
        });   
        
        if(!checked){
          valid = false;
          this.handleToast(
            "Warning",
            "danger",
            "No activity selected !"
          );
        }     
      }

      if(this.form.dataAdjustments.length > 0){
        this.form.dataAdjustments.forEach(function(detail) {
          if( detail.OriginatingAmount <= 0){
            valid =false;
            return
          }
        });
        if(!valid){
          this.handleToast(
              "Warning",
              "danger",
              "Each adjusment Amount must not 0 !"
            );
        }
      }

      if (
        this.form.model.BankEndingOrgBalance == 0
      ) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Bank Statement balance not 0 !"
        );
      }

      if (
        this.form.model.CheckbookEndingOrgBalance == 0
      ) {
        valid = false;
        this.handleToast(
          "Warning",
          "danger",
          "Checkbook Ending balance must not 0 !"
        );
      }

      return valid;
    },
    async onSubmit() {
      if (this.validateForm()) {
        this.showLoader(true);

        this.form.model.ReconcileDetails = this.form.dataDetails;
        this.form.model.ReconcileAdjustments = this.form.dataAdjustments;
        
        if (this.form.isEdit) {
          await this.$store.dispatch(
            "features/finance/bank_reconcile/progress/actUpdate",
            this.form.model
          );
          var response = this.$store.state.features.finance.bank_reconcile
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
            "features/finance/bank_reconcile/progress/actCreate",
            this.form.model
          );
          var response = this.$store.state.features.finance.bank_reconcile
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
      this.showLoader(true);

      this.form.model.Reason = "";

      await this.$store.dispatch(
        "features/finance/bank_reconcile/progress/actPosting",
        this.form.model
      );

      var response = this.$store.state.features.finance.bank_reconcile.progress
        .resultUpdate;
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
    },
    async clickPosting(index) {
      this.$bvModal
        .msgBoxConfirm(
          "Posting " +
            this.form.model.DocumentNo +
            " ? (make sure you already save all your changes)",
          {
            title: "Posting Confirmation",
            size: "md",
            buttonSize: "sm",
            okVariant: "blue",
            okTitle: "YES",
            cancelTitle: "NO",
            centered: true,
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            hideHeaderClose: false
          }
        )
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

      await this.$store.dispatch(
        "features/finance/bank_reconcile/progress/actVoid",
        this.form.model
      );

      var response = this.$store.state.features.finance.bank_reconcile.progress
        .resultUpdate;
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
      this.form.VoidReason = "";
      this.voidState = null;
    },
    checkFormValidity() {
      const valid = this.$refs.formvoid.checkValidity();
      this.voidState = valid;
      return valid;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleVoid();
    },
    handleCancel(bvModalEvt) {
      this.resetModal();
      // Prevent modal from closing
      this.$bvModal.hide("modal-void-reason");
    },
    handleVoid() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      this.doVoidJournal();

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-void-reason");
      });
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

#table-adjustment thead th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}

#table-adjustment tbody td {
  font-size: 12px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-adjustment tfoot th {
  font-size: 12px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}

@media only screen and (max-width: 1024px) {
  h5{
    font-size:14px;
  }
  
#table-detail thead th {
  font-size: 10px;
  border: 1px solid #cfd8dc;
  padding: 3px;
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
  padding: 3px;
  background-color: #f5f5f5;
}

#table-adjustment thead th {
  font-size: 10px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}

#table-adjustment tbody td {
  font-size: 10px;
  border-left: 0.5px solid #cfd8dc;
  border-right: 0.5px solid #cfd8dc;
  border-bottom: 1px solid #cfd8dc;
  padding: 3px;
  background-color: white;
}

#table-adjustment tfoot th {
  font-size: 10px;
  border: 1px solid #cfd8dc;
  padding: 3px;
  background-color: #f5f5f5;
}
}
</style>
