import Axios from '../../../plugins/axios';

const configUrl = "PayableSetup?"
export const state = () => ({
    data: [],
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'ID',
            value: 'PayableSetupId',
            align: 'text-sm-center',
            width: '100px'
        }
    ]
});

export const actions = {
    async actGet({ commit, rootState }, url) {
        try{
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
            if(response.status == 200){
                commit("FETCH_DATA", response.data.PayableSetups);
                commit("FETCH_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    },

    async actUpdate({ commit, rootState }, model){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('PayableSetup', {
                PayableSetupId: model.PayableSetupId,
                DefaultRateType : model.DefaultRateType,
                TaxRateType : model.TaxRateType,
                AgingByDocdate : model.AgingByDocdate,
                WriteoffLimit : model.WriteoffLimit,
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

    async actCreate({ commit, rootState }, model) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('PayableSetup', {
                DefaultRateType : model.DefaultRateType,
                TaxRateType : model.TaxRateType,
                AgingByDocdate : model.AgingByDocdate,
                WriteoffLimit : model.WriteoffLimit,
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
};

export const mutations = {
    FETCH_DATA: (state, value) => (state.data = value),
    FETCH_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value)
};