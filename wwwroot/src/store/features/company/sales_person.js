import Axios from '../../../plugins/axios';

const configUrl = "salesperson?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      text: 'Sales Code',
      value: 'SalesCode',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      text: 'Sales Name',
      value: 'SalesName',
      align: 'text-sm-left',
      sort: true, 
      filter: true,
    },
    { 
      text: 'User Login Name',
      value: 'PersonFullName',
      align: 'text-sm-left',
      sort: true, 
      filter: true,
    },
  ]
});

export const actions = {
  async actGetSalesPerson({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.SalesPersons.length; i++)
        {
          response.data.SalesPersons[i]['PersonFullName'] = (response.data.SalesPersons[i].PersonFullName == null ? "" : response.data.SalesPersons[i].PersonFullName);
        }
        commit("FETCH_DATA", response.data.SalesPersons);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actCreateSalesPerson({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('SalesPerson', {
        SalesCode : model.SalesCode,
        SalesName : model.SalesName,
        PersonId: model.PersonId
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
  async actUpdateSalesPerson({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('SalesPerson', {
          SalesPersonId: model.SalesPersonId,
          SalesCode : model.SalesCode,
          SalesName : model.SalesName,
          PersonId: model.PersonId
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
  async actDelete({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('SalesPerson', { data: { SalesPersonId: row.SalesPersonId } })
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
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
};


