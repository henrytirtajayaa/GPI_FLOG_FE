import Axios from '../../../plugins/axios';

const configUrl = "SalesSetup?"
export const state = () => ({
    data: [],
    resultDelete: {},
    resultUpdate: {},
    resultCreate: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            key: 'TransactionType',
            label: 'Transaction Type',
            _classes: 'text-sm-center',
        },
        {
            key: 'UofmScheduleCode',
            label: 'UofM',
            _classes: 'text-sm-center',
            width : 100
        },
        {
            key: 'QuotationDocNo',
            label: 'Quotation Doc No',
            _classes: 'text-sm-center',
            
        },
        {
            key: 'SoDocNo',
            label: 'Sales Order Doc No',
            _classes: 'text-sm-center',
        },
        {
            key: 'NsDocNo',
            label: 'Negotiation Sheet Doc No',
            _classes: 'text-sm-center',
        }
      ], 
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
                commit("FETCH_DATA", response.data.SalesSetups);
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
            .put('SalesSetup', model)
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
            .post('SalesSetup', model)
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
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .delete('SalesSetup', { data: { SalesSetupId: row.SalesSetupId } })
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