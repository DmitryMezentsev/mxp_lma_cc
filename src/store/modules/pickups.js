import api from 'Common/js/api';
import {HEADER_PG_PAGE_COUNT, HEADER_PG_TOTAL_COUNT} from 'Constants/config';


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
        clearList: state =>
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

            api.get('pickup', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers[HEADER_PG_TOTAL_COUNT]),
                        pageCount: Number(headers[HEADER_PG_PAGE_COUNT]),
                    });
                });
        },
        patchPickup (context, {id, params, callback}) {
            api.patch(`pickup/${id}`, { ...params })
                .then(({data}) => callback(data.status === 'ok'))
                .catch(() => callback());
        },
        updatePickup (context, {pickup, callback}) {
            api.put(`pickup/${pickup.pickupId}`, pickup)
                .then(({data}) => callback(data.status === 'ok'))
                .catch(() => callback());
        },
    },
}