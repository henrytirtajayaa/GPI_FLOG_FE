<template>
  <b-modal ref="modal-vehicle" hide-footer size="xl">
    <template v-slot:modal-title>Vehicle</template>
    <div class="d-block text-center">
      <SelectGrid
        ref="gridVendor"
        :fields="headersMain"
        :items="this.$store.state.features.company.vehicle_type.data"
        :info="this.$store.state.features.company.vehicle_type.data.listInfo"
        :baseUrl="this.$store.state.features.company.vehicle_type.data.baseUrl"
        :actGetData="handleGetData"
        :selectedItem="selectedValue"
        selectedFieldName="VehicleTypeCode"
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
    modalId: "modal-vehicle",
    baseUrl: "",
    headers: "",
    items: "",
    info: "",
    reffField: "VendorCode",
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
            key: 'VehicleTypeCode',
            label: 'Vehicle Type Code',
            filter: true,
            width:200
          },
          {
            key: 'VehicleTypeName',
            label: 'Vehicle Type Name',
            filter: true
          },
          {
            key: 'VehicleCategory',
            label: 'Vehicle Category',
            filter: true
          }
        
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

      if (url.lastIndexOf("vehicleType") < 0) {
        url = "vehicle?" + url;
      }
      
      await this.$store.dispatch("features/company/vehicle_type/actGetVehicleType", url);
      console.log(this.$store.state.features.company.vehicle_type.data)
    },
    async open(modelField, currentVal) {
      this.reffModelField = modelField;
      this.selectedValue = currentVal;;

      await this.$store.dispatch(
        "features/company/vehicle_type/actGetVehicleType",
        "VehicleType?&Inactive=false"
      );

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        this.dialog = true;

        this.$refs["modal-vehicle"].show();
      });
    },
    accept(str) {
      this.dialog = false;
      this.resolve(str);
    },
    cancel(str) {
      this.dialog = false;
      this.reject("rejected");
      this.$refs["modal-vehicle"].hide();
    },
    handleSelect(row) {
      this.dialog = false;
      this.actSelectedRow(row, this.reffModelField);
      this.$refs["modal-vehicle"].hide();
    }
  }
};
</script>
