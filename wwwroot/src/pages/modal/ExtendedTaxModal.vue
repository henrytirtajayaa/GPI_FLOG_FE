<template>
  <b-modal ref="modal-tax" size="xl" @ok="handleOk" @hide="resetModal" @cancel="handleCancel">
    <template v-slot:modal-title>
      Amount Extention
    </template>
    <div class="d-block text-left " size="xl">
      <b-card-text>
        <b-form-input v-model="model.TaxCharges" v-show="false" />
        <b-row>
          <b-col sm="7" class="mt-1 text-right">
                       
          </b-col>          
          <b-col sm="2" class="text-center">
            <label class="text-primary"><small>ORIGINATING</small></label>
          </b-col>
          <b-col sm="2" class="text-center">
            <label class="text-primary"><small>FUNCTIONAL</small></label>
          </b-col>
        </b-row>  
        <b-row>
          <b-col sm="2" class="mt-1 text-right">
            <label>Currency &amp; Rate</label>
          </b-col>  
          <b-col sm="2">
            <b-input-group >
              <b-input-group-prepend>
                <b-button variant="dark" size="sm" class="font-weight-bold" >
                  {{Currency}}
                </b-button>
              </b-input-group-prepend>
              <money v-model="RateAmount" v-bind="moneyOptions" size="sm" disabled class="form-control currency-money-field"></money>              
            </b-input-group>
          </b-col>
          <b-col sm="3" class="mt-1 text-right">
            <label>Amount</label>
          </b-col>          
          <b-col sm="2" class="text-center">
            <money v-model="model.OrgAmount" v-bind="moneyOptions" size="sm" class="form-control currency-money-field"></money>
          </b-col>
          <b-col sm="2" class="text-center">
            <money v-model="model.FuncOrgAmount" v-bind="moneyOptions" size="sm" :value="CalculateFuncOrgAmount" disabled class="form-control currency-money-field"></money>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="2" class="text-right">
            <label>Discount </label>
          </b-col>
          <b-col sm="3">
            <b-input-group append="%" size="sm">
              <b-form-radio-group v-model="model.DiscountByAmount" class="mt-1"
                                :options="[{ item: true, name: 'Amount' },{ item: false, name: 'Percent' }]"
                                size="sm"
                                value-field="item"
                                text-field="name"></b-form-radio-group>
              
              <b-form-input type="tel" v-model="model.DiscountPercentage" v-bind="moneypercent" size="sm" :disabled="model.DiscountByAmount" class="form-control currency-money-field" max="100" min="0" maxLength="5" :change="onChangeDiscountPercentage()"/>
            </b-input-group>
          </b-col>
          <b-col sm="2"></b-col>
          <b-col sm="2" >
            <money v-model="model.OrgDiscAmount" v-bind="moneyOptions" size="sm"  class="form-control currency-money-field" :disabled="!model.DiscountByAmount" :change="onChangeDiscountAmount()"></money>
          </b-col>
          <b-col sm="2" >
            <money v-model="model.FuncDiscAmount" v-bind="moneyOptionsFunctional" size="sm" :value="CalculateFuncDiscAmount" disabled class="form-control currency-money-field" readonly></money>
          </b-col>
        </b-row>        
        <b-row class="mt-2">
          <b-col sm="2" class="text-right">
            <label>Tax </label>
          </b-col>
          <b-col sm="4">
            <b-form-radio-group v-model="model.IsTaxAfterDiscount"
                                :options="[{ item: false, name: 'Before Discount' },{ item: true, name: 'After Discount' }]"
                                size="sm"
                                :change="countBaseAmount(model.OrgAmount)"
                                value-field="item"
                                text-field="name"></b-form-radio-group>
          </b-col>
          <b-col sm="1" class="text-center"></b-col>
          <b-col sm="2">
            <money v-model="model.OrgValueAfterBeforeDiscount"
                   v-bind="moneyOptions"                   
                   size="sm"
                   disabled
                   class="form-control currency-money-field"></money>
          </b-col>
          <b-col sm="2">
            <money v-model="model.FuncValueAfterBeforeDiscount"
                   v-bind="moneyOptionsFunctional"
                   :value="CalculateFuncValueAfterBeforeDiscount"
                   size="sm"
                   disabled
                   class="form-control currency-money-field"></money>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="2" class="text-right">Tax Schedule</b-col>
          <b-col sm="3">         
            <b-input-group prepend>
              <b-form-input v-model="model.TaxScheduleCode"
                            class="font-weight-bold"
                            readonly
                            size="sm" style="width:20%"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-secondary" size="sm" @click.prevent="onModalSheduleCode">
                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                </b-button>
                <b-button variant="outline-danger"
                          size="sm"
                          @click="onRemoveSchedule">
                  <font-awesome-icon :icon="['fas', 'trash']"></font-awesome-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>          
        </b-row>
        <b-row class="mt-2">
          <b-col sm="3" class="text-right mt-1"><code>% of Tax Based Amount</code></b-col>
          <b-col sm="2">
            <b-input-group append="%" size="sm">
              <money v-model="model.PercentageTaxBasedAmount"
                     v-bind="moneyOptions"
                     size="sm"
                     disabled
                     class="form-control currency-money-field"></money>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-2 ">
          <b-col sm="3" class="text-right mt-1"><code>Taxable Percentage</code></b-col>
          <b-col sm="2">            
            <b-input-group append="%" size="sm">
              <money v-model="model.TaxablePercent"
                     v-bind="moneyOptions"
                     size="sm"
                     disabled
                     class="form-control currency-money-field"></money>
            </b-input-group>
          </b-col>
          <b-col sm="2"></b-col>
          <b-col sm="2">
            <b-input-group prepend>
              <money v-model="model.OriginatingTaxAmount"
                     v-bind="moneyOptions"
                     size="sm"
                     disabled
                     class="form-control currency-money-field "></money>
            </b-input-group>
          </b-col>
          <b-col sm="2">
            <b-input-group prepend>
              <money v-model="model.FunctionalTaxAmount"
                     :value="CalFuncOriginatingTaxAmount"
                     v-bind="moneyOptionsFunctional"
                     size="sm"
                     disabled
                     class="form-control currency-money-field "></money>
            </b-input-group>
          </b-col>
        </b-row>
        <hr>
        <b-row class="mt-2">
          <b-col sm="7" class="text-right mt-1 "> <label class="font-weight-bold text-uppercase">TOTAL EXTENDED AMOUNT</label></b-col>
          <b-col sm="2">
            <b-input-group prepend>
              <money v-model="model.OriginatingExtendedAmount"
                     v-bind="moneyOptions"
                     size="sm"
                     disabled
                     class="form-control currency-money-field"></money>
            </b-input-group>
          </b-col>
          <b-col sm="2">
            <b-input-group prepend>
              <money v-model="model.FunctionalExtendedAmount"
                     v-bind="moneyOptionsFunctional"
                     size="sm"
                     disabled
                     class="form-control currency-money-field font-weight-bold"></money>
            </b-input-group>
          </b-col>
        </b-row>
      </b-card-text>
    </div>
    <ScheduleModal ref="dlgSchedule" :actSelectedRow="onSelectedSchedule" v-show="ispopup"></ScheduleModal>
  </b-modal>

</template>

<script>
  import moment from "moment";
  import { ScheduleModal } from "@/pages/modal/index.js";
  export default {

    props: {
      modalId: "modal-tax",
      actSelectedRow: { type: Function },
      isShow: false,
      rateTypeOptions: Array
    },
    components: {
      ScheduleModal
    },
    data() {
      return {
        Currency: "",
        RateAmount: 0,
        ispopup: false,
        dataExtended: [],
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
        moneyOptionsFunctional: {
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
        listRateType: this.rateTypeOptions,
        model: {
          OrgAmount: 0,
          IsMultiply: true,
          DiscountByAmount: true,
          DiscountPercentage : 0,
          OrgDiscAmount: 0,
          FuncDiscAmount: 0,
          IsTaxAfterDiscount: true,
          OrgValueAfterBeforeDiscount: 0,
          FuncValueAfterBeforeDiscount: 0,
          TaxScheduleCode: "",
          Description: "",
          PercentageTaxBasedAmount: 0,
          TaxablePercent: 0,
          OriginatingTaxAmount: 0,
          FunctionalTaxAmount:0,
          OriginatingExtendedAmount: 0,
          FunctionalExtendedAmount: 0,
          TotalTaxAmount: 0,
          ReffObj : [],
        },
        display: {
          TrxDate: ""
        }
      };
    },
    watch: {
      "model.OrgValueAfterBeforeDiscount"(newVal) {
        this.calculateOriginatingTaxAmount();
        this.calculateOriginatingExtendedAmount();
      },
      "model.OriginatingTaxAmount"(newVal) {
        this.calculateOriginatingExtendedAmount();
      },
    },
    async mounted() {

    },
    computed: {
      CounterTotalTaxExt: function () {
        var total = 0;
        for (var i = 0; i < this.dataExtended.length; i++) {
          total += this.dataExtended[i]['OriginatingTaxAmount'];
        }

        return this.model.TotalTaxAmount = total;

      },
      CalculateFuncOrgAmount: function () {
        var total = 0;
        if (this.model.IsMultiply)
          total = this.model.OrgAmount * this.RateAmount;
        else
          total = this.model.OrgAmount / this.RateAmount;

        return this.model.FuncOrgAmount = total;

      },
       CalculatePercent() {
        // (percentage/100) x originating amount
            this.model.OrgDiscAmount = (this.model.OrgAmount * this.model.Percent) / (100);
     
      },
      CalculateFuncDiscAmount: function () {
        var total = 0;
        if (this.model.IsMultiply)
          total = this.model.OrgDiscAmount * this.RateAmount;
        else
          total = this.model.OrgDiscAmount / this.RateAmount;

        return this.model.FuncDiscAmount = total;

      },
      CalculateDiscAmount: function () {
        var total = 0;
        if (this.model.IsMultiply)
          total = this.model.OrgDiscAmount * this.RateAmount;
        else
          total = this.model.OrgDiscAmount / this.RateAmount;

        return this.model.FuncDiscAmount = total;

      },
      CalculateOrgValueAfterBeforeDiscount: function () {
        var total = 0;
        if (this.model.IsTaxAfterDiscount)
          total = this.model.OrgAmount - this.model.OrgDiscAmount;
        else
          total = this.model.OrgAmount;

        return total;

      },
      CalculateFuncValueAfterBeforeDiscount: function () {
        var total = 0;
          if (this.model.IsMultiply)
          total = this.model.OrgValueAfterBeforeDiscount * this.RateAmount;
        else
          total = this.model.OrgValueAfterBeforeDiscount / this.RateAmount;

        return total;

      },
      CalFuncOriginatingTaxAmount: function () {
        var total = 0;

        if (this.model.IsMultiply)
          total = this.model.OriginatingTaxAmount * this.RateAmount;
        else
          total = this.model.OriginatingTaxAmount / this.RateAmount;

        return this.model.FunctionalTaxAmount = total;

      }
    },

    methods: {
      calculateOriginatingTaxAmount() {
        var total = 0;
        var orgTax = 0;

        orgTax = ((this.model.PercentageTaxBasedAmount / 100) * this.model.OrgValueAfterBeforeDiscount) * ( this.model.TaxablePercent / 100);
        
        this.model.OriginatingTaxAmount =  orgTax;
        
        if (this.model.IsMultiply){
          this.model.FunctionalTaxAmount = this.model.OriginatingTaxAmount * this.RateAmount;
          
        }else{
          this.model.FunctionalTaxAmount = this.model.OriginatingTaxAmount / this.RateAmount;
        }        
      },
      calculateOriginatingExtendedAmount() {
        this.model.OriginatingExtendedAmount = (this.model.OrgValueAfterBeforeDiscount + this.model.OriginatingTaxAmount);

        if (this.model.IsMultiply){
          this.model.FunctionalExtendedAmount = this.model.OriginatingExtendedAmount  * this.RateAmount;
        }else{
          this.model.FunctionalExtendedAmount = this.model.OriginatingExtendedAmount  / this.RateAmount;
        }
        
      },
      onChangeDiscountPercentage() {
       if (this.model.DiscountByAmount != true && this.model.DiscountPercentage >= 0){
         if(this.model.DiscountPercentage > 100){
          this.model.DiscountPercentage = 100;
         }

         this.model.OrgDiscAmount = (this.model.DiscountPercentage / 100) * this.model.OrgAmount;
       }    
      },
      onChangeDiscountAmount() {
        if (this.model.DiscountByAmount && this.model.OrgDiscAmount >= 0){
         if(this.model.OrgDiscAmount > this.model.OrgAmount){
            this.model.OrgDiscAmount = this.model.OrgAmount;
         }        

         this.model.DiscountPercentage = ((this.model.OrgDiscAmount / this.model.OrgAmount) * 100).toFixed(2);
       }    
      },
      async onModalSheduleCode(row) {
        this.ispopup = true;
        this.$refs.dlgSchedule
          .open(row, this.model[row])
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
      },
       async onRemoveSchedule(row) {        
        this.model.TaxScheduleId = "";
        this.model.TaxScheduleCode = "";
        this.model.PercentageTaxBased = 100;
        this.model.TaxablePercent = 0;
        this.model.Description = "";
        
        this.model.OriginatingTaxAmount = 0;
      },
      async onSelectedSchedule(row) {
        //this.model.TaxBasedAmount = row.TaxBasedAmount;
        this.model.TaxScheduleCode = row.TaxScheduleCode;
        this.model.PercentageTaxBasedAmount = row.PercentOfSalesPurchase;
        this.model.TaxablePercent = row.TaxablePercent;
        this.model.Description = row.Description;
        this.model.TaxScheduleId = row.TaxScheduleId;

        // ((% of based tax amount)/100 x (before discount/after discount)) x (taxable percent/100)
        this.model.OriginatingTaxAmount = ((row.PercentOfSalesPurchase) / 100 * (this.model.OrgValueAfterBeforeDiscount)) * (row.TaxablePercent / 100);
      },
      async countBaseAmount(value) {
        
        var total = 0;
        if (this.model.IsTaxAfterDiscount){
          total = this.model.OrgAmount - this.model.OrgDiscAmount;
        }          
        else{
          total = this.model.OrgAmount;
        }

        this.model.OrgValueAfterBeforeDiscount = total;

        let functionalValue = 0;
        if (this.model.IsMultiply)
          functionalValue = this.model.OrgValueAfterBeforeDiscount * this.RateAmount;
        else
          functionalValue = this.model.OrgValueAfterBeforeDiscount / this.RateAmount;

        this.model.FuncValueAfterBeforeDiscount = functionalValue;          
      },

      async open(Currency, OrgAmount, IsMultiply, RateAmount, ScheduleId, ScheduleCode, ScheduleDesc, TaxablePercentTax, PercentDiscount,IsTaxAfterDiscount, originatingDiscount, discountByAmount, refMoneyOptions, reffObj) {
        this.Currency = Currency;
        this.model.OrgAmount = OrgAmount;
        this.model.IsMultiply = IsMultiply;
        this.RateAmount = RateAmount;
        this.model.TaxScheduleId = ScheduleId;
        this.model.TaxScheduleCode = ScheduleCode;
        this.model.PercentageTaxBasedAmount = PercentDiscount;
        this.model.TaxablePercent = TaxablePercentTax;
        this.model.IsTaxAfterDiscount = IsTaxAfterDiscount;
        this.model.OrgDiscAmount = originatingDiscount;
        this.model.DiscountByAmount = discountByAmount;
        this.model.DiscountPercentage = 0;
        this.model.OriginatingExtendedAmount = 0;

        this.model.ReffObj = reffObj;
        
        this.model.DiscountPercentage = ((this.model.OrgDiscAmount / this.model.OrgAmount) * 100).toFixed(2);
          await this.countBaseAmount();      
          await this.calculateOriginatingExtendedAmount();

        if(refMoneyOptions != undefined){
          this.moneyOptions = refMoneyOptions;
        }

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
          this.dialog = true;

          this.$refs["modal-tax"].show();
        });
      },
      resetModal() {
         this.model.OrgAmount = 0;
        this.model.IsMultiply = false;
        this.RateAmount = 0;
        this.model.TaxScheduleId = "";
        this.model.TaxScheduleCode = 0;
        this.model.PercentageTaxBasedAmount = 0;
        this.model.TaxablePercent = 0;
        this.model.OrgValueAfterBeforeDiscount = 0;
        this.model.OriginatingTaxAmount = 0;
      },
      handleOk(str) {
        if (this.actSelectedRow != undefined) {
          this.actSelectedRow(this.model, this.dataExtended);
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

  #table-detail input:disabled {
    background-color: #e8eaf6;
    cursor: text;
    margin: 0em;
    border: 1px solid #c2cfd6;
  }
</style>
