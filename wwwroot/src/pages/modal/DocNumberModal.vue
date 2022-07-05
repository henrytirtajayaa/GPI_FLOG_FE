<template>
  <b-modal ref="modal-account" hide-footer size="lg">
    <template v-slot:modal-title>
      Document Number
    </template>
    <div class="d-block text-center">
      <SelectGrid
            ref="gridDocNumber"
            :fields="headersAccount"
            :items="this.$store.state.features.company.numberformat_header.data"
            :info="this.$store.state.features.company.numberformat_header.listInfo"
            :baseUrl="this.$store.state.features.company.numberformat_header.baseUrl"
            :actGetData="handleGetData"
            :selectedItem="selectedValue"
            selectedFieldName="DocumentId"
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
    modalId: "modal-account",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "DocumentId",
    handleGetAccount: { type: Function },
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
    headersAccount: [
      {
        key: "DocumentId",
        label: "Document Code",
        _classes: "text-left",
        width: 150
      },
      {
        key: "Description",
        label: "Description",
        _classes: "text-left"
      },
      {
        key: "NumberFormat",
        label: "Number Format",
        _classes: "text-left",
        width:200
      }
    ]
  }),
  async mounted() {
    await this.$store.dispatch("features/company/numberformat_header/actGetNumberFormatHeader", 'numberformatheader?&InActive=false');
  },
  methods: {
    async handleGetData(url) {
      await this.$store.dispatch("features/company/numberformat_header/actGetNumberFormatHeader", url + '&InActive=false');
    },
    open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      this.$store.dispatch(
        "features/company/numberformat_header/actGetNumberFormatHeader",
        "numberformatheader?&InActive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs['modal-account'].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs['modal-account'].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs['modal-account'].hide();
    }
  }
};
</script>