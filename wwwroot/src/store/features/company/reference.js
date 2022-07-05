import Axios from '../../../plugins/axios';

const configUrl = "reference?"
export const state = () => ({
    data: [],
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            text: 'Reference Code',
            value: 'ReferenceCode',
            align: 'text-sm-left',
            sort: true,
            filter: true,
        },
        {
            text: 'Reference Name',
            value: 'ReferenceName',
            sort: true,
            filter: true,
        },
        {
            text: 'In Active',
            value: 'Inactive',
            sort: true,
            filter: false,
        },
    ],
});

export const actions = {
    async actGetReference({ commit, rootState }, url) {
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
                commit("FETCH_DATA_REFERENCE", response.data.References);
                commit("FETCH_DATA_INFO", response.data.ListInfo);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};

export const mutations = {
    FETCH_DATA_REFERENCE: (state, value) => (state.data = value),
    FETCH_DATA_INFO: (state, value) => (state.listInfo = value)
};
