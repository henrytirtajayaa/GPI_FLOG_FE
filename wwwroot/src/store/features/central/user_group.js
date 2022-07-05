import Axios from '../../../plugins/axios';

const configUrl = "userGroup?"
export const state = () => ({
    data: [],
    resultCreate: {},
    resultUpdate: {},
    resultDelete: {},
    listInfo: [],
    baseUrl: configUrl,
    headers: [
        {
            label: 'User Group Code',
            key: 'UserGroupCode',
            _classes: 'text-left',
            width:'200px',
            sort: true,
            filter: true,
        },
        {
            label: 'User Group Name',
            key: 'UserGroupName',
            _classes: 'text-left',
            sort: true,
            filter: true,
        },
    ],
});

export const actions = {
    async actGetUserGroup({ commit, rootState }, url) {
        try {
            if(url == null || url == undefined){
                url = configUrl
            }

            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .get(url)
            if(response.status == 200) {
                commit("FETCH_DATA_USERGROUP", response.data.UserGroups);
                commit("FETCH_DATA_INFO", response.data.ListInfo);
            }
        }
        catch(err) {
            console.log(err);
        }
    },

    async actCreateUserGroup({ commit, rootState }, model){
        try{
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .post('userGroup', {
                UserGroupCode: model.PersonCategoryCode,
                UserGroupName: model.PersonCategoryName
            })
            .then(response => {
                commit("FETCH_RESULT_CREATE", response);
            })
            .catch(e => {
                this.error.push(e);
            })
        }
        catch(err) {
            console.log(err);
        }
    },

    async actUpdateUserGroup({ commit, rootState }, model){
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .put('userGroup', {
                UserGroupId : model.PersonCategoryId,
                UserGroupCode: model.PersonCategoryCode,
                UserGroupName: model.PersonCategoryName
            })
            .then(response => {
                commit("FETCH_RESULT_UPDATE", response);
            })
            .catch(e => {
                this.errors.push(e);
            })
        }
        catch(err) {
            console.log(err);
        }
    },

    async actDeleteUserGroup({ commit, rootState }, row){
        try {
            var response = await new Axios({
                'Content-Type': 'application/json',
                'Authorization': rootState.token
            })
            .delete('userGroup', { data: { UserGroupId: row.UserGroupId } })
            .then(response => {
                commit("FETCH_RESULT_DELETE", response);
            })
            .catch(e => {
                this.errors.push(e);
                alert(this.errors);
            })
        }

        catch(err) {
            console.log(err);
        }
    }
};

export const mutations = {
    FETCH_DATA_USERGROUP: (state, value) => (state.data = value),
    FETCH_DATA_INFO: (state, value) => (state.listInfo = value),
    FETCH_RESULT_CREATE: (state, value) => (state.resultCreate = value),
    FETCH_RESULT_UPDATE: (state, value) => (state.resultUpdate = value),
    FETCH_RESULT_DELETE: (state, value) => (state.resultDelete = value),
};