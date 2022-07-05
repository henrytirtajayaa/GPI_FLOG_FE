import Axios from '../../../plugins/axios';

const configUrl = "NumberFormatHeader?"
export const state = () => ({
    data: [],
    resultCreate: {},
    resultUpdate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'Document Code',
            value: 'DocumentId',
            align: 'text-xs-center',
            width:'100px',
            sort: true,
            filter: true,
        },
        {
            text: 'Description',
            value: 'Description',
            align: 'text-xs-left',
            sort: true,
            filter: true,
        },
        {
            text: 'Number Format',
            value: 'NumberFormat',
            align: 'text-xs-left',
            width:'200px',
            sort: true,
            filter: true,
        },
        {
            text: 'Status',
            align: 'text-xs-center',
            value: 'InActive',
            width:'100px',
            sort: true,
            filter: false,
        }
    ]
});

export const actions = {
    async actGetNumberFormatHeader({ commit, rootState }, url) {
        let arrResult = [];
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
                for (var i = 0; i < response.data.NumberFormatHeaders.length; i++) {
                    arrResult.push({  
                        FormatHeaderId: response.data.NumberFormatHeaders[i].FormatHeaderId,
                        DocumentId: response.data.NumberFormatHeaders[i].DocumentId,
                        Description: response.data.NumberFormatHeaders[i].Description,
                        LastGeneratedNo: response.data.NumberFormatHeaders[i].LastGeneratedNo,
                        NumberFormat: response.data.NumberFormatHeaders[i].NumberFormat,
                        InActive: (response.data.NumberFormatHeaders[i].InActive==true ? "Inactive" : "Active"),
                        IsMonthlyReset: (response.data.NumberFormatHeaders[i].IsMonthlyReset==true ? "Yes" : ''),
                      IsYearlyReset: (response.data.NumberFormatHeaders[i].IsYearlyReset == true ? "Yes" : "")
                    });
                }
                commit("FETCH_DATA", arrResult);
                commit("FETCH_DATA_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        } 
    },

    async actCreateNumberFormatHeader({ commit, rootState }, model) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('NumberFormatHeader', {
                DocumentId: model.DocumentId,
                Description: model.Description,
                LastGeneratedNo: model.LastGeneratedNo,
                NumberFormat: model.NumberFormat,
                InActive: model.InActive,
                IsMonthlyReset: model.IsMonthlyReset,
                IsYearlyReset: model.IsYearlyReset,
                NumberFormatDetails: model.NumberFormatDetails 
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

    async actUpdateNumberFormatHeader({ commit, rootState }, model) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('NumberFormatHeader', {
                FormatHeaderId: model.FormatHeaderId,
                DocumentId: model.DocumentId,
                Description: model.Description,
                LastGeneratedNo: model.LastGeneratedNo,
                NumberFormat: model.NumberFormat,
                InActive: model.InActive,
              IsMonthlyReset: model.IsMonthlyReset,
              IsYearlyReset: model.IsYearlyReset,
              NumberFormatDetails: model.NumberFormatDetails 
            })
            .then(response => {
                commit("FETCH_RESULT_UPDATE", response);
            })
            .catch(e => {s
                this.errors.push(e);
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    async actDeleteNumberFormatHeader({ commit, rootState }, row) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .delete('NumberFormatHeader', { data: { FormatHeaderId: row.FormatHeaderId } })
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
    FETCH_DATA: (state, value) => {state.data = value},
    FETCH_DATA_INFO: (state, value) => {state.listInfo = value},
    FETCH_RESULT_CREATE: (state, value) => {state.resultCreate = value},
    FETCH_RESULT_UPDATE: (state, value) => {state.resultUpdate = value},
    FETCH_RESULT_DELETE: (state, value) => {state.resultDelete = value}
};
