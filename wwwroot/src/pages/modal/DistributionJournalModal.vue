<template>
  <b-modal ref="modal-dist-journal" size="xl" hide-footer @hide="resetModal">
    <template v-slot:modal-title>
      <span class="font-weight-bold">{{model.DocumentNo}}&nbsp;(in {{ model.CurrencyCode}})</span>&nbsp;
      <small>
        Distribution Journal
      </small>
    </template>
    <div class="d-block">
      <b-row>
        <b-col sm="12" class="table-responsive">
          <table
            id="table-detail"
            width="100%"
            class="table-light table-striped table-hover table-bordered"
          >
            <thead>
              <tr>
                <th class="text-left">ACCOUNT NO</th>
                <th class="text-center" width="220">ORIGINATING DEBIT</th>
                <th class="text-center" width="220">ORIGINATING CREDIT</th>
              </tr>
              <tr >
                <th class="text-left">DESCRIPTION</th>
                <th class="text-center">FUNCTIONAL DEBIT</th>
                <th class="text-center">FUNCTIONAL CREDIT</th>
              </tr>
            </thead>
            <tbody class="position-relative">
              <template v-for="(item, itemIndex) in model.JournalDetails">
                <tr>
                  <td>
                    <span v-if="item.Status == 55" >{{item.AccountId}}&nbsp;<code style="float:right;margin-right:20px;"><i>VOID</i></code></span>     
                    <span v-else>{{item.AccountId}}</span>                                                  
                  </td>
                  <td class="text-center">
                    <money
                      v-model="item.OriginatingDebit"
                      v-bind="moneyOptions"
                      size="sm"
                      disabled
                      class="currency-money-field"
                    ></money>
                  </td>
                  <td class="text-center">
                    <money
                      v-model="item.OriginatingCredit"
                      v-bind="moneyOptions"
                      size="sm"
                      disabled
                      class="currency-money-field"
                    ></money>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:0px;">
                    <span v-if="item.Status == 55">{{item.AccountDesc}}&nbsp;<code style="float:right;margin-right:20px;"><i>VOID</i></code></span> 
                    <span v-else>{{item.AccountDesc}}</span>                                       
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
                <th class="text-right">ORIGINATING TOTAL</th>
                <th class="text-center">
                  <money
                    v-model="model.OriginatingDebit"
                    v-bind="moneyOptions"
                    size="sm"
                    class="currency-money-field font-weight-bold"
                    disabled
                  ></money>
                </th>
                <th class="text-center">
                  <money
                    v-model="model.OriginatingCredit"
                    v-bind="moneyOptions"
                    size="sm"
                    class="currency-money-field font-weight-bold"
                    disabled
                  ></money>
                </th>
              </tr>
              <tr>
                <th class="text-right">FUNCTIONAL TOTAL</th>
                <th class="text-center">
                  <money
                    v-model="model.FunctionalDebit"
                    v-bind="moneyOptions"
                    size="sm"
                    class="currency-money-field font-weight-bold"
                    disabled
                  ></money>
                </th>
                <th class="text-center">
                  <money
                    v-model="model.FunctionalCredit"
                    v-bind="moneyOptions"
                    size="sm"
                    class="currency-money-field font-weight-bold"
                    disabled
                  ></money>
                </th>
              </tr>
            </tfoot>
          </table>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import moment from "moment";

export default {
  props: {
    modalId: "modal-dist-journal",
    isShow: false
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
        //max: Number.MAX_SAFE_INTEGER
      },
      dialog: false,
      resolve: null,
      reject: null,
      model: {
        DocumentNo: "",
        DocumentDate: "",
        CurrencyCode:"",
        DecimalPoint:2,
        JournalDetails : Array,
        OriginatingDebit:0,
        OriginatingCredit:0,
        FunctionalCredit:0,
        FunctionalDebit:0,
      },
      isCrossCurrency:true
    };
  },
  async mounted() {
    await this.$store.dispatch(
      "features/company/financial_setup/actGet",
      "FinancialSetup?"
    );
  },
  methods: {
    async getDocument() {
      let docNo = this.model.DocumentNo;
      var header = await this.$store.dispatch(
        "features/finance/distribution_journal/journal/actGetData",
        docNo
      );

      let arrDetails = [];
      if (header.length) {
        header = header[0];

        this.model.DocumentDate = moment(header.DocumentDate).format('DD/MM/YYYY')
        this.model.CurrencyCode = header.CurrencyCode

        var financialSetup = this.$store.state.features.company.financial_setup
        .data;

        if (Array.isArray(financialSetup) && financialSetup.length) {
          financialSetup = financialSetup[0];

          this.isCrossCurrency = (financialSetup.FuncCurrencyCode == this.model.CurrencyCode ? false : true);
        }
        
        this.moneyOptions.precision = header.DecimalPoint

        this.model.JournalDetails = header.DistributionDetails
        
        let orgDebit = 0, orgCredit = 0, funcDebit =0, funcCredit = 0
        this.model.JournalDetails.forEach(function(row, index) {
          orgDebit += row.OriginatingDebit
          orgCredit += row.OriginatingCredit
          funcDebit += row.FunctionalDebit
          funcCredit += row.FunctionalCredit
        });

        this.model.OriginatingDebit = orgDebit
        this.model.OriginatingCredit = orgCredit
        this.model.FunctionalDebit = funcDebit
        this.model.FunctionalCredit = funcCredit

      }
    },
    async open(docNo) {
      this.model.DocumentNo = docNo;

      await this.getDocument();

      if(this.model.FunctionalDebit > 0){
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-dist-journal"].show();
        });
      }      
    },
    resetModal() {
      this.model.CurrencyCode = ""
      this.model.DocumentDate = ""
      this.model.DecimalPoint = 2
      this.model.CurrencyCode = ""
      this.model.JournalDetails = []

      this.model.OriginatingDebit = 0
      this.model.OriginatingCredit = 0
      this.model.FunctionalCredit = 0
      this.model.FunctionalDebit = 0
    },
    handleOk(str) {
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

@media only screen and (max-width: 1024px) {
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
    padding: 2px;
    background-color: white;
  }

  #table-detail tfoot th {
    font-size: 10px;
    border: 1px solid #cfd8dc;
    padding: 2px;
    background-color: #f5f5f5;
  }
  .v-money {
    width: 160px;
  }
  #table-detail input:disabled {
    background-color: #e8eaf6;
    cursor: text;
    margin: 0em;
    border: 1px solid #c2cfd6;
  }

}
</style>