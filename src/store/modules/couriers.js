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
        courier: null,
    },
    mutations: {
        clearList: state =>
            state.list = {
                data: null,
                totalCount: 0,
                pageCount: 0,
            },
        setList: (state, payload) => state.list = payload,
        setCourier: (state, payload) => state.courier = payload,
    },
    actions: {
        getList ({commit}, params) {
            commit('clearList');

            api.get('courier', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers[HEADER_PG_TOTAL_COUNT]),
                        pageCount: Number(headers[HEADER_PG_PAGE_COUNT]),
                    });
                });
        },
        patchCourier (context, {id, params, callback}) {
            api.patch(`courier/${id}`, { ...params })
                .then(({data}) => callback(data.status === 'ok'));
        },
        createNewCourier ({commit}) {
            commit('setCourier', {
                isActive: true,
                fullname: '',
                shortname: '',
                phone1: '',
                phone2: '',
                livingArea: '',
                passport: {
                    photo: '',
                    series: '',
                    address: '',
                    issueInfo: '',
                    birthday: '',
                },
                transport: {
                    brand: '',
                    model: '',
                    registrationNumber: '',
                },
                documents: [],
                access: {
                    login: '',
                    password: '',
                },
            });
        },
        openCourier ({commit}, id) {
            commit('setCourier', null);

            api.get(`courier/${id}`)
                .then(({data}) => commit('setCourier', data))
                .catch(({response}) => {
                    if (response.status === 404)
                        window.app.$router.push({ name: 'couriers' });
                });
        },
        saveCourier ({commit}, {courier, callback}) {
            commit('setCourier', courier);

            let req = courier.courierId
                ? api.put(`courier/${courier.courierId}`, courier)
                : api.post('courier', courier);

            req.then(({data}) => callback(data.status === 'ok'))
               .catch(() => callback());
        },
    },
}