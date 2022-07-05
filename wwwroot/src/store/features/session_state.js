import Axios from '../../plugins/axios';

export const state = () => ({
  data:[],
});

export const actions = {
  async actSignOutCompany({ commit, rootState }, params) {
    try {
      await new Axios({
        'Content-Type': 'application/json',
        'Authorization': rootState.token
      })
        .post('CompanySignout', params)
        .then(response => {
          commit("SIGNOUT_STATUS", response);
        })
        .catch(e => {
          this.errors.push(e);
          commit("SIGNOUT_STATUS", this.errors);
        })
    }
    catch (err) {
      console.log(err);
    }

  }
};

export const mutations = {
  SIGNOUT_STATUS: (state, param) => (state.data = param)
};


