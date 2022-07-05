<template>
  <b-modal ref="modal-port" hide-footer size="xl">
    <template v-slot:modal-title>
      Port
    </template>
    <div class="d-block text-center">
      <SelectGrid ref="gridVendor"
                  :fields="headersMain"
                  :items="this.$store.state.features.company.port.data"
                  :info="this.$store.state.features.company.port.listInfo"
                  :baseUrl="this.$store.state.features.company.port.baseUrl"
                  :actGetData="handleGetData"
                  :selectedItem="selectedValue"
                  selectedFieldName="PortCode"
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
      modalId: "modal-port",
      baseUrl: "",
      headers: "",
      items: "",
      info: "",
      reffField: "PortCode",
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
        {
          label: 'Port Code',
          key: 'PortCode',
          width: 100,
          align: 'text-sm-left',
          sort: true,
          filter: true,
        },
        {
          label: 'Port Name',
          key: 'PortName',
          width: 100,
          align: 'text-sm-left',
          sort: true,
          filter: true,
        },
        {
          label: 'City',
          key: 'CityName',
          width: 100,
          align: 'text-sm-left',
          sort: true,
          filter: true,
        },
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

        if (url.lastIndexOf("Port") < 0) {
          url = "Port?" + url;
        }

        await this.$store.dispatch("features/company/port/actGetPort", url);
      },
      async open(modelField, currentVal) {
        this.reffModelField = modelField;
        this.selectedValue = currentVal;

        await this.$store.dispatch(
          "features/company/port/actGetPort", "Port?Inactive=false"
        );

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;

          this.dialog = true;

          this.$refs["modal-port"].show();
        });
      },
      accept(str) {
        this.dialog = false;
        this.resolve(str);
      },
      cancel(str) {
        this.dialog = false;
        this.reject("rejected");
        this.$refs["modal-port"].hide();
      },
      handleSelect(row) {
        this.dialog = false;
        this.actSelectedRow(row, this.reffModelField);
        this.$refs["modal-port"].hide();
      }
    }
  };
</script>
