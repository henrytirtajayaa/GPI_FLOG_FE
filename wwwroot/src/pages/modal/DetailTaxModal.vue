<template>
  <b-modal ref="modal-detail-tax"
           size="lg"
           @ok="handleOk"
           @hide="resetModal"
           @cancel="handleCancel">


    <template v-slot:modal-title>
      Tax  Detail - {{model.ChargesName}}
    </template>
    <div class="d-block text-left " size="xl">
      <b-card-text>
       
        <b-form-input v-model="model.TaxCharges" v-show="false" />

        <b-row class="mt-2">

          <b-col sm="7" lg="5">
            <money v-model="model.DefaultAmount" v-bind="moneyOptions" size="sm" disabled class="form-control currency-money-field" v-show="false"></money>
            <label>Base Originating Amount</label>
            <b-input-group>
              <template v-slot:prepend>
                <b-form-radio-group class="mt-1"
                                    v-model="model.IsAfterDiscount"
                                    :options="[{ item: false, name: 'Before Discount' },{ item: true, name: 'After Discount' }]"
                                    size="sm"
                                    value-field="item"
                                    @change="countBaseAmount(model.DefaultAmount)"
                                    text-field="name"></b-form-radio-group>
              </template>
            </b-input-group>
          </b-col>

          <b-col sm="4">
            <label>Based Amount</label>
            <b-input-group prepend>
              <money v-model="model.BasedAmount" v-bind="moneyOptions" size="sm" disabled class="currency-money-field"></money>
              <b-input-group-append>

              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mt-2">
          <b-col sm="6" lg="3">
            <label>Schedule Code</label>
            <b-input-group prepend>
              <b-form-input v-model="model.TaxScheduleCode"
                            class="font-weight-bold"
                            readonly
                            size="sm"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-primary"
                          size="sm"
                          @click.prevent="onModalSheduleCode('ScheduleCode')">
                  <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                </b-button>    
                <b-button variant="outline-danger"
                          size="sm"
                          @click="onRemoveSchedule"
                          >
                  <font-awesome-icon :icon="['fas', 'trash']"></font-awesome-icon>
                </b-button>            
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col sm="6" lg="3">
            <label>% of Tax Based Amount</label>
            <b-input-group prepend>
              <money v-model="model.PercentageTaxBased" v-bind="moneyOptions" size="sm" disabled class="currency-money-field"></money>
            </b-input-group>
          </b-col>
          <b-col sm="6" lg="3">
            <label>Taxable Percent</label>
            <b-input-group prepend>
              <money v-model="model.TaxablePercentTax" v-bind="moneyOptions" size="sm" disabled class="currency-money-field"></money>
            </b-input-group>
          </b-col>
          <b-col sm="6" lg="3">
            <label>Originating Tax Amount</label>
            <b-input-group prepend>
              <money v-model="model.OriginatingTaxAmount" v-bind="moneyOptions" size="sm" disabled class="currency-money-field"></money>
            </b-input-group>
          </b-col>
        </b-row>
        <hr />
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
      modalId: "modal-detail-tax",
      actSelectedRow: { type: Function },
      isShow: false,
      rateTypeOptions: Array
    },
     components: {
      ScheduleModal
    },
    data() {
      return {
        RateAmount:0,
        moneyOptions: {
          decimal: ",",
          thousands: ".",
          prefix: "",
          suffix: "",
          precision: 0,
          masked: false,
          allowBlank: false,
          min: 0
        },
        dialog: false,
        resolve: null,
        reject: null,
        listRateType: this.rateTypeOptions,
        model: {       
          TaxScheduleId: "",
          TaxScheduleCode: "",  
          IsAfterDiscount: false,
          DefaultAmount: 0,
          BasedAmount: 0,
          DiscountAmount: 0,          
          PercentageTaxBased: 0,
          AmountToBeTax: 0,
          TaxablePercentTax: 0,
          OriginatingTaxAmount: 0,
          TaxCharges: 0,
          ChargesName: "",
          dtlindex: 0,
        },
        display: {
          TrxDate: ""
        }
      };
    },
    watch: {
      "model.BasedAmount"(newVal) {
          this.calculateTax();
      },
    },
    methods: {
       async onModalSheduleCode(row) {
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
        this.model.TaxablePercentTax = 0;
        this.model.Description = "";
        
        this.model.OriginatingTaxAmount = 0;
      },
      async onSelectedSchedule(row) {        
        this.model.TaxScheduleId = row.TaxScheduleId;
        this.model.TaxScheduleCode = row.TaxScheduleCode;
        this.model.PercentageTaxBased = row.PercentOfSalesPurchase;
        this.model.TaxablePercentTax = row.TaxablePercent;
        this.model.Description = row.Description;
        
        this.calculateTax();
      },
      calculateTax(){
        this.model.OriginatingTaxAmount = ((this.model.PercentageTaxBased) / 100 * (this.model.BasedAmount)) * (this.model.TaxablePercentTax / 100);
      },
      countBaseAmount(value) {      
         this.model.DefaultAmount = value;
        if (this.model.IsAfterDiscount == true)
          this.model.BasedAmount = this.model.DefaultAmount;
        else
          this.model.BasedAmount = (this.model.DefaultAmount - this.model.DiscountAmount);
      },
      
      async open(index, ChargesName,Amount, RateAmount, Discount, refMoneyOptions, refTaxScheduleCode, isAfterDiscount) {
        this.model.dtlindex = index;
        this.model.ChargesName = ChargesName;
        this.model.IsAfterDiscount = isAfterDiscount != undefined ? isAfterDiscount : false;
        this.model.DefaultAmount = Amount;
        this.RateAmount = RateAmount;
        this.model.DiscountAmount = Discount;
        console.log("refTaxScheduleCode=" + ChargesName);

        this.model.BasedAmount = this.model.IsAfterDiscount ?  (Amount-Discount) : Amount;

        if(refMoneyOptions != undefined){
          this.moneyOptions = refMoneyOptions;
        }
        
        this.model.TaxScheduleId = "";
        this.model.TaxScheduleCode = "";
        this.model.PercentageTaxBased = 100;
        this.model.TaxablePercentTax = 0;
        this.model.Description = "";
        
        this.model.OriginatingTaxAmount = 0;

        if(refTaxScheduleCode != undefined && refTaxScheduleCode != ''){
          await this.$store.dispatch(
            "features/company/tax_schedule/actGetTaxSchedule",
            "taxSchedule?TaxScheduleCode=" + refTaxScheduleCode
          );

          let taxes = this.$store.state.features.company.tax_schedule.data;
          if(taxes!=undefined && taxes.length){
            let row = taxes[0];

            this.model.TaxScheduleId = row.TaxScheduleId;
            this.model.TaxScheduleCode = row.TaxScheduleCode;
            this.model.PercentageTaxBased = row.PercentOfSalesPurchase;
            this.model.TaxablePercentTax = row.TaxablePercent;
            this.model.Description = row.Description;
            
            this.model.OriginatingTaxAmount = ((row.PercentOfSalesPurchase) / 100 * (this.model.BasedAmount)) * (row.TaxablePercent / 100);
          }
        }

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

        this.dialog = true;

        this.$refs["modal-detail-tax"].show();
        });
      },
      resetModal() {
        this.model.CurrencyCode = "";
        this.model.TrxDate = moment().format("YYYY-MM-DD");
        this.model.RateType = 0;
        this.model.ExchangeRateAmount = 0;
      },
      handleOk(str) {
        if (this.actSelectedRow != undefined) {
          this.actSelectedRow(this.model,this.model.dtlindex);
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
