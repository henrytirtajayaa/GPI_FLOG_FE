import Axios from '../plugins/axios';

const configUrl = "changePassword?" 
export const state = () => ({
  data: [],
  resultCreate: {},
  listInfo: [],
  baseUrl: configUrl
});

export const actions = {
    async actChangePassword({ commit, rootState }, model) {
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('ChangePassword', {
                OldPassword : model.OldPassword,
                NewPassword : model.NewPassword,
                ConfirmNewPassword : model.ConfirmNewPassword
            })
            .then(response => {
                commit("FETCH_RESULT_CREATE", response);
            })
            .catch(e => {
                this.errors.push(e);
            })
        }
        catch(err){
            console.log(err)
        }
    }
};

export const mutations = {
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value)
};