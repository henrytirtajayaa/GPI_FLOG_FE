<template>
  <div>
    <div left style="float:left;" class="mb-1">
      <b-input-group prepend>
        <b-button variant="success"
                  @click="handleCreateRole()"
                  v-b-tooltip.hover
                  title="Add Form" size="sm">
          <font-awesome-icon :icon="['fas', 'plus-circle']" />
        </b-button>
        &nbsp;
        <b-form-select size="sm"
                       id="SmartViewGroup"
                       name="SmartViewGroup"
                       v-model="SmartViewGroup"
                       :plain="true"
                       :options="[{value: 1,text: 'SMART VIEW NAME'},{value: 2,text: 'SQL VIEW NAME'},{value: 3,text: 'SMART VIEW GROUP'}]" />
        &nbsp;
        <b-form-input v-model="Search" class="font-weight-bold" size="sm">
        </b-form-input>
        <b-input-group-append>
          <b-button variant="outline-primary" size="sm" @click="handleSearch(Search)">
            <font-awesome-icon :icon="['fas', 'search']" size="sm"></font-awesome-icon>
          </b-button>
          <b-button variant="outline-primary" size="sm" @click="Refresh()">
            <font-awesome-icon :icon="['fas', 'retweet']" size="sm"></font-awesome-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>

    <table :class="tableClasses">
      <thead>
        <tr>

          <th><font-awesome-icon :icon="['fas', 'trash']" @click="DeleteAllRole" /></th>
          <th @click="sort('name',1)">SMART VIEW NAME  <b-icon :icon="currentSortDir === 'desc'? 'arrow-down' :'arrow-up'"></b-icon></th>
          <th @click="sort('name',2)">SQL VIEW NAME  <b-icon :icon="currentSortDir === 'desc'? 'arrow-down' :'arrow-up'"></b-icon></th>
          <th @click="sort('name',3)">SMART VIEW GROUP  <b-icon :icon="currentSortDir === 'desc'? 'arrow-down' :'arrow-up'"></b-icon></th>

        </tr>
      </thead>

      <tbody class="position-relative">
        <template v-for="(item, itemIndex) in items">
          <tr>
            <td><font-awesome-icon :icon="['fas', 'trash']" @click="DeleteRole(itemIndex)" /></td>
            <td> {{item.SmartTitle}}</td>
            <td> {{item.SqlViewName}}</td>
            <td> {{item.GroupName}}</td>

          </tr>
        </template>

      </tbody>
    </table>

    <div id="page-dialogs" height="50%">
      <b-modal v-model="isShowRole" hide-footer>

        <template v-slot:modal-title>
          Smart Views
        </template>

        <div class="d-block text-left">


          <SelectChecked ref="gridUser"
                         :fields="[{label: 'Smart view name',key: 'SmartTitle'},{label: 'Sql View Name',key: 'SqlViewName'},
                                {label: 'Smart View Group',key: 'GroupName'}]"
                         :items="this.$store.state.features.report.smart_view.data"
                         :info="this.$store.state.features.report.smart_view.listInfo"
                         :baseUrl="this.$store.state.features.report.smart_view.baseUrl"
                         :actGetData="handleGetSmartview"
                         :selectedItem="userName"
                         selectedFieldName="ApprovalCode"
                         :actSelectRow="handleSelect"
                         addTableClasses="table-bordered"
                         responsive
                         loading
                         hover
                         sorter
                         pagination
                         column-filter></SelectChecked>



        </div>

      </b-modal>
    </div>
  </div>
</template>
<script>
  import DataGrid from '@/components/Tables/DataGrid';
  import SelectChecked from "@/components/tables/SelectChecked";
  export default {
    name: "DataGrid",

    components: {
      DataGrid, SelectChecked
    },
    props: {
      items: Array,
      dataAnother: Array,
      isNew: { type: Boolean, default: true },
    },

    data() {
      return {
        userName: "",
        Search: "",
        SmartViewGroup: null,
        DuplicateItems: [],
        selectedForm: [],
        itemsFormsName: [],
        itemsForms: [],
        TotalPopup: [],
        valueFormsGroup: [],
        AllFormName: null,
        isShowRole: false,
        //breweries:this.itemsData || [],
        currentSort: 'name',
        currentSortDir: 'asc',
        pageSize: 10,
        currentPage: 1,
        currentPagePopup: 1,
        another: []
      };
    },

    computed: {
      tableClasses() {
        return [
          "table",
          {
            [`table-${this.size}`]: this.size,
            "table-dark": this.dark,
            "table-striped": this.striped,
            "b-table-fixed": this.fixed,
            "table-hover": this.hover,
            "table-bordered": this.border,
            border: this.outlined
          }
        ];
      },
      cantGoBack() {
        return this.currentPage === 1;
      },
      cantGoNext() {
        var a1 = (this.items.length / 10);
        var rr = Math.ceil(a1);
        if (rr > 1)
          return this.currentPage === rr;

      },
      cantGoBackPopup() {
        return this.currentPagePopup === 1;
      },
      sortStr() {
        let s = '';
        if (this.currentSortDir === 'desc') s += '-';
        return s + this.currentSort;
      }
    },
    created: function () {

      this.Search = "";
      this.loadList();
    },
    watch: {
      isNew(val) {
        this.Search = "";
      }
    },
    methods: {

      toggle(value) {

        this.$emit('newdata', this.items);

      },

      toggleFormName(value) {

        var arr = this.itemsForms;
        var Newarr = [];
        arr.forEach(function (row, index) {
          Newarr.push({ Status: value == true ? false : true, FormId: row.FormId, FormName: row.FormName })
        });


        this.itemsFormsName = [];
        this.itemsForms = Newarr;
        this.loadListPopUp();



      },
      async handleSaveRole() {
        this.$emit('AddRole', this.items)
        this.isShowRole = false;


      },
      async handleGetSmartview(url) {
        await this.$store.dispatch("features/report/smart_view/actGetData", url);
      },
      async handleSelect(row) {
        //this.items = row;
        this.$emit('AddRole', row)
        this.isShowRole = false;
      },
      async handleCreateRole() {

        this.selectedForm = null;
        this.AllFormName = false;
        this.itemsFormsName = [];
        await this.$store.dispatch(
          "features/central/form/actGetFormGroup"
        );
        this.isShowRole = true;
        var defaultGroup = ["ALL Form Group"];
        var formGroup = this.$store.state.features.central.form.FormGroup;
        this.valueFormsGroup = defaultGroup.concat(formGroup);

      },
      async filterItems(needle, heystack) {
        var query = needle.toLowerCase();
        return heystack.filter(function (item) {
          if (item.Name.startsWith(needle)) {
            return item
          }

        })
      },
      async handleSearch(value) {
        if (this.SmartViewGroup != null) {
        if (this.SmartViewGroup != '') {
          this.DuplicateItems = this.items;
          var arr = [];
          var arrAnother = []
          if(this.dataAnother.length > 0){
            this.DuplicateItems = this.DuplicateItems.concat(this.another)
          }
          if (this.SmartViewGroup == 1) {
            this.DuplicateItems.filter(function (newitem) {
              if (newitem.SmartTitle.toUpperCase().startsWith(value.toUpperCase())) {
                arr.push(newitem);
              }else{
              arrAnother.push(newitem);
            }
            });
          }
          if (this.SmartViewGroup == 2) {
            this.DuplicateItems.filter(function (newitem) {
              if (newitem.SqlViewName.toUpperCase().startsWith(value.toUpperCase())) {
                arr.push(newitem);
              }else{
              arrAnother.push(newitem);
            }
            });
          }
          if (this.SmartViewGroup == 3) {
            this.DuplicateItems.filter(function (newitem) {
              if (newitem.GroupName.toUpperCase().startsWith(value.toUpperCase())) {
                arr.push(newitem);
              }else{
              arrAnother.push(newitem);
            }
            });
          }
          this.another = arrAnother;
          this.$emit('search', arr, this.DuplicateItems,arrAnother)
        }
        }

        //this.items =arr;
      },
      async Refresh() {
        this.Search = "";
        //console.log(this.DuplicateItems);
        if (this.DuplicateItems.length > 0) {
          this.SmartViewGroup = 0;
          this.$emit('refresh', this.DuplicateItems)
        }
      },

      async DeleteRole(index) {
        this.items.splice(index, 1);
      },
      async DeleteAllRole() {
        this.$emit('deleteAll')
        // this.items = [];
      },
      async changeRoute(modul) {

        this.itemsFormsName = [];
        var Namearr = [];

        this.items.forEach(function (row, index) {
          Namearr.push(row.Name);
        });

        var ModelForm = [];
        ModelForm.push({ "Module": modul, "FormName": Namearr })
        await this.$store.dispatch("features/central/form/actGetForm", ModelForm);

        var arr = [];
        this.$store.state.features.central.form.data.forEach(function (row, index) {
          arr.push({ Status: false, FormId: row.FormId, FormName: row.FormName })
        });

        arr.sort(function (x, y) {
          let a = x.FormName.toUpperCase(),
            b = y.FormName.toUpperCase();
          return a == b ? 0 : a > b ? 1 : -1;
        });

        console.log(arr);

        this.itemsForms = arr;

        this.loadListPopUp();

      },

      nextPage() {
        this.currentPage++;
        this.loadList();
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
        this.loadList();
      },
      nextPagePopup: function () {
        this.currentPagePopup++;
        this.loadListPopUp();
      },
      prevPagePopup: function () {
        if (this.currentPagePopup > 1) this.currentPagePopup--;
        this.loadListPopUp();
      },
      sort(s, i) {

        if (s === this.currentSort) {
          this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
        } else this.currentSortDir = 'asc';
        this.currentSort = s;


        if (this.currentSortDir == "desc") {
          if (i == 1) {
            this.items.sort(function (x, y) {
              let a = x.SmartTitle.toUpperCase(),
                b = y.SmartTitle.toUpperCase();
              return a == b ? 0 : a < b ? 1 : -1;
            });
          }
          if (i == 2) {
            this.items.sort(function (x, y) {
              let a = x.SqlViewName.toUpperCase(),
                b = y.SqlViewName.toUpperCase();
              return a == b ? 0 : a < b ? 1 : -1;
            });
          }
          if (i == 3) {
            this.items.sort(function (x, y) {
              let a = x.GroupName.toUpperCase(),
                b = y.GroupName.toUpperCase();
              return a == b ? 0 : a < b ? 1 : -1;
            });
          }
        } else {


          if (i == 1) {
            this.items.sort(function (x, y) {
              let a = x.SmartTitle.toUpperCase(),
                b = y.SmartTitle.toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
          }
          if (i == 2) {
            this.items.sort(function (x, y) {
              let a = x.SqlViewName.toUpperCase(),
                b = y.SqlViewName.toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
          }
          if (i == 3) {
            this.items.sort(function (x, y) {
              let a = x.GroupName.toUpperCase(),
                b = y.GroupName.toUpperCase();
              return a == b ? 0 : a > b ? 1 : -1;
            });
          }
        }





        // this.breweries = this.items;


      },

      loadList() {

        var begin = ((this.currentPage - 1) * 10);
        var end = begin + 10;
        this.items.slice(begin, end);

      },
      loadListPopUp() {
        var begin = ((this.currentPagePopup - 1) * 10);
        var end = begin + 10;

        this.itemsFormsName = this.itemsForms.slice(begin, end);

      },
    },
    async mounted() {
      await this.$store.dispatch(
        "features/report/smart_view/actGetData", "GetSmartView?");

    },
  };

</script>
