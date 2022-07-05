<template>
  <b-modal ref="modal-uom-schedule" hide-footer size="lg">
    <template v-slot:modal-title>
      Unit Of Measurement Schedule
    </template>
    <div class="d-block text-center">
      <SelectGrid
            ref="gridUOM"
            :fields="this.$store.state.features.company.uom.header.headers"
            :items="this.$store.state.features.company.uom.header.data"
            :info="this.$store.state.features.company.uom.header.listInfo"
            :baseUrl="this.$store.state.features.company.uom.header.baseUrl"
            :actGetData="handleGetData"
            :selectedItem="selectedValue"
            selectedFieldName="UomScheduleCode"
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
    modalId: "modal-uom-schedule",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "UomScheduleCode",
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
    perPage: 20
  }),
  async mounted() {
    await this.$store.dispatch("features/company/uom/header/actGet", 'UomHeader?');
  },
  methods: {
    async handleGetData(url) {
      await this.$store.dispatch("features/company/uom/header/actGet", url );
    },
    open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;

      this.$store.dispatch(
        "features/company/uom/header/actGet",
        "UomHeader?"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs['modal-uom-schedule'].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs['modal-uom-schedule'].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs['modal-uom-schedule'].hide();
    }
  }
};
</script>