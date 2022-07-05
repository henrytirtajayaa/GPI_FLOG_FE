import Axios from '../../../plugins/axios';

const configUrl = "account?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl, 
  headers: [
    {
      text: 'Account Code',
      value: 'AccountId',
      align: 'text-sm-center',
      width:200,
      sort: true,
      filter: true,
    },
    {
      text: 'Description',
      value: 'Description',
      align: 'text-sm-left',
      sort: true,
      filter: true,
    },
    { 
      text: 'Posting Type',
      value: 'PostingType',
      align: 'text-sm-center',
      width:150,
      sort: true, 
      filter: true,
    },
    { 
      text: 'Normal Balance',
      value: 'NormalBalance',
      align: 'text-sm-center',
      width:80,
      sort: true, 
      filter: true,
    },
    { 
      text: 'No Direct Entry',
      value: 'NoDirectEntry',
      align: 'text-sm-center',
      width:80,
      sort: true, 
      filter: true,
    },
    { 
      text: 'Status',
      value: 'InActive',
      align: 'text-sm-center',
      width:100,
      sort: true, 
      filter: true,
    },
  ], 
});

export const actions = {
  async actGetAccount({ commit, rootState }, url) {
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
        for (var i = 0; i < response.data.Accounts.length; i++) {
          //ADD this for checked purpose
          response.data.Accounts[i]['IsChecked'] = false;
        }
        commit("FETCH_DATA", response.data.Accounts);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetOnlyDirectEntry({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      if (url.toLowerCase().lastIndexOf("nodirectentry") < 0) {
        url =
          url + "&NoDirectEntry=false&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&nodirectentry"));
        url =
          clean_uri +
          "&NoDirectEntry=false&Inactive=false";
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.Accounts);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actGetOnlyActive({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }

      if (url.toLowerCase().lastIndexOf("inactive") < 0) {
        url =
          url + "&Inactive=false";
      } else {
        var clean_uri = url
          .toLowerCase()
          .substring(0, url.indexOf("&inactive"));
        url =
          clean_uri +
          "&Inactive=false";
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA", response.data.Accounts);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdateAccount({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('Account', {
        AccountId : model.AccountId,
        Segment1: model.Segment1,
        Segment2: model.Segment2,
        Segment3: model.Segment3,
        Segment4: model.Segment4,
        Segment5: model.Segment5,
        Segment6: model.Segment6,
        Segment7: model.Segment7,
        Segment8: model.Segment8,
        Segment9: model.Segment9,
        Segment10: model.Segment10,
        Description: model.Description,
        PostingType: model.PostingType,
        NormalBalance: model.NormalBalance,
        NoDirectEntry: model.NoDirectEntry,
        Revaluation: model.Revaluation,
        InActive: model.InActive
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
  async actCreateAccount({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('account', {
        AccountId: model.AccountId,
        Segment1: model.Segment1,
        Segment2: model.Segment2,
        Segment3: model.Segment3,
        Segment4: model.Segment4,
        Segment5: model.Segment5,
        Segment6: model.Segment6,
        Segment7: model.Segment7,
        Segment8: model.Segment8,
        Segment9: model.Segment9,
        Segment10: model.Segment10,
        Description: model.Description,
        PostingType: model.PostingType,
        NormalBalance: model.NormalBalance,
        NoDirectEntry: model.NoDirectEntry,
        InActive: model.InActive
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
      .delete('Account', { data: { AccountId: row.AccountId } })
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


