<template>
  <div>
    <vue-element-loading :active="blockLoader" spinner="bar-fade-scale" color="#F06292" size="50"/>
    <div class="row">
      <b-col md="8" style="vertical-align:bottom;">
        <span class="table-title">{{caption}}</span>
      </b-col>
      <b-col md="4"></b-col>
    </div>
    <slot name="over-table" />
    <div :class="`position-relative ${responsive ? 'table-responsive' : '' }`">
      <table :class="tableClasses">
        <thead>
          <tr v-if="header">
            <th width="50px" class="text-center">
              <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
            </th>
            <template v-for="(name, index) in columnNames">
              <th
                @click="changeSort(rawColumnNames[index], index)"
                :class="[headerClass(index), sortingIconStyles]"
                :style="headerStyles(index)"
                :width="headerWidth(index)"
                :key="index"
              >
                <slot :name="`${rawColumnNames[index]}-header`">
                  <div class="d-inline">{{name}}</div>
                </slot>
                <slot
                  v-if="isSortable(index)"
                  name="sorting-icon"
                  :state="getIconState(index)"
                  :classes="iconClasses(index)"
                >
                  <b-icon icon="arrow-up" :class="iconClasses(index)"></b-icon>
                </slot>
              </th>
            </template>
          </tr>

          <tr v-if="columnFilter" class="table-sm">
            <th style="vertical-align:top;" class="text-center">
              <a
                href="javascript:;"
                style="text-decoration:none;color:#ff8a80;font-size:13px;"
                variant="outline-danger"
                v-if="onFiltering"
                @click="clearFilter"
              >
                <font-awesome-icon :icon="['fas', 'times']" variant="blue" />
              </a>
            </th>
            <template v-for="(colName, index) in rawColumnNames">
              <th :class="headerClass(index)" :key="index" style="vertical-align:top;">
                <slot :name="`${rawColumnNames[index]}-filter`">
                  <select
                    :ref="colName"
                    v-if="!fields || (fields[index].filter !== false && fields[index].filter_select)"
                    @input="columnFilterEvent(colName, $event.target.value, 'change_select')"
                    @change="columnFilterEvent(colName, $event.target.value, 'change_select')"
                    size="sm"
                    class="form-control form-control-sm filter-column"
                  >
                    <option value>-- All --</option>
                    <option
                      v-for="(opt,idx) in fields[index].filter_select_options"
                      :value="opt.key" v-bind:key="opt.value"
                    >{{opt.value}}</option>
                  </select>
                  <b-input-group
                    v-if="!fields || (fields[index].filter !== false && fields[index].filter_number)"
                    size="sm"
                  >
                    <template v-slot:prepend>
                      <b-input-group-text>Min</b-input-group-text>
                    </template>
                    <input
                      class="form-control form-control-sm filter-column"
                      @input="columnFilterEvent(colName+'Min', $event.target.value, 'input')"
                      @change="columnFilterEvent(colName+'Min', $event.target.value, 'change')"
                      :value="columnFilterState[colName+'Min']"
                    />
                    <template v-slot:append>
                      <b-input-group-text>Max</b-input-group-text>
                    </template>
                    <input
                      class="form-control form-control-sm filter-column"
                      @input="columnFilterEvent(colName+'Max', $event.target.value, 'input')"
                      @change="columnFilterEvent(colName+'Max', $event.target.value, 'change')"
                      :value="columnFilterState[colName+'Max']"
                    />
                  </b-input-group>
                  <b-input-group
                    v-if="!fields || (fields[index].filter !== false && fields[index].filter_date)"
                    size="sm"
                  >
                    <input
                      type="date"
                      class="basic-datepicker"
                      :ref="colName+'Start'"
                      @input="columnFilterEvent(colName, $event.target.value, 'date_start')"
                      @change="columnFilterEvent(colName, $event.target.value, 'date_start')"
                    />
                    <input
                      type="date"
                      class="basic-datepicker"
                      :name="colName+'End'"
                      :ref="colName+'End'"
                      @input="columnFilterEvent(colName+'End', $event.target.value, 'date')"
                      @change="columnFilterEvent(colName+'End', $event.target.value, 'date')"
                    />
                  </b-input-group>
                  <input
                    v-if="!fields || (fields[index].filter !== false 
                      && !fields[index].filter_select && !fields[index].filter_number && !fields[index].filter_date)"
                    class="form-control form-control-sm filter-column"
                    @input="columnFilterEvent(colName, $event.target.value, 'input')"
                    @change="columnFilterEvent(colName, $event.target.value, 'change')"
                    :value="columnFilterState[colName]"
                  />
                </slot>
              </th>
            </template>
          </tr>
        </thead>
        <tbody :style="clickableRows ? 'cursor:pointer;': null" class="position-relative">
          <template v-for="(item, itemIndex) in currentItems">
            <tr @click="rowClicked(item, itemIndex + firstItemIndex, $event)"
                :class="item._classes"
                :tabindex="clickableRows ? 0 : null"
                :key="itemIndex">
              <td style="vertical-align:top;" class="text-center">
                <a href="javascript:;"
                   style="border-radius:40%;text-decoration:none;"
                   @click="handleSelectButton(item)"
                   v-if="(selectedItem != item[selectedFieldName])">
                  <!--font-awesome-icon :icon="['fas', 'circle']" /-->
                  <b-icon id="icon" icon="circle"></b-icon>
                </a>
                <a href="javascript:;" style="text-decoration:none;" v-else variant="success">
                  <font-awesome-icon :icon="['fas', 'check']" />
                </a>
              </td>
              <template v-for="(colName, index) in rawColumnNames">
                <slot v-if="$scopedSlots[colName]"
                      :name="colName"
                      :item="item"
                      :index="itemIndex + firstItemIndex" />
                <td v-if="fields[index].filter_date && !fields[index].currency"
                    :class="cellClass(item, colName, index)"
                    :key="index">
                  {{String(item[colName]) | formattedDMY(fields[index].date_format) }}
                </td>
                <td v-if="fields[index].currency && !fields[index].filter_date"
                    :class="cellClass(item, colName, index)"
                    :key="index">
                  {{
                    item[colName] | currency({symbol: '', fractionCount: '2', fractionSeparator: ',',
                  thousandsSeparator: '.', symbolPosition: '', symbolSpacing: ''})
                  }}
                </td>
                <td v-if="!fields[index].currency && !fields[index].filter_date"
                    :class="cellClass(item, colName, index)"
                    :key="index">
                  {{ String(item[colName])  }}
                </td>

              </template>
            </tr>
            <tr
              v-if="$scopedSlots.details"
              @click="rowClicked(item, itemIndex + firstItemIndex)"
              class="p-0"
              style="border:none !important"
              :key="'details' + itemIndex"
            >
              <td :colspan="colspan" class="p-0" style="border:none !important">
                <slot name="details" :item="item" :index="itemIndex + firstItemIndex" />
              </td>
            </tr>
          </template>
          <tr v-if="!currentItems.length">
            <td :colspan="colspan">
              <slot name="no-items-view">
                <div class="text-center my-4">
                  <h2>
                    {{ passedItems.length ? 'No filtering results ' : 'No records' }}
                    <font-awesome-icon size="sm" :icon="['fas', 'exclamation-circle']" />
                  </h2>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="footer && currentItems.length > 0">
          <tr>
            <th></th>
            <template v-for="(name, index) in columnNames">
              <th
                @click="changeSort(rawColumnNames[index], index)"
                :class="[headerClass(index), sortingIconStyles]"
                :style="headerStyles(index)"
                :key="index"
              >
                <slot :name="`${rawColumnNames[index]}-header`">
                  <div class="d-inline">{{name}}</div>
                </slot>
                <slot v-if="isSortable(index)" name="sorting-icon" :state="getIconState(index)">
                  <b-icon icon="arrow-up" :class="iconClasses(index)"></b-icon>
                </slot>
              </th>
            </template>
          </tr>
        </tfoot>
        <slot name="caption" />
      </table>
    </div>
    <slot name="under-table" />
    <div class="row">
      <b-col md="8">
        <b-pagination
          v-if="pagination"
          v-show="totalPages > 1"
          :activePage.sync="page"
          :total-rows="rows"
          :per-page="perPageItems"
          aria-controls="my-table"
          v-bind="typeof pagination === 'object' ? pagination : null"
          @change="pagingChange"
        ></b-pagination>
      </b-col>
      <b-col md="4">
        <div v-if="itemsPerPageSelect || tableFilter" class="row mx-0">
          <div
            v-if="itemsPerPageSelect"
            class="col-sm-6 p-0"
            :class="{ 'offset-sm-6': !tableFilter }"
          >
            <select class="small" @change="paginationChange">
              <option value selected disabled hidden>{{perPageItems}}</option>
              <option
                v-for="(number, key) in paginationSelect.values"
                :val="number"
                :key="key"
              >{{number}}</option>
            </select>
          </div>
        </div>
      </b-col>
    </div>
  </div>
</template>

<script>
import VueElementLoading from 'vue-element-loading'
import moment from 'moment'

export default {
  name: "DataGrid",
  components: {VueElementLoading},
  props: {
    items: Array,
    fields: Array,
    itemsPerPage: {
      type: Number,
      default: 10
    },
    activePage: Number,
    pagination: [Boolean, Object],
    addTableClasses: [String, Array, Object],
    responsive: {
      type: Boolean,
      default: true
    },
    size: String,
    dark: Boolean,
    striped: Boolean,
    fixed: Boolean,
    hover: Boolean,
    border: Boolean,
    outlined: Boolean,
    itemsPerPageSelect: [Boolean, Object],
    sorter: [Boolean, Object],
    tableFilter: [Boolean, Object],
    columnFilter: [Boolean, Object],
    tableFilterValue: String,
    columnFilterValue: Object,
    header: {
      type: Boolean,
      default: true
    },
    footer: Boolean,
    loading: { type: Boolean, default: false },
    clickableRows: Boolean,
    baseUrl: "",
    caption: "",
    info: "",
    actGetData: { type: Function },
    actSelectRow: { type: Function },
    actDetail: { type: Function },
    isSelect: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: true },
    selectedItem: "",
    selectedFieldName: ""
  },
  data() {
    return {
      currencyFormat: {
        symbol: '',
        thousandsSeparator: '.',
        fractionCount: '2',
        fractionSeparator: ',',
        symbolPosition: '',
        symbolSpacing: ''
      },
      tableFilterState: this.tableFilterValue,
      columnFilterState: {},
      sorterState: {
        column: null,
        asc: true
      },
      page: this.activePage || 1,
      perPageItems: this.itemsPerPage,
      passedItems: this.items || [],
      currentPage: 1,
      blockLoader: false,
      isShowLoader : true,
    };
  },
  watch: {
    itemsPerPage(val) {
      this.perPageItems = val;
    },
    tableFilterValue(val) {
      this.tableFilterState = val;
    },
    columnFilterValue: {
      immediate: true,
      handler(val) {
        this.columnFilterState = Object.assign({}, val);
      }
    },
    items(val, oldVal) {
      if (val && oldVal && this.objectsAreIdentical(val, oldVal)) {
        return;
      }
      this.passedItems = val || [];
    },
    totalPages: {
      immediate: true,
      handler(val) {
        this.$emit("pages-change", val);
      }
    },
    computedPage(val) {
      this.$emit("page-change", val);
    },
    sortedItems: {
      immediate: true,
      handler(val, oldVal) {
        if (val && oldVal && this.objectsAreIdentical(val, oldVal)) {
          return;
        }
        this.$emit("filtered-items-change", val);
      }
    }
  },
  computed: {
    onFiltering() {
      return Object.entries(this.columnFilterState).length > 0 ? true : false;
    },
    isDelete() {
      return this.actDeleteRow != null ? true : false;
    },
    rows() {
      let totalRecord = 0;
      if (this.items != undefined) {
        totalRecord = this.items.length;
      }

      if (this.info != undefined) {
        totalRecord = this.info.TotalCount;
      }

      return totalRecord;
    },
    columnFiltered() {
      let items = this.passedItems;
      if (this.columnFilter && this.columnFilter.external) {
        return items;
      }
      return items;
    },
    filterableCols() {
      return this.rawColumnNames.filter(name => {
        return this.generatedColumnNames.includes(name);
      });
    },
    sortedItems() {
      const col = this.sorterState.column;
      if (!col || !this.rawColumnNames.includes(col) || this.sorter.external) {
        return this.items;
      }

      //if values in column are to be sorted by numeric value they all have to be type number
      const flip = this.sorterState.asc ? 1 : -1;

      return this.items.slice().sort((item, item2) => {
        const value = item[col];
        const value2 = item2[col];
        const a =
          typeof value === "number" ? value : String(value).toLowerCase();
        const b =
          typeof value2 === "number" ? value2 : String(value2).toLowerCase();
        return a > b ? 1 * flip : b > a ? -1 * flip : 0;
      });
    },
    firstItemIndex() {
      return (this.computedPage - 1) * this.perPageItems || 0;
    },
    paginatedItems() {
      if (this.sortedItems != undefined) {
        return this.sortedItems.slice(
          this.firstItemIndex,
          this.firstItemIndex + this.perPageItems
        );
      } else {
        return this.sortedItems;
      }
    },
    currentItems() {
      let val = this.computedPage ? this.paginatedItems : this.sortedItems;
      if(val != undefined){
        return val
      }else{
        return this.passedItems;
      }      
    },
    totalPages() {
      return Math.ceil(this.rows / this.perPageItems) || 1;
    },
    computedPage() {
      return this.pagination ? this.page : this.activePage;
    },
    generatedColumnNames() {
      return Object.keys(this.passedItems[0] || {}).filter(
        el => el.charAt(0) !== "_"
      );
    },
    rawColumnNames() {
      if (this.fields) {
        return this.fields.map(el => el.key || el);
      }
      return this.generatedColumnNames;
    },
    columnNames() {
      if (this.fields) {
        return this.fields.map(f => {
          return f.label !== undefined ? f.label : this.pretifyName(f.key || f);
        });
      }
      return this.rawColumnNames.map(el => this.pretifyName(el));
    },
    tableClasses() {
      return [
        "table",
        this.addTableClasses,
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
    sortingIconStyles() {
      return { "position-relative pr-4": this.sorter };
    },
    colspan() {
      return this.rawColumnNames.length + 1;
    },
    paginationSelect() {
      return {
        label: this.itemsPerPageSelect.label || "Items per page:",
        values: this.itemsPerPageSelect.values || [5, 10, 20, 50]
      };
    }
  },
  filters: {
      formattedDMY: function(value, dateFormat) {
        if(dateFormat == undefined) dateFormat = 'DD/MM/YYYY'
        return moment(value).format(dateFormat);     
      }
  },
  methods: {
    showLoader(val) {
      if (this.isShowLoader) {
        if (!val) {
          setTimeout(() => {
            this.blockLoader = false;
          }, 250);
        } else {
          this.blockLoader = val;
        }
      } else {
        this.blockLoader = false;
      }
    },
    clearFilter() {
      Object.entries(this.columnFilterState).forEach(([key, value]) => {
        if (value != undefined) {
          const colFiltered = String(value).toLowerCase();
          if (colFiltered && !this.rawColumnNames.includes(key)) {
            if (this.$refs[key] != undefined && this.$refs[key] != null)
              this.$refs[key][0].value = "";
          } else {
            if (this.$refs[key] != undefined && this.$refs[key] != null)
              this.$refs[key][0].value = "";
          }
        }
      });

      this.columnFilterState = {};

      this.isShowLoader = true;
      this.doRefresh();
    },
    changeSort(column, index) {
      if (!this.isSortable(index)) {
        return;
      }
      //if column changed or sort was descending change asc to true
      const state = this.sorterState;
      const columnRepeated = state.column === column;
      if (!this.sorter || !this.sorter.resetable) {
        state.column = column;
      } else {
        state.column = columnRepeated && state.asc === false ? null : column;
      }
      state.asc = !(columnRepeated && state.asc);
      this.$emit("update:sorter-value", this.sorterState);

      this.isShowLoader = false;
      this.doRefresh();
    },
    columnFilterEvent(colName, value, type) {
      /*
      const isLazy = this.columnFilter && this.columnFilter.lazy === true
      if ((isLazy && type === 'input') || (!isLazy && type === 'change')) {
        return
      }*/

      if (type == "date_start") {
        this.$refs[colName + "End"][0].min = value;
        colName = colName + "Start";
      }

      this.$set(this.columnFilterState, colName, value);
      this.$emit("update:column-filter-value", this.columnFilterState);

      this.isShowLoader = false;
      this.doRefresh();
    },
    tableFilterChange(value, type) {
      //console.log('--tableFilterChange-- ' + ' value : ' + value + ' , type ' + type)
      const isLazy = this.tableFilter && this.tableFilter.lazy === true;
      if ((isLazy && type === "input") || (!isLazy && type === "change")) {
        return;
      }
      this.tableFilterState = value;
      this.$emit("update:table-filter-value", this.tableFilterState);
    },
    pretifyName(name) {
      return name
        .replace(/[-_.]/g, " ")
        .replace(/ +/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    cellClass(item, colName, index) {
      let classes = [];
      if (item._cellClasses && item._cellClasses[colName]) {
        classes.push(item._cellClasses[colName]);
      }
      if (this.fields && this.fields[index]._classes) {
        classes.push(this.fields[index]._classes);
      }
      
      return classes;
    },
    isSortable(index) {
      return (
        this.sorter && (!this.fields || this.fields[index].sorter !== false)
      );
    },
    headerClass(index) {
      const fields = this.fields;
      return fields && fields[index]._classes ? fields[index]._classes : "";
    },
    headerStyles(index) {
      let style = "";
      if (this.isSortable(index)) {
        style += `cursor:pointer;`;
      }
      if (this.fields && this.fields[index] && this.fields[index]._style) {
        style += this.fields[index]._style;
      }
      return style;
    },
    headerWidth(index) {
      const fields = this.fields;
      return fields[index].width ? fields[index].width : "";
    },
    headerHidden(index) {
      const fields = this.fields;
      return fields[index].hidden ? fields[index].hidden : false;
    },
    rowClicked(item, index, e) {
      //this.$emit("row-clicked", item, index, this.getClickedColumnName(e));
    },
    getClickedColumnName(e) {
      if (e) {
        const children = Array.from(e.target.closest("tr").children);
        const clickedCell = children.filter(child =>
          child.contains(e.target)
        )[0];
        return this.rawColumnNames[children.indexOf(clickedCell)];
      } else {
        return "details";
      }
    },
    getIconState(index) {
      const direction = this.sorterState.asc ? "asc" : "desc";
      return this.rawColumnNames[index] === this.sorterState.column
        ? direction
        : 0;
    },
    iconClasses(index) {
      const state = this.getIconState(index);
      return [
        "icon-transition position-absolute arrow-position",
        {
          transparent: !state,
          "rotate-icon": state === "desc"
        }
      ];
    },
    paginationChange(e) {
      this.$emit("pagination-change", Number(e.target.value));
      this.perPageItems = Number(e.target.value);
      this.currentPage = 1;

      this.isShowLoader = false;
      this.doRefresh();
    },
    //--DATA FETCHING--
    doRefresh() {
      this.showLoader(true);

      let pageSize = this.perPageItems;
      let offset = (this.currentPage - 1) * this.perPageItems;
      var url = this.baseUrl + "&limit=" + pageSize + "&offset=" + offset;

      Object.entries(this.columnFilterState).forEach(([key, value]) => {
        const columnFilter = String(value).toLowerCase();
        if (columnFilter) {
          //&& this.rawColumnNames.includes(key)
          url = url + "&" + key + "=" + value;
        }
      });

      let col = this.sorterState.column;
      let sortPrefix = this.sorterState.asc ? "" : "-";

      let paramSort = sortPrefix + col;
      if (!paramSort.match("undefined")) {
        if (url.match("sort")) url = this.baseUrl + "&sort=" + paramSort;
        else url = url + "&sort=" + paramSort;
      }

      this.actGetData(url);

      this.showLoader(false);
    },
    pagingChange(e) {
      this.currentPage = e;
      this.isShowLoader = false;
      this.doRefresh();
    },
    //--DATA-FETCHING--
    objectsAreIdentical(obj1, obj2) {
      return (
        obj1.length === obj2.length &&
        JSON.stringify(obj1) === JSON.stringify(obj2)
      );
    },
    onCreateClick() {
      this.actCreate();
    },
    handleSelectButton(props) {
      this.actSelectRow(props);
    }
  }
};
</script>

<style scoped>
table tbody td,
table tbody th {
  height: 0px;
  text-align: justify;
  vertical-align: middle;
}

.table thead th {
  border: 1px solid #ddd;
}

.table thead th .b-icon {
  font-size: 20px;
}

thead tr:not(:last-child) th {
  background-color: #f0f3f5;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  vertical-align: middle;
}

tbody td {
  border: 1px solid #ddd;
  padding: 1px 5px !important;
  font-size: 12px;
  vertical-align: top;
}

tfoot th {
  font-size: 12px;
  text-transform: uppercase;
  border: 1px solid #ddd;
  height: 30px;
  vertical-align: middle;
  background-color: #f0f3f5;
}

.transparent {
  opacity: 0.4;
}
.icon-transition {
  -webkit-transition: transform 0.3s;
  transition: transform 0.3s;
}
.arrow-position {
  right: 0;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.rotate-icon {
  -ms-transform: translateY(-50%) rotate(-180deg);
  transform: translateY(-50%) rotate(-180deg);
}
.table-title {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  font-size: 13pt;
  font-weight: bold;
  color: #004d40;
  vertical-align: bottom;
}
.filter-column {
  font-size: 12px;
}

.basic-datepicker {
  font-size: 12px;
  width: 105px;
  text-align: center;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media only screen and (max-width: 1024px) {
  .table-title {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: bold;
    color: #004d40;
    vertical-align: bottom;
  }
  .filter-column {
    font-size: 10px;
  }
  
  table tbody td,
  table tbody th {
    height: 0px;
    text-align: justify;
    vertical-align: middle;
  }

  .table thead th {
    border: 1px solid #ddd;
  }

  .table thead th .b-icon {
    font-size: 20px;
  }

  thead tr:not(:last-child) th {
    background-color: #f0f3f5;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    vertical-align: middle;
  }

  tbody td {
    border: 1px solid #ddd;
    padding: 1px 5px !important;
    font-size: 10px;
    vertical-align: top;
  }

  tfoot th {
    font-size: 8px;
    text-transform: uppercase;
    border: 1px solid #ddd;
    height: 30px;
    vertical-align: middle;
    background-color: #f0f3f5;
  }

  button{
    font-size:8px;
  }

  #icon{
    font-size:16px;
  }
}
</style>
