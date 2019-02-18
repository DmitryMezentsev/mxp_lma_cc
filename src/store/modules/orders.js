import axios from 'axios';


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
    },
    actions: {
        getList ({commit}, params) {
            commit('clearList');

            axios.get('order', { params })
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
    },
}