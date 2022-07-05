<template>
  <b-modal ref="modal-rate-type" hide-footer size="lg">
    <template v-slot:modal-title>
      Document Number
    </template>
    <div class="d-block text-center">
      <SelectGrid
            ref="gridModal"
            :fields="headersAccount"
            :items="this.$store.state.features.finance.constants.data"
            :info="this.$store.state.features.finance.constants.listInfo"
            :baseUrl="this.$store.state.features.finance.constants.baseUrl"
            :actGetData="handleGetData"
            :selectedItem="selectedValue"
            selectedFieldName="RateType"
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
    reffField: "RateType",
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
      //{label: 'Rate Type', key: 'RateType', _classes: 'text-center', width:150},
      {label: 'Caption', key: 'Caption', _classes: 'text-left'}
    ]
  }),
  methods: {
    async handleGetData(url) {
      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.RATE_TYPE
      );
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      await this.$store.dispatch(
        "features/finance/constants/actGet",
        this.$store.state.features.finance.constants.ACTION_TYPE.RATE_TYPE
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs['modal-rate-type'].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs['modal-rate-type'].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs['modal-rate-type'].hide();
    }
  }
};
</script>