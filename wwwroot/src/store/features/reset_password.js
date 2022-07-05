import Axios from '../../plugins/axios';

export const state = () => ({
  status: "" 
});

export const actions = {
  async RESET_PASSWORD({ commit, dispatch }, params) {
    try {
      await new Axios({
        'Content-Type': 'application/json',
      })
        .post('ResetPassword', params.model)
        .then(response => {
          commit("RESET_PASSWORD", response.status);
        })
        .catch(e => {
          this.errors.push(e);
          commit("RESET_PASSWORD", this.errors);
        })
    }
    catch (err) {
      console.log(err);
    }

  }
};

export const mutations = {
  RESET_PASSWORD: (state, param) => (state.status = param)
};


