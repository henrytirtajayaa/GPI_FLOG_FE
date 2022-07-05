import Axios from '../../../plugins/axios';

const configUrl = "NumberFormatDetail?"
export const state = () => ({
  data: [],
  resultCreate: {},
  resultUpdate: {},
  resultDelete: {},
  listInfo: [],
  baseUrl: configUrl
});

export const actions = {
  async actGetNumberFormatDetail({ commit, rootState }, model) {
   
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .get('NumberFormatDetail?&FormatHeaderId=' + model.FormatHeaderId, model)
        .then(response => {
          return response;
        })
        .catch(e => {
          this.errors.push(e);
          alert(this.errors);
        })
      return response;

    }
    catch (err) {
      console.log(err);
    }
  },

  async actCreateNumberFormatDetail({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('NumberFormatDetail', {
          SegmentNo: model.SegmentNo,
          SegmentType: model.SegmentType,
          SegmentLength: model.SegmentLength,
          NumberFormat: model.NumberFormat,
          StartingValue: model.StartingValue,
          EndingValue: model.EndingValue,
          Increase: model.Increase,
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

  async actUpdateNumberFormatDetail({ commit, rootState }, model) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .put('NumberFormatDetail', {
          FormatDetailId: model.FormatDetailId,
          FormatHeaderId: model.FormatHeaderId,
          SegmentNo: model.SegmentNo,
          SegmentType: model.SegmentType,
          SegmentLength: model.SegmentLength,
          NumberFormat: model.NumberFormat,
          StartingValue: model.StartingValue,
          EndingValue: model.EndingValue,
          Increase: model.Increase,
        })
        .then(response => {
          commit("FETCH_RESULT_UPDATE", response);
        })
        .catch(e => {
          this.errors.push(e);
        })
    }
    catch (err) {
      console.log(err);
    }
  },

  async actDeleteNumberFormatDetail({ commit, rootState }, row) {
    try {
      var response = await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .delete('NumberFormatDetail', { data: { FormatDetailId: row.FormatDetailId } })
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
  FETCH_DATA: (state, value) => { state.data = value },
  FETCH_DATA_INFO: (state, value) => { state.listInfo = value },
  FETCH_RESULT_CREATE: (state, value) => { state.resultCreate = value },
  FETCH_RESULT_UPDATE: (state, value) => { state.resultUpdate = value },
  FETCH_RESULT_DELETE: (state, value) => { state.resultDelete = value }
};
