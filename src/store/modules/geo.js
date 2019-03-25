import api from 'Common/js/api';


export default {
    namespaced: true,
    state: {
        list: {
            data: null,
            totalCount: 0,
            pageCount: 0,
        },
        opened: null,
    },
    mutations: {
        clearList: state =>
            state.list = {
                data: null,
                totalCount: 0,
                pageCount: 0,
            },
        setList: (state, payload) => state.list = payload,
        setOpened: (state, payload) => state.opened = payload,
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
                .then(({data}) => callback(data.status === 'ok'));
        },
        saveZone (context, {zone, callback}) {
            let req = zone.geoId
                ? api.put(`geo/${zone.geoId}`, zone)
                : api.post('geo', zone);

            req.then(({data}) => callback(data.status === 'ok'))
               .catch(() => callback());
        },
        createNewZone ({commit}) {
            commit('setOpened', {
                properties: {
                    name: '',
                    isOperating: true,
                },
                geometry: {},
            });
        },
        open: ({commit}, id) => {
            commit('setOpened', null);

            api.get(`geo/${id}`)
                .then(({data}) => commit('setOpened', data));
        },
        close: ({commit}) => commit('setOpened', null),
    },
}