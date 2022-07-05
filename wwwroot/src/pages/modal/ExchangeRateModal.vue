<template >
  <b-modal
    ref="modal-exchange-rate"
    size="md"
    @ok="handleOk"
    @hide="resetModal"
    @cancel="handleCancel"
  >
    <template v-slot:modal-title><span>Exchange Rate</span>&nbsp;<span style="color:blue;">{{model.CurrencyCode}}</span> date of <span style="color:blue;">{{display.TrxDate}}</span></template>
    <div class="d-block">
      <b-row>
        <b-col sm="5">
          <b-form-group>
            <label for="RateType"><small>Rate Type</small></label>
            <b-form-select
              v-model="model.RateType"
              :plain="true"
              size="sm"
              :options="listRateType"
              value-field="RateType"
              text-field="Caption"
              @change="getCurrentRate"
            />
          </b-form-group>
        </b-col>
         <b-col sm="3">
           <label for="CalcMethod"><small>Calculation</small></label>
           <span class="text-center font-weight-bold" style="vertical-align:middle;"><small>{{model.CalcIsMultiply ? "MULTIPLY *" : "DIVISION /"}}</small></span>
         </b-col>
        <b-col sm="4">
          <b-form-group>
            <label for="RateAmount"><small>Rate Amount</small></label>
            <money v-model="model.ExchangeRateAmount" v-bind="moneyOptions" style="width:100px;"
                                size="sm" 
                                class="currency-money-field" 
                                ></money>            
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import moment from "moment";

export default {
  props: {
    modalId: "modal-exchange-rate",
    actSelectedRow: { type: Function },
    isShow: false,
    rateTypeOptions: Array
  },
  data() {
    return {
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
      dialog: false,
      resolve: null,
      reject: null,
      listRateType: this.rateTypeOptions,
      model: {
        CurrencyCode: "",
        TrxDate: moment().format("YYYY-MM-DD"),
        RateType: 0,
        ExchangeRateAmount: 1,
        CalcIsMultiply : true,
        ReffIndex : 0,
        ReffObj : []
      },
      display:{
        TrxDate : ""  
      }
    };
  },
  async mounted() {
    if (!Array.isArray(this.listRateType)) {
      this.listRateType = await this.$store.dispatch(
        "features/finance/constants/actGetRateType"
      );
    }
  },
  methods: {
    async getCurrentRate() {
      if (this.model.CurrencyCode != "" && this.model.RateType > 0) {
        await this.$store.dispatch(
          "features/company/exchange_rate_header/actGetCurrentExchangeRate",
          "GetCurrentExchangeRate?CurrencyCode=" +
            this.model.CurrencyCode +
            "&TransactionDate=" +
            this.model.TrxDate +
            "&RateType=" +
            this.model.RateType
        );
        this.model.ExchangeRateAmount = this.$store.state.features.company.exchange_rate_header.dataExcRate;
        this.model.CalcIsMultiply = this.$store.state.features.company.exchange_rate_header.dataExcIsMultiply;
      }
    },
    async open(currencyCode, dateYMD, rateType, refMoneyOptions, formRate, reffIndex, reffObj) {
      
      this.model.CalcIsMultiply = true;
      this.model.CurrencyCode = currencyCode;
      this.model.TrxDate = dateYMD; //MUST BE IN YYYY-MM-DD format
      this.model.RateType = rateType;
      this.model.ExchangeRateAmount = 1;
      this.model.ReffIndex = reffIndex;
      this.model.ReffObj = reffObj;
            
      this.display.TrxDate = moment(this.model.TrxDate).format('DD-MM-YYYY');
      
      if(refMoneyOptions != undefined)
        this.moneyOptions = refMoneyOptions
      
      if(formRate != undefined){
        if(formRate > 0){
          this.model.ExchangeRateAmount = formRate
        }else{
          this.getCurrentRate()
        }
      }else{
        this.getCurrentRate()
      }      

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-exchange-rate"].show();
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
