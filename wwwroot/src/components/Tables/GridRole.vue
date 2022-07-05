<template>
  <div>
    <div left style="float:left;"   class="mb-1">
      <b-input-group prepend>
        <!--<b-button variant="success" @click="handleCreateRole()" size="sm">Add Form</b-button>-->
        <b-button variant="success"
                  @click="handleCreateRole()"
                  v-b-tooltip.hover
                  title="Add Form" size="sm">
          <font-awesome-icon :icon="['fas', 'plus-circle']" />
        </b-button>
        &nbsp;
        <b-form-input v-model="Search" class="font-weight-bold" size="sm">
        </b-form-input>
        <b-input-group-append>
          <b-button variant="outline-primary" size="sm" @click="handleSearch(Search)">
            <font-awesome-icon :icon="['fas', 'search']"  size="sm"></font-awesome-icon>
          </b-button>
          <b-button variant="outline-primary" size="sm"  @click="Refresh()">
            <font-awesome-icon :icon="['fas', 'retweet']" size="sm"></font-awesome-icon>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
   
    <table :class="tableClasses">
      <thead>
        <tr>

          <th><font-awesome-icon :icon="['fas', 'trash']" @click="DeleteAllRole" /></th>
          <th @click="sort('name')">Form Name  <b-icon :icon="currentSortDir === 'desc'? 'arrow-down' :'arrow-up'"></b-icon></th>
          <th><b-form-checkbox v-model="AllOpen" label="Open" @click.native="toggleAll('Open',AllOpen)" disabled>Open</b-form-checkbox></th>
          <th><b-form-checkbox v-model="AllNew" label="New" @click.native="toggleAll('New',AllNew)">New</b-form-checkbox></th>
          <th><b-form-checkbox v-model="AllEdit" label="Edit" @click.native="toggleAll('Edit',AllEdit)">Edit</b-form-checkbox></th>
          <th><b-form-checkbox v-model="AllDelete" label="Delete" @click.native="toggleAll('Delete',AllDelete)">Delete</b-form-checkbox></th>
          <th><b-form-checkbox v-model="AllPost" label="Post" @click.native="toggleAll('Post',AllPost)">Post</b-form-checkbox></th>
          <th><b-form-checkbox v-model="AllPrint" label="Print" @click.native="toggleAll('Print',AllPrint)">Print</b-form-checkbox></th>
        </tr>
      </thead>

      <tbody class="position-relative">
        <template v-for="(item, itemIndex) in items">
          <tr>
            <td><font-awesome-icon :icon="['fas', 'trash']" @click="DeleteRole(itemIndex, item)" /></td>
            <td> {{item.Name}}</td>
            <td><b-form-checkbox v-model="item.AllowAccessOpen" disabled></b-form-checkbox></td>
            <td><b-form-checkbox v-model="item.AllowAccessNew"></b-form-checkbox></td>
            <td><b-form-checkbox v-model="item.AllowAccessEdit"></b-form-checkbox></td>
            <td><b-form-checkbox v-model="item.AllowAccessDelete"></b-form-checkbox></td>
            <td><b-form-checkbox v-model="item.AllowAccessPost"></b-form-checkbox></td>
            <td><b-form-checkbox v-model="item.AllowAccessPrint"></b-form-checkbox></td>
          </tr>
        </template>

      </tbody>
    </table>

    <!--<b-col sm="3" class="mb-3">
      <button @click.prevent="prevPage()" :disabled="cantGoBack">Previous</button>
      <button @click.prevent="nextPage()" :disabled="cantGoNext">Next</button>
    </b-col>--> 

    <div id="page-dialogs" height="50%">
      <b-modal v-model="isShowRole" hide-footer>

        <template v-slot:modal-title>
          Roles
        </template>
        <div right style="float:right;" class="mb-2">
          <b-button variant="blue" type="submit" @click="handleSaveRole">
            <font-awesome-icon :icon="['fas', 'save']" />&nbsp;Add
          </b-button>
          <b-button @click="isShowRole=false">
            <font-awesome-icon :icon="['fas', 'window-close']" danger />&nbsp;Close
          </b-button>
        </div>
        <div class="d-block text-left">
          <label>Role Code</label>
          <b-form-select v-model="selectedForm" :options="valueFormsGroup" v-on:change="changeRoute(selectedForm)"></b-form-select>

          <br />
          <table :class="tableClasses">
            <thead>
              <tr>
                <th><b-form-checkbox v-model="AllFormName" @click.native="toggleFormName(AllFormName)"></b-form-checkbox></th>
                <th>Form Name</th>

              </tr>
            </thead>
            <tbody class="position-relative">
              <template v-for="(item, itemIndex) in itemsFormsName">
                <tr>
                  <td><b-form-checkbox v-model="item.Status" @click.native="toggle()" /></td>
                  <td>{{item.FormName}}</td>

                </tr>
              </template>

            </tbody>

            <slot name="caption" />
          </table>
          <p>
            <button @click="prevPagePopup" :disabled="cantGoBackPopup">Previous</button>
            <button @click="nextPagePopup" :disabled="cantNextBtnPopUp">Next</button>
          </p>
        </div>
        <div class="row">
          <b-col md="8">
          </b-col>

        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>

  export default {
    name: "DataGrid",
   
    components: {

    },
    props: {
      itemsData: Array,
      items: Array,
      dataAnother: Array,
      isNew: { type: Boolean, default: true },
    },

    data() {
      return {
          Search: "",
        DuplicateItems: [],
        selectedForm: [],
        itemsFormsName: [],
        itemsForms: [],
        TotalPopup: [],
        valueFormsGroup: [],
        AllFormName: null,
        isShowRole: false,
        AllOpen: null,
        AllNew: null,
        AllEdit: null,
        AllDelete: null,
        AllPost: null,
        AllPrint: null,
        //breweries:this.itemsData || [],
        currentSort: 'name',
        currentSortDir: 'asc',
        pageSize: 10,
        currentPage: 1,
        currentPagePopup: 1,
        another: [],
        cantNextBtnPopUp: true,
        dataDelete: []
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

        this.$emit('AddRole',this.itemsForms)
        this.AllOpen = true;
        this.isShowRole = false;
        

      },

      async handleCreateRole() {
        this.cantNextBtnPopUp = true
        this.currentPagePopup = 1
        this.selectedForm = null;
        this.AllFormName = false;
        this.itemsFormsName = [];
        this.itemsForms = [];
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
      async cleardataDelete(){
        this.dataDelete = [];
      },
      async handleSearch(value) {
          this.DuplicateItems = this.items;
          var arr = [];
          var arrAnother = []
          if(this.dataAnother.length > 0){
            this.DuplicateItems = this.DuplicateItems.concat(this.another)
          }
          this.DuplicateItems.filter(function (newitem) {
          
            if (newitem.Name.toUpperCase().startsWith(value.toUpperCase())) {
              arr.push(newitem);
            }else{
              arrAnother.push(newitem);
            }
        
          })
          this.another = arrAnother;
          this.$emit('search',arr,this.DuplicateItems,arrAnother)
        //this.items =arr;
      },
      async Refresh() {
        this.Search = "";
        if (this.DuplicateItems.length > 0)
          this.$emit('refresh',this.DuplicateItems)
          this.another = []
      },

      async DeleteRole(index, value) {
        this.items.splice(index, 1);
        this.dataDelete.push(value.Name)
      },
      async DeleteAllRole() {
         this.$emit('deleteAll')
       // this.items = [];
      },
      async changeRoute(modul) {
        this.itemsFormsName = [];
        var Namearr = [];
        if(this.DuplicateItems.length > 0){
          var DeleteData = this.dataDelete
          this.DuplicateItems.forEach(function (row, index) {
            var cek = DeleteData.filter(x => x == row.Name)
            if(cek.length == 0){
              Namearr.push(row.Name);
            }
          });
        }else{
          this.items.forEach(function (row, index) {
            Namearr.push(row.Name);
          });
        }
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

        //console.log(arr);

        this.itemsForms = arr;
        this.loadListPopUp();

      },
      toggleAll(Name, value) {
        status = value == true ? false : true;
        this.items.forEach(function (row, index) {
          switch (Name) {
            case "Open":
              row.AllowAccessOpen = status;
              break;
            case "New":
              row.AllowAccessNew = status;
              break;
            case "Edit":
              row.AllowAccessEdit = status;
              break;
            case "Delete":
              row.AllowAccessDelete = status;
              break;
            case "Post":
              row.AllowAccessPost = status;
              break;
            case "Print":
              row.AllowAccessPrint = status;
              break;
            default:
          }
        });

        this.$emit('newdata', this.items);
      },
      async loadBreweries() {
        let data = [];
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
      sort(s) {

        if (s === this.currentSort) {
          this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
        } else this.currentSortDir = 'asc';
        this.currentSort = s;


        if (this.currentSortDir == "desc") {

          this.items.sort(function (x, y) {
            let a = x.Name.toUpperCase(),
              b = y.Name.toUpperCase();
            return a == b ? 0 : a < b ? 1 : -1;
          });
        } else {

          this.items.sort(function (x, y) {
            let a = x.Name.toUpperCase(),
              b = y.Name.toUpperCase();
            return a == b ? 0 : a > b ? 1 : -1;
          });
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

        var cekNext = this.currentPagePopup * 10;
        var Cekend = cekNext + 10;

        this.itemsFormsName = this.itemsForms.slice(begin, end);
        var CekItemsNext = this.itemsForms.slice(cekNext, Cekend);
        if(CekItemsNext.length > 0){
          this.cantNextBtnPopUp = false
        }else{
          this.cantNextBtnPopUp = true  
        }
      },
    }
  };

</script>
