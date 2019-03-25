import api from 'Common/js/api';


export default {
    namespaced: true,
    state: {
        list: {
            data: null,
            totalCount: 0,
            pageCount: 0,
        },
        editedId: null,
    },
    mutations: {
        clearList: state =>
            state.list = {
                data: null,
                totalCount: 0,
                pageCount: 0,
            },
        setList: (state, payload) => state.list = payload,
        setEditedId: (state, payload) => state.editedId = payload,
    },
    actions: {
        getList ({commit}, params) {
            commit('clearList');

            api.get('geo', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers['x-pagination-total-count']),
                        pageCount: Number(headers['x-pagination-page-count']),
                    });
                });
        },
        patchZone (context, {id, params, callback}) {
            api.patch(`geo/${id}`, { ...params })
                .then(({data}) => {
                    callback(data.status === 'ok');
                });
        },
        updateZone (context, {geo, callback}) {
            api.put(`geo/${geo.geoId}`, geo)
                .then(({data}) => {
                    callback(data.status === 'ok');
                })
                .catch(() => {
                    callback();
                });
        },
        edit: ({commit}, id) => commit('setEditedId', id),
        close: ({commit}) => commit('setEditedId', null),
    },
}