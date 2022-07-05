import Axios from '../../../plugins/axios';

const configUrl = "city?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  headers: [
    { key: 'CityCode', label: 'City Code', _classes: 'text-left', width: 150 },
    { key: 'CityName', label: 'City Name', _classes: 'text-left' },
    { key: 'Province', label: 'Province', width: 300 },
    { key: 'CountryName', label: 'Country Name', width: 200 },
    {
      key: 'InActive',
      label: 'Status',
      width: 100,
      filter_select: true,
      filter_select_options: [
        { key: false, value: 'Active' },
        { key: true, value: 'Inactive' }
      ]
    },
  ], 
});

export const actions = {
  async actGetCity({ commit, rootState }, url) {
    var arrCity = [];
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

        for (var i = 0; i < response.data.City.length; i++) {
          arrCity.push({
            CityId: response.data.City[i].CityId,
            CityCode: response.data.City[i].CityCode,
            CityName: response.data.City[i].CityName,
            Province: response.data.City[i].Province,
            CountryId: response.data.City[i].CountryId,
            CountryName: response.data.City[i].CountryName,
            InActive: (response.data.City[i].InActive ? 'Inactive' : 'Active'),
          });
        }
        commit("FETCH_DATA", arrCity);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actCreateCity({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('City', {
          CityCode: model.CityCode,
          CityName: model.CityName,
          Province: model.Province,
          CountryId: model.CountryId,
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
  async actUpdateCity({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('City', {
          CityId : model.CityId,
          CityCode: model.CityCode,
          CityName: model.CityName,
          Province: model.Province,
          CountryId: model.CountryId,
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

  async actDeleteCity({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('City', { data: { CityId: row.CityId } })
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


