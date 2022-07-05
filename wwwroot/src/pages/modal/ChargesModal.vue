<template>
  <b-modal ref="modal-charges" hide-footer size="xl">
    <b-alert show size="sm" variant="info" ><strong class="text-purple">please select a CHARGE</strong></b-alert>
    <div class="d-block text-center">
      <SelectGrid ref="gridCharges"
                  :fields="headersMain"
                  :items="this.$store.state.features.company.charges.data"
                  :info="this.$store.state.features.company.charges.listInfo"
                  :baseUrl="this.$store.state.features.company.charges.baseUrl"
                  :actGetData="handleGetData"
                  :selectedItem="selectedValue"
                  selectedFieldName="ChargesCode"
                  :actSelectRow="handleSelect"
                  addTableClasses="table-bordered"
                  responsive
                  loading
                  hover
                  sorter
                  pagination
                  column-filter
                  :itemsPerPage="perPage"></SelectGrid>
    </div>
  </b-modal>
</template>

<script>
  import SelectGrid from "@/components/tables/SelectGrid";

  export default {
    props: {
      modalId: "modal-charges",
      baseUrl: "",
      headers: "",
      items: "",
      info: "",
      reffField: "ChargesCode",
      actSelectedRow: { type: Function },
      isSelect: { type: Boolean, default: false },
      isShow: false
    },
    components: {
      SelectGrid
    },
    data: () => ({
      dialog: false,
      resolve: null,
      reject: null,
      reffModelField: "",
      selectedValue: "",
      perPage: 20,
      QueryTransactionType : '',
      QueryModule : '',
      reffModel : [],
      headersMain: [
        {
          label: "Charges Code",
          key: "ChargesCode",
          width: 150,
          _classes: "text-left pl-1"
        },
        {
          label: "Charges Name",
          key: "ChargesName",
          _classes: "text-left pl-1"
        },
        {
          label: "Trx Type",
          key: "TransactionType",
          _classes: "text-left pl-1",
          width: 250,
          filter:false
        },
        {
          label: "Tax",
          key: "TaxScheduleCode",
          _classes: "text-center ",
          width: 100,
        },
        {
          label: "Cost",
          key: "HasCostingCaption",
          _classes: "text-center",
          width: 80,
          filter:false
        },
      ],      
    }),

    methods: {
      async handleGetData(url) {
        if (url == undefined) {
          url = this.$store.state.features.company.charges.baseUrl;
        }

        if (url.toLowerCase().lastIndexOf("transactiontype") < 0) {
          url =
            url + this.QueryTransactionType + this.QueryModule + "&Inactive=false";
        } else {
          var clean_uri = url
            .toLowerCase()
            .substring(0, url.indexOf("&transactiontype"));
          url =
            clean_uri +
            this.QueryTransactionType + this.QueryModule + "&Inactive=false";
        }

        if (url.toLowerCase().lastIndexOf("charges") < 0) {
          url = "charges?" + url;
        }

        await this.$store.dispatch("features/company/charges/actGetCharges", url);
      },
      async open(modelField, currentVal, type, module, reffObj) {
        let transaction = '&TransactionType=' + type;
        this.QueryTransactionType = transaction;
        
        let modulestring = "";
        if (module == 'Receivables')
          modulestring = '&IsSales=true'
        if (module == 'Payables')
          modulestring = '&IsPurchasing=true'
        if (module == 'Checkbook')
          modulestring = '&IsFinancial=true'

        this.QueryModule = modulestring;

        this.reffModelField = modelField;
        this.selectedValue = currentVal;
        this.reffModel = reffObj;

        await this.$store.dispatch(
          "features/company/charges/actGetCharges",
          "charges?&Inactive=false" + transaction + modulestring + ""
        );

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-charges"].show();
        });
      },
      accept(str) {
        this.dialog = false;
        this.resolve(str);
      },
      cancel(str) {
        this.dialog = false;
        this.reject("rejected");
        this.$refs["modal-charges"].hide();
      },
      handleSelect(row) {
        this.dialog = false;
        this.actSelectedRow(row, this.reffModelField, this.reffModel);
        this.$refs["modal-charges"].hide();
      }
    },
    async mounted() {
      await this.$store.dispatch(
        "features/company/charges/actGetCharges",
        "charges?"
      );
    },
  };
</script>
