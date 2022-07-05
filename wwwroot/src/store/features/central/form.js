import Axios from '../../../plugins/axios';

const configUrl = "form?" 
export const state = () => ({
  data: [],
  resultDelete: {},
  resultUpdate: {},
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl,
  FormGroup: [],
 
});

export const actions = {
  async actGetFormGroup({ commit, rootState }, url) {
    try {
      if (url == null || url == undefined) {
        url = "GetFormGroup"
      }

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get(url)
      if (response.status == 200) {
        commit("FETCH_DATA_GROUP", response.data.FormGroup);
      }
    }
    catch (err) {
      console.log(err);
    }
   
    
  },
  async actGetForm({ commit, rootState }, model) {

    try {
      //if (url == null || url == undefined) {
      //  url = "GetForm"
      //}

      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get("GetForm?&Module=" + model[0].Module + "&FormName=" + model[0].FormName)
        //.get("GetForm?&Module="+model)
      if (response.status == 200) {
        commit("FETCH_DATA_FORMS", response.data.Forms);
        commit("FETCH_DATA_INFO", response.data.ListInfo);
      }
    }
    catch (err) {
      console.log(err);
    }
  },
};

export const mutations = {
  FETCH_DATA: (state, value) => (state.data = value),
  FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
  FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
  FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
  FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
  FETCH_DATA_GROUP: (state, value) => (state.FormGroup = value),
  FETCH_DATA_FORMS: (state, value) => (state.data = value)
};


