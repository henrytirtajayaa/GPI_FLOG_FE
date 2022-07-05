import Axios from '../../../plugins/axios';

const configUrl = "ReceivableSetup?"
export const state = () => ({
    data: [],
    resultUpdate: {},
    resultCreate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [],
});

export const actions = {
    async actGet({ commit, rootState }, url) {
        try {
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
            if(response.status == 200){
                for (var i = 0; i < response.data.ReceivableSetups.length; i++) {
                    //response.data.ReceivableSetups[i]['DefaultRateTypeCaption'] = util.docStatusCaption(response.data.ReceivableSetups[i].Status)
                }
          
                commit("FETCH_DATA", response.data.ReceivableSetups);
                commit("FETCH_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    async actUpdate({ commit, rootState }, model) {
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('ReceivableSetup', {
                ReceivableSetupId : model.ReceivableSetupId,
                DefaultRateType : model.DefaultRateType,
                TaxRateType : model.TaxRateType,
                AgingByDocdate : model.AgingByDocdate,
                WriteoffLimit : model.WriteoffLimit
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
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('ReceivableSetup', {
                DefaultRateType : model.DefaultRateType,
                TaxRateType : model.TaxRateType,
                AgingByDocdate : model.AgingByDocdate,
                WriteoffLimit : model.WriteoffLimit                
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
          .delete('ReceivableSetup', { data: { ReceivableSetupId: row.ReceivableSetupId } })
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
    FETCH_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value)
};