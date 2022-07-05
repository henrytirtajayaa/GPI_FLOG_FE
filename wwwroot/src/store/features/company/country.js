import Axios from '../../../plugins/axios';

const configUrl = "country?"
export const state = () => ({
    data: [],
    resultCreate: {},
    resultUpdate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            label: 'Country Code',
            key: 'CountryCode',
            _classes: 'text-left',
            width:'150px',
            sort: true,
        },
        {
            label: 'Country Name',
            key: 'CountryName',
            _classes: 'text-left',
            sort: true,
        },
        {
            label: 'Status',
            key: 'InActive',
            _classes: 'text-center',
            width:'200px',
            width: 100,
            filter_select: true,
            filter_select_options: [
                { key: false, value: 'Active' },
                { key: true, value: 'Inactive' }
            ]
        },
    ],
});

export const actions = {
  async actGetCountry({ commit, rootState }, url) {
        try {
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
          if (response.status == 200) {
            for (var i = 0; i < response.data.Countries.length; i++) {
                response.data.Countries[i]['InActive'] = (response.data.Countries[i].InActive ? "Inactive " : "Active");
            }    

            commit("FETCH_DATA_COUNTRY", response.data.Countries);
            commit("FETCH_DATA_INFO", response.data.ListInfo);

          }
        }
        catch (err) {
            console.log(err);
        }
    },

    async actCreateCountry({ commit, rootState }, model) {
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('Country',{
                CountryCode: model.CountryCode,
                CountryName: model.CountryName,
                InActive: model.InActive
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

    async actUpdateCountry({ commit, rootState }, model){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('Country', {
                CountryId: model.CountryId,
                CountryCode: model.CountryCode,
                CountryName: model.CountryName,
                InActive: model.InActive
            })
            .then(response => {
                commit("FETCH_RESULT_UPDATE", response);
            })
            .catch(e => {
                this.errors.push(e);
            })
        }
        catch (err){
            console.log(err);
        }
    },

    async actDeleteCountry({ commit, rootState }, row){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .delete('Country', { data: { CountryId: row.CountryId } })
            .then(response => {
                commit("FETCH_RESULT_DELETE", response);
            })
            .catch (e => {
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
    FETCH_DATA_COUNTRY: (state, value) => (state.data = value),
    FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_DELETE: (state,value) => (state.resultDelete = value)
};
