<template>
  <b-modal ref="modal-account" hide-footer size="lg">
    <template v-slot:modal-title>
      Schedule
    </template>
    <div class="d-block text-center">
      <SelectGrid ref="gridSchedule"
                  :fields="headersSchedule"
                  :items="this.$store.state.features.company.tax_schedule.data"
                  :info="this.$store.state.features.company.tax_schedule.listInfo"
                  :baseUrl="this.$store.state.features.company.tax_schedule.baseUrl"
                  :actGetData="handleGetData"
                  :selectedItem="selectedValue"
                  selectedFieldName="TaxScheduleCode"
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
      modalId: "modal-schedule",
      baseUrl: "",
      headers: "",
      items: "",
      info: "",
      reffField: "TaxScheduleCode",
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
      headersSchedule: [
        {
          key: "TaxScheduleCode",
          label: "Tax Schedule Code",
          _classes: "text-center",
          width: 200
        },
        {
          key: "Description",
          label: "Description",
          _classes: "text-left"
        }
      ],

    }),
    async mounted() {
      await this.$store.dispatch(
        "features/company/tax_schedule/actGetTaxSchedule", "TaxSchedule?Inactive=false");
    },
    methods: {
      async handleGetData(url) {
        await this.$store.dispatch("features/company/tax_schedule/actGetTaxSchedule", url + '&Inactive=false');
      },
      open(modelField, currentVal) {
        this.reffModelField = modelField;
        this.selectedValue = currentVal;

        this.$store.dispatch(
          "features/company/tax_schedule/actGetTaxSchedule",
          "TaxSchedule?Inactive=false"
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
