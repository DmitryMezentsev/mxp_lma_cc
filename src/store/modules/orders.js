import api from 'Common/js/api';


export default {
    namespaced: true,
    state: {
        list: {
            data: null,
            totalCount: 0,
            pageCount: 0,
            sumPriceDeclared: 0,
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
                sumPriceDeclared: 0,
            },
        setList: (state, payload) => state.list = payload,
        setOpened: (state, payload) => state.opened = payload,
        setSelected: (state, payload) => state.selected = payload,
        clearSelected: state => state.selected = [],
    },
    actions: {
        getList ({commit}, params) {
            commit('clearList');

            api.get('order', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers['x-pagination-total-count']),
                        pageCount: Number(headers['x-pagination-page-count']),
                        sumPriceDeclared: parseFloat(headers['x-sum-price-declared']),
                    });
                });
        },
        open: ({commit}, index) => commit('setOpened', index),
        close: ({commit}) => commit('setOpened', null),
        select: ({commit}, ids) => commit('setSelected', ids),
        clearSelect: ({commit}) => commit('clearSelected'),
    },
}