<template>
  <b-modal ref="modal-detail-discount"
           size="lg"
           @ok="handleOk"
           @hide="resetModal"
           @cancel="handleCancel">
    <template v-slot:modal-title>
      Discount Extention - {{model.ChargesName}}
    </template>
    <div class="d-block text-left">
      <b-card-text>
        <b-row class="mt-2">
          <b-col sm="6">
            <label>Originating Amount</label>
            <b-input-group prepend>
              <money v-model="model.dtloriginatingAmount" v-bind="moneyOptions" size="sm" disabled class="form-control currency-money-field" style="width:100%" />
            </b-input-group>
          </b-col>
          <b-col sm="6">
            <label>Functional Discount Amount</label>
            <b-input-group prepend>
              <money v-model="model.dtlFuctDiscountAmount" v-bind="moneyOptions" size="sm" disabled class="form-control currency-money-field" :change="onDetailFuctDiscountAmount()" style="width:100%" />              
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="4">
            <label>Discount</label>
            <b-input-group>
              <template v-slot:prepend>
                <b-form-radio-group class="mt-1"
                                    v-model="model.dtlPercentOrAmount"
                                    :options="[{ item: false, name: 'Percent' },{ item: true, name: 'Amount' }]"
                                    size="sm"
                                    value-field="item"
                                    text-field="name"></b-form-radio-group>
              </template>
            </b-input-group>
          </b-col>
          <b-col sm="2">
            <label>Percentage (%)</label>
            <b-input-group prepend>
              <b-form-input type="tel" v-model="model.dtlPercentage" v-bind="moneypercent" size="sm" :disabled="model.dtlPercentOrAmount" :change="onDetailPercent()" class="form-control currency-money-field" max="100" min="0" maxLength="5" />
            </b-input-group>
          </b-col>
          <b-col sm="6">
            <label>Originating Discount Amount</label>
            <b-input-group prepend>
              <money v-model="model.dtlDiscountAmount" v-bind="moneyOptions" size="sm" :disabled="!model.dtlPercentOrAmount" :change="onDetailDiscountAmount()" class="form-control currency-money-field font-weight-bold" style="width:100%" ></money>
            </b-input-group>
          </b-col>
        </b-row>
      </b-card-text>
    </div>
  </b-modal>
</template>

<script>
  import moment from "moment";
  import { mask } from "vue-the-mask";

  export default {
    props: {
      modalId: "modal-detail-discount",
      actSelectedRow: { type: Function },
      isShow: false,
      rateTypeOptions: Array
    },
    directives: {
      mask
    },
    data() {
      return {
        RateAmount:0,
        maskFormatPercent:"###.##",
        moneyOptions: {
          decimal: ',',
          thousands: '.',
          prefix: '',
          suffix: '',
          precision: 2,
          masked: false,
          allowBlank: false,
          min: 0,
          //max: Number.MAX_SAFE_INTEGER
        },
         moneypercent: {
          decimal: '',
          thousands: '',
          prefix: '',
          suffix: '',
          precision: 2,
          masked: false,
          allowBlank: true,
          min: 0.00,
          max: 100.00,
          //max: Number.MAX_SAFE_INTEGER
        },
        dialog: false,
        resolve: null,
        reject: null,
        listRateType: this.rateTypeOptions,
        model: {
          dtlDiscountAmount: 0,
          dtlPercentOrAmount: true,
          dtlPercentage: 0,
          dtloriginatingAmount: 0,
          dtlFuctDiscountAmount: 0,
          dtlForm: "",
          ChargesName: "",
          IsMultiply: "",
        },
        display: {
          TrxDate: ""
        }
      };
    },
    filters: {
      /*formattedPercent: function(value) {
        return parseInt(value).toFixed(2);
      }*/
    },
    computed: {
      formattedPercent() {
        let value = parseFloat(this.model.dtlPercentage).toFixed(2);
        
        return value
      },
    },
    methods: {
      handleToast(toastTitle, style, message) {
        this.$bvToast.toast(message, {
          title: toastTitle != "" ? toastTitle : "Confirmation",
          variant: style != "" ? style : "info",
          //toaster: 'b-toaster-bottom-center',
          autoHideDelay: 5000,
          appendToast: false
        });
      },
      async onDetailDiscountAmount() {
        if (
        this.model.dtlDiscountAmount >
        this.model.dtloriginatingAmount
      ) {
          this.model.dtlDiscountAmount = this.model.dtloriginatingAmount;
        }

        if (this.model.dtlPercentOrAmount == true)
        this.model.dtlPercentage = ((this.model.dtlDiscountAmount / this.model.dtloriginatingAmount) * 100).toFixed(2);
               
      },
      onDetailPercent() {
        // (percentage/100) x originating amount
       if (this.model.dtlPercentOrAmount != true){
         if(this.model.dtlPercentage > 100)
          this.model.dtlPercentage = 100;

         this.model.dtlDiscountAmount = ((this.model.dtloriginatingAmount * this.model.dtlPercentage) / 100);
       }           
       
      },
      onDetailFuctDiscountAmount() {
        // discount amount / originating amount x 100
        if (this.model.IsMultiply == true)
          this.model.dtlFuctDiscountAmount = this.model.dtlDiscountAmount * this.RateAmount;
        else
          this.model.dtlFuctDiscountAmount = this.model.dtlDiscountAmount / this.RateAmount;
      },
     
      /***  END ***/
      async open(index, ChargesName, Amount, RateAmount,valueDiscount,IsMultiply,refMoneyOptions) {
        
        this.model.dtlindex = index;
        this.model.ChargesName = ChargesName;
        this.model.dtloriginatingAmount = Amount;
        this.model.dtlDiscountAmount = 0;
        this.model.dtlPercentage = 0;
        this.RateAmount = RateAmount;
        this.model.IsMultiply = IsMultiply;

        this.model.dtlDiscountAmount = valueDiscount;
        this.model.dtlPercentage = (valueDiscount/Amount) *100;      

        if(refMoneyOptions != undefined){
          this.moneyOptions = refMoneyOptions;
        }

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-detail-discount"].show();
        });
      },
      resetModal() {
        this.model.CurrencyCode = "";
        this.model.TrxDate = moment().format("YYYY-MM-DD");
        this.model.RateType = 0;
        this.model.ExchangeRateAmount = 0;
      },
      validateForm() {
        let valid = true;

        if (
        this.model.dtlDiscountAmount >
        this.model.dtloriginatingAmount
      ) {
          valid = false;
        }

        if (!valid)
          this.handleToast(
            "Warning",
            "danger",
            "Originating Amount in Detail data  must not 0 (zero) !"
          );

        return valid;
      },
      handleOk(str) {
        if(this.validateForm()){
          if (this.actSelectedRow != undefined) {
            this.actSelectedRow(this.model, this.model.dtlindex);
          }
          this.dialog = false;
          this.resolve(str);
        }
      },
      handleCancel(str) {
        this.dialog = false;
        this.reject("rejected");
      }
    }
  };
</script>
