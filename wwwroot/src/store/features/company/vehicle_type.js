import Axios from '../../../plugins/axios';

const configUrl = "VehicleType?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl
});

export const actions = {
  async actGetVehicleType({ commit, rootState }, url) {
    try {
      if(url == null || url == undefined){
        url = configUrl
      }
      
      if(url.indexOf('undefined') > -1){
        url = url.replace('undefined',configUrl);
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .get(url)
      if (response.status == 200) {
        let arrResult = [];
        for (var i = 0; i < response.data.VehicleTypes.length; i++) {
          arrResult.push({
            VehicleTypeId : response.data.VehicleTypes[i].VehicleTypeId,
            VehicleTypeCode : response.data.VehicleTypes[i].VehicleTypeCode,
            VehicleTypeName : response.data.VehicleTypes[i].VehicleTypeName,
            VehicleCategory : response.data.VehicleTypes[i].VehicleCategory,
            Inactive : (response.data.VehicleTypes[i].Inactive ? 'Inactive' : 'Active'),
          });
        }
        commit("FETCH_DATA_VEHICLE", arrResult);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  async actUpdateVehicleType({ commit, rootState }, model){
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .put('VehicleType', {
        VehicleTypeId : model.VehicleTypeId,
        VehicleTypeCode : model.VehicleTypeCode,
        VehicleTypeName : model.VehicleTypeName,
        VehicleCategory : model.VehicleCategory,
        Inactive : model.InActive
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
  async actCreateVehicleType({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .post('VehicleType', {
        VehicleTypeCode : model.VehicleTypeCode,
        VehicleTypeName : model.VehicleTypeName,
        VehicleCategory : model.VehicleCategory,
        Inactive : model.InActive
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
  async actDeleteVehicleType({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
      .delete('VehicleType', { data: { VehicleTypeId: row.VehicleTypeId } })
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
  FETCH_DATA_VEHICLE: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};


