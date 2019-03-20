import axios from 'axios';


export default {
    namespaced: true,
    state: {
        list: {
            data: null,
            totalCount: 0,
            pageCount: 0,
        },
        opened: null,
        selected: [],
    },
    mutations: {
        clearList: (state) =>
            state.list = {
                data: null,
                totalCount: 0,
                pageCount: 0,
            },
        setList: (state, payload) => state.list = payload,
        setOpened: (state, payload) => state.opened = payload,
        setSelected: (state, payload) => state.selected = payload,
        clearSelected: state => state.selected = [],
    },
    actions: {
        getList ({commit}, params) {
            commit('clearList');

            axios.get('pickup', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers['x-pagination-total-count']),
                        pageCount: Number(headers['x-pagination-page-count']),
                    });
                });
        },
        open: ({commit}, index) => commit('setOpened', index),
        close: ({commit}) => commit('setOpened', null),
        select: ({commit}, ids) => commit('setSelected', ids),
        clearSelect: ({commit}) => commit('clearSelected'),
        patchPickup (context, {id, params, callback}) {
            axios.patch(`pickup/${id}`, { ...params })
                .then(({data}) => {
                    callback(data.status === 'ok');
                });
        },
    },
}