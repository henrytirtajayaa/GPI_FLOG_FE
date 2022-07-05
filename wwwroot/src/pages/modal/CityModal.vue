<template>
  <b-modal ref="modal-city" hide-footer size="xl">
    <template v-slot:modal-title>Vendors</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridCity"
        :fields="headersMain"
        :items="this.$store.state.features.company.city.data"
        :info="this.$store.state.features.company.city.listInfo"
        :baseUrl="this.$store.state.features.company.city.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="CityCode"
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
    modalId: "modal-city",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "CityCode",
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
    headersMain: [
        { key: 'CityCode', label: 'City Code', _classes: 'text-left', width: 150 },
        { key: 'CityName', label: 'City Name', _classes: 'text-left' },
        { key: 'Province', label: 'Province', width: 300 },
        { key: 'CountryName', label: 'Country Name', width: 200 }
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

      if (url.lastIndexOf("city") < 0) {
        url = "city?" + url;
      }

      await this.$store.dispatch("features/company/city/actGetCity", url);
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/company/city/actGetCity",
        "city?&Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-city"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-city"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-city"].hide();
    }
  }
};
</script>