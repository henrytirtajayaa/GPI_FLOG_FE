import Axios from '../../../plugins/axios';

const configUrl = "CustomerVendorRelation?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Customer Code',
      key: 'CustomerCode',
      align: 'text-sm-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Customer Name',
      key: 'CustomerName',
      align: 'text-sm-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'Vendor Code',
      key: 'VendorCode',
      align: 'text-sm-left',
      width: 100,
      sort: true,
      filter: true,
    },
    {
      label: 'Vendor Name',
      key: 'VendorName',
      align: 'text-sm-left',
      width: 200,
      sort: true,
      filter: true,
    },

  ],
});

export const actions = {
  async actGet({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = configUrl
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.VendorRelations);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('CustomerVendorRelation', {
          RelationId: model.VendorRelationId,
          CustomerId: model.CustomerId,
          VendorId: model.VendorId
      
        })
        .then(response => {
          commit("FETCH_RESULT_UPDATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err)
    }
  },
  async actCreate({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('CustomerVendorRelation', {
          CustomerId: model.CustomerId,
          VendorId: model.VendorId,
       
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
        .delete('CustomerVendorRelation', { data: { RelationId: row.CustomerVendorRelationId } })
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
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


