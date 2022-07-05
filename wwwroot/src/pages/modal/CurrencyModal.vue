<template>
  <b-modal ref="modal-currency" hide-footer size="lg">
    <template v-slot:modal-title>Currency</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridCurrency"
        :fields="headersAccount"
        :items="this.$store.state.features.company.currency.data"
        :info="this.$store.state.features.company.currency.listInfo"
        :baseUrl="this.$store.state.features.company.currency.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="CurrencyCode"
        :actSelectRow="handleSelect"
        addTableClasses="table-bordered"
        responsive
        loading
        hover
        sorter
        pagination
        column-filter
        :itemsPerPage="perPage"
      ></SelectGrid>
    </div>
  </b-modal>
</template>

<script>
import SelectGrid from "@/components/tables/SelectGrid";

export default {
  props: {
    modalId: "modal-currency",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "CurrencyCode",
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
    reffModel : [],
    perPage: 20,
    headersAccount: [
      {
        label: "Code",
        key: "CurrencyCode",
        _classes: "text-left",
        width:100
      },
      { 
        label: "Description", 
        key: "Description"
      },
      { 
        label: "Symbol", 
        key: "Symbol", 
        width:100, 
        _classes: "text-center"}
    ]
  }),
  methods: {
    async handleGetData(url) {
      if (url.toLowerCase().lastIndexOf("Inactive") < 0) {
        url = url + "&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&Inactive"));
        url =
          clean_uri + "&Inactive=false";
      }

      if (url.lastIndexOf("currency") < 0) {
        url = "currency?" + url;
      }

      await this.$store.dispatch("features/company/currency/actGetCurrency", url);
    },
    async open(modelField, currentVal, reffItem) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;
      this.reffModel = reffItem;

      await this.$store.dispatch(
        "features/company/currency/actGetCurrency",
        "Currency?&Inactive=false"
      );
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-currency"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-currency"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField, this.reffModel);
      this.$refs["modal-currency"].hide();
    }
  }
};
</script>