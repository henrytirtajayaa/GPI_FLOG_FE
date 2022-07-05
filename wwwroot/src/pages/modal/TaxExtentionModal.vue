<template>
  <b-modal
    ref="modal-footer-tax"
    size="lg"
    @ok="handleOk"
    @hide="resetModal"
    @cancel="handleCancel"
  >
    <template v-slot:modal-title>Document Based Tax Extention</template>
    <div class="d-block text-left" size="xl">
      <b-card-text>
        <b-row>
          <b-col sm="5" class="mt-1">
            <b-form-radio-group
              v-model="input.IsTaxAfterDiscount"
              :options="[{ item: false, name: 'Before Discount' },{ item: true, name: 'After Discount' }]"
              size="sm"
              value-field="item"
              text-field="name"
            ></b-form-radio-group>
          </b-col>
          <b-col sm="4">
            <money
              v-model="input.BaseAmount"
              v-bind="moneyOptions"
              size="sm"
              disabled
              class="currency-money-field"
            ></money>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="3">
            <label><small>Schedule Code</small></label>
            <b-input-group prepend>
              <b-form-input
                v-model="input.TaxScheduleCode"
                class="font-weight-bold"
                readonly
                size="sm"
              ></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-secondary" size="sm" @click.prevent="onModalSheduleCode">
                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                </b-button>
                <b-button variant="outline-danger" size="sm" @click="onRemoveSchedule">
                  <font-awesome-icon :icon="['fas', 'trash']"></font-awesome-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col sm="3">
            <label><small>% of Tax Based Amount</small></label>
            <b-input-group prepend>
              <money
                v-model="input.TaxBasedPercent"
                v-bind="moneyOptions"
                size="sm"
                disabled
                class="currency-money-field"
              ></money>
            </b-input-group>
          </b-col>
          <b-col sm="3">
            <label><small>Taxable Percent</small></label>
            <b-input-group prepend>
              <money
                v-model="input.TaxablePercent"
                v-bind="moneyOptions"
                size="sm"
                disabled
                class="currency-money-field"
              ></money>
            </b-input-group>
          </b-col>
          <b-col sm="3">
            <label><small>Originating Tax Amount</small></label>
            <b-input-group prepend>
              <money
                v-model="input.TaxAmount"
                v-bind="moneyOptions"
                size="sm"
                disabled
                class="currency-money-field font-weight-bold"
              ></money>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="3">
            <b-button variant="yellow" size="sm" type="button" @click.prevent="addExtended()">
              <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;Add
            </b-button>
          </b-col>
        </b-row>
        <!-- DETIL BEGIN -->
        <b-row class="mt-3">
          <b-col>
            <table
              id="table-detail"
              width="100%"
              class="table-light table-striped table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th class="text-center" width="20px">
                    <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
                  </th>
                  <th class="text-left" >Schedule Code</th>
                  <!--th class="text-left">Description</th-->
                  <th class="text-left" width="10%"></th>
                  <th class="text-left" width="17%">% Of Tax from Base</th>
                  <th class="text-left" width="12%">Taxable (%)</th>
                  <th class="text-left" width="10%">Org. Tax Amount</th>
                </tr>
              </thead>
              <tbody class="position-relative">
                <template v-for="(item, itemIndex) in model.TaxDetails">
                  <tr>
                    <td class="text-center">
                      <font-awesome-icon
                        :icon="['fas', 'trash']"
                        @click="deleteTaxDetail(itemIndex)"
                      />
                    </td>
                    <td>
                      <span >{{item.TaxScheduleCode}}</span>
                    </td>
                    <!--td>{{item.Description}}</td-->
                    <td><small>{{item.IsTaxAfterDiscount ? "After Disc" : "Before Disc"}}</small></td>
                    <td>
                      <money
                        v-model="item.TaxBasePercent"
                        v-bind="moneypercent"
                        class="currency-money-field"
                        size="sm"
                        style="width:120px;"
                        disabled
                      ></money>
                    </td>
                    <td>
                      <money
                        v-model="item.TaxablePercent"
                        v-bind="moneypercent"
                        size="sm"
                        disabled
                        style="width:60px;"
                        class="currency-money-field"
                      />
                    </td>
                    <td>
                      <b-input-group prepend>
                        <money
                          v-model="item.OriginatingTaxAmount"
                          v-bind="moneyOptions"
                          size="sm"
                          class="currency-money-field"
                          style="width:120px;"
                        />
                      </b-input-group>
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot>
                <template>
                  <tr>
                    <th colspan="5" class="text-right">
                      Total Originating Tax
                    </th>
                    <th>
                      <money
                        v-model="model.OriginatingTotalTax"
                        v-bind="moneyOptions"
                        size="sm"
                        disabled
                        class="currency-money-field "
                        style="width:120px;"
                      />
                    </th>
                  </tr>
                  <tr>
                    <th colspan="5" class="text-right">
                      Total Functional Tax
                    </th>
                    <th>
                      <money
                        v-model="model.FunctionalTotalTax"
                        v-bind="moneyOptions"
                        size="sm"
                        disabled
                        class="currency-money-field"
                        style="width:120px;"
                      />
                    </th>
                  </tr>
                </template>
              </tfoot>
              <slot name="caption" />
            </table>
          </b-col>
        </b-row>
        <!-- DETIL END -->
      </b-card-text>
    </div>
    <ScheduleModal ref="dlgSchedule" :actSelectedRow="onSelectedSchedule"></ScheduleModal>
  </b-modal>
</template>

<script>
import moment from "moment";
import { ScheduleModal } from "@/pages/modal/index.js";
export default {
  props: {
    modalId: "modal-footer-tax",
    actSelectedRow: { type: Function },
    isShow: false,
    rateTypeOptions: Array
  },
  components: {
    ScheduleModal
  },
  data() {
    return {
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
      moneypercent: {
          decimal: '',
          thousands: '',
          prefix: '',
          suffix: '',
          decimalLength: 0,
          masked: false,
          allowBlank: true,
          precision: 0,
          min: 0,
          mxn: 100,
          //max: Number.MAX_SAFE_INTEGER
        },
      dialog: false,
      resolve: null,
      reject: null,
      input: {
        IsTaxAfterDiscount: false,
        TaxScheduleId: "",
        TaxScheduleCode: "",
        TaxDesc: "",
        TaxBasedPercent: 100,
        TaxablePercent: 0,
        RoundingType: 0,
        RoundingLimit: 0,
        BaseAmount: 0,
        TaxAmount: 0
      },
      model: {
        ExchangeRate: 0,
        IsMultiply: true,
        IsProgresiveTax: false,
        OriginatingAmount: 0,
        OriginatingDiscount: 0,
        TaxDetails: [],
        OriginatingTotalTax: 0,
        FunctionalTotalTax: 0
      }
    };
  },
  watch: {
    "input.IsTaxAfterDiscount"(newVal) {
      this.calculateTaxInput();
    },
    "model.TaxDetails": {
      handler: function(after, before) {
        this.doCalculateDetails();
      },
      deep: true
    }
  },
  async mounted() {},
  methods: {
    async deleteTaxDetail(index) {
      this.model.TaxDetails.splice(index, 1); 
    },
    async addExtended() {
      if (this.input.TaxScheduleCode != "" && this.input.TaxAmount > 0) {
        let index = this.model.TaxDetails.length;

        this.model.TaxDetails.push({
          Index: index,
          TaxScheduleId: this.input.TaxScheduleId,
          TaxScheduleCode: this.input.TaxScheduleCode,
          Description: this.input.TaxDesc,
          IsTaxAfterDiscount: this.input.IsTaxAfterDiscount,
          TaxBasePercent: this.input.TaxBasedPercent,
          TaxBaseOriginatingAmount: this.input.BaseAmount,
          TaxablePercent: this.input.TaxablePercent,
          OriginatingTaxAmount: this.input.TaxAmount
        });             
      }

      this.input.TaxScheduleId = "";
      this.input.TaxScheduleCode = "";
      this.input.TaxDesc = "";
      this.input.IsTaxAfterDiscount = false;
      this.input.TaxBasePercent = 100;
      this.input.BaseAmount = 0;
      this.input.TaxablePercent = 0;
      this.input.TaxAmount = 0;

      this.calculateTaxInput();
    },
     async onRemoveSchedule(row) {        
        this.input.TaxScheduleId = "";
      this.input.TaxScheduleCode = "";
      this.input.TaxDesc = "";
      this.input.IsTaxAfterDiscount = false;
      this.input.TaxBasePercent = 100;
      this.input.BaseAmount = 0;
      this.input.TaxablePercent = 0;
      this.input.TaxAmount = 0;
        
      this.model.OriginatingTaxAmount = 0;
      },
    async onModalSheduleCode(row) {
      this.$refs.dlgSchedule
        .open(row, undefined)
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    },
    async onSelectedSchedule(row) {
      this.input.TaxScheduleId = row.TaxScheduleId;
      this.input.TaxScheduleCode = row.TaxScheduleCode;
      this.input.TaxBasedPercent = row.PercentOfSalesPurchase;
      this.input.TaxablePercent = row.TaxablePercent;
      this.input.RoundingType = row.RoundingType;
      this.input.RoundingLimit = row.RoundingLimitAmount;
      this.input.TaxDesc = row.Description;

      this.calculateTaxInput();
    },
    calculateTaxInput() {
      if (this.input.IsTaxAfterDiscount) {
        this.input.BaseAmount =
          (this.input.TaxBasedPercent / 100) *
          (this.model.OriginatingAmount - this.model.OriginatingDiscount);
      } else {
        this.input.BaseAmount =
          (this.input.TaxBasedPercent / 100) * this.model.OriginatingAmount;
      }
      this.input.TaxAmount =
        (this.input.TaxablePercent / 100) * this.input.BaseAmount;
    },
    async doCalculateDetails() {
      let orgTotal = 0,
        funcTotal = 0;
      let rate = this.model.ExchangeRate;
      let isMultiply = this.model.IsMultiply;

      if (
        Array.isArray(this.model.TaxDetails) &&
        this.model.TaxDetails.length
      ) {
        this.model.TaxDetails.forEach(function(detail) {
          if (isMultiply) {
            funcTotal += rate * detail.OriginatingTaxAmount;
          } else {
            funcTotal += detail.OriginatingTaxAmount / rate;
          }

          orgTotal += detail.OriginatingTaxAmount;
        });
      }

      this.model.OriginatingTotalTax = orgTotal;
      this.model.FunctionalTotalTax = funcTotal;
    },
    async open(
      taxDetails,
      originatingAmount,
      originatingDiscount,
      exchangeRate,
      isMultiply,
      refMoneyOptions,
      isProgresiveTax
    ) {
      this.resetModal();

      let tableDetail = [];
      if (taxDetails != undefined && Array.isArray(taxDetails)) {

        taxDetails.forEach(function(tax, index) {
          tableDetail.push({
            Index: index,
            TaxScheduleId: tax.TaxScheduleId,
            TaxScheduleCode: tax.TaxScheduleCode,
            Description: tax.Description,
            IsTaxAfterDiscount: tax.IsTaxAfterDiscount,
            TaxBasePercent: tax.TaxBasePercent,
            TaxBaseOriginatingAmount: tax.BaseAmount,
            TaxablePercent: tax.TaxablePercent,
            OriginatingTaxAmount: tax.OriginatingTaxAmount
          });      
        });
      }

      this.model.TaxDetails = tableDetail;

      this.model.OriginatingAmount = originatingAmount;
      this.model.OriginatingDiscount = originatingDiscount;
      this.model.ExchangeRate = exchangeRate;
      this.model.IsMultiply = isMultiply;

      this.model.IsProgresiveTax = false;
      if (isProgresiveTax != undefined) {
        this.model.IsProgresiveTax = isProgresiveTax;
      }

      if (refMoneyOptions != undefined) {
        this.moneyOptions = refMoneyOptions;
      }

      this.input.BaseAmount =
        (this.input.TaxBasedPercent / 100) * this.model.OriginatingAmount;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-footer-tax"].show();
      });
    },
    resetModal() {
      (this.input.IsTaxAfterDiscount = false),
        (this.input.TaxScheduleId = ""),
        (this.input.TaxScheduleCode = ""),
        (this.input.TaxBasedPercent = 100),
        (this.input.TaxablePercent = 0),
        (this.input.RoundingType = 0),
        (this.input.RoundingLimit = 0),
        (this.input.BaseAmount = 0),
        (this.input.TaxAmount = 0);
        this.input.TaxDesc = "";
    },
    handleOk(str) {
      if (this.actSelectedRow != undefined) {
        this.actSelectedRow(this.model);
      }
      this.dialog = false;
      this.resolve(str);
    },
    handleCancel(str) {
      this.dialog = false;
      this.reject("rejected");
    }
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
</style>
