import Axios from '../../../plugins/axios';

const configUrl = "ShippingLine?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
        label: 'Shipping Line Code',
        key: 'ShippingLineCode',
        width: 100,
        align: 'text-sm-left',
        sort: true,
        filter: true,
      },
      {
        label: 'Shipping Line Name',
        key: 'ShippingLineName',
        align: 'text-sm-left',
        sort: true,
        filter: true,
      },
      { 
        label: 'Shipping Line Type',
        key: 'ShippingLineType',
        align: 'text-sm-center',
        width: 150,
        sort: true, 
        filter: true,
      },
      { 
        label: 'Vendor Name',
        key: 'VendorName',
        align: 'text-sm-center',
        width: 150,
        sort: true, 
        filter: true,
      }
  ], 
});

export const actions = {
  async actGet({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        for (var i = 0; i < response.data.ShippingLines.length; i++)
        {
          response.data.ShippingLines[i]['Inactive'] = (response.data.ShippingLines[i].Inactive == true ? "Inactive" : "Active");
        }
        commit("FETCH_DATA_SHIPPING_LINE", response.data.ShippingLines);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdate({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('ShippingLine', {
        ShippingLineId : model.ShippingLineId,
        ShippingLineCode : model.ShippingLineCode,
        ShippingLineName : model.ShippingLineName,
        ShippingLineType : model.ShippingLineType,
        VendorId : model.VendorId,
        IsFeeder : model.IsFeeder,
        Inactive : model.Inactive,
        Status : 1
      })
      .then(response => {
        commit("FETCH_RESULT_UPDATE", response);
      })
      .catch(e => {
        this.errors.push(e);
      })
    }
    catch (err){
      console.log(err)
    }
  },
  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('ShippingLine', {
        ShippingLineCode : model.ShippingLineCode,
        ShippingLineName : model.ShippingLineName,
        ShippingLineType : model.ShippingLineType,
        VendorId : model.VendorId,
        IsFeeder : model.IsFeeder,
        Inactive : model.Inactive,
        Status : 1
      })
      .then(response => {
        commit("FETCH_RESULT_CREATE", response);
      })
      .catch(e => {
        this.errors.push(e);
      })
    }
    catch (err) {
      console.log(err);
    }
  },
  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('ShippingLine', { data: { ShippingLineId: row.ShippingLineId } })
      .then(response => {
        commit("FETCH_RESULT_DELETE", response);
      })
      .catch(e => {
        this.errors.push(e);
        alert(this.errors);
      })
    }
    catch (err) {
      console.log(err);
    } 
  }
};

export const mutations = {
  FETCH_DATA_SHIPPING_LINE: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


