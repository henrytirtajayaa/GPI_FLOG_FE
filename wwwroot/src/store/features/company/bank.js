import Axios from '../../../plugins/axios';

const configUrl = "Bank?"
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    {
      label: 'Bank Code',
      key: 'BankCode',
      width: 150,
      sort: true,
      filter: true,
    },
    {
      label: 'Bank Name',
      key: 'BankName',
      align: 'text-left',
      sort: true,
      filter: true,
    },
    {
      label: 'Address',
      key: 'Address',
      align: 'text-left',
      sort: true,
      filter: true,
    },
    {
      label: 'City Name',
      key: 'CityName',
      align: 'text-left',
      width: 200,
      sort: true,
      filter: true,
    },
    {
      label: 'Status',
      key: 'InActive',
      align: 'text-center',
      width: 80,
      sort: true,
      filter_select: true,
      filter_select_options: [
        { key: false, value: 'Active' },
        { key: true, value: 'Inactive' }
      ]
    },
  ],
});

export const actions = {
  async actGetBank({ commit, rootState }, url) {
    var arrBank = [];
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

        for (var i = 0; i < response.data.Banks.length; i++) {
          arrBank.push({
            BankId: response.data.Banks[i].BankId,
            BankCode: response.data.Banks[i].BankCode,
            BankName: response.data.Banks[i].BankName,
            Address: response.data.Banks[i].Address,
            CityName: response.data.Banks[i].CityName,
            CityCode: response.data.Banks[i].CityCode,
            InActive: response.data.Banks[i].InActive == true ? "Inactive " : "Active"
          });

        }
        commit("FETCH_DATA", arrBank);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },

  async actUpdateBank({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('Bank', {
          BankId: model.BankId,
          BankCode: model.BankCode,
          BankName: model.BankName,
          Address: model.Address,
          CityCode: model.CityCode,
          InActive: model.InActive
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
  async actCreateBank({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('Bank', {
          BankCode: model.BankCode,
          BankName: model.BankName,
          Address: model.Address,
          Address: model.Address,
          CityCode: model.CityCode,
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
  async actDeleteBank({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('Bank', { data: { BankId: row.BankId } })
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


