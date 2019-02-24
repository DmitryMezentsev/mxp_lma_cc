import axios from 'axios';


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
        clearList: (state) =>
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

            axios.get('courier', { params })
                .then(({data, headers}) => {
                    commit('setList', {
                        data,
                        totalCount: Number(headers['x-pagination-total-count']),
                        pageCount: Number(headers['x-pagination-page-count']),
                    });
                });
        },
        patchCourier (context, {id, params, callback}) {
            axios.patch(`courier/${id}`, { ...params })
                .then(({data}) => {
                    callback(data.status === 'ok');
                });
        },
        createNewCourier ({commit}) {
            commit('setCourier', {
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
                documentsPhotos: [],
                access: {
                    login: '',
                    password: '',
                },
            });
        },
        openCourier ({commit}, id) {
            commit('setCourier', null);

            axios.get(`courier/${id}`)
                .then(({data}) => {
                    commit('setCourier', data);
                });
        },
        saveCourier ({commit}, {courier, callback}) {
            commit('setCourier', courier);

            if (courier.courierId) {
                axios.put(`courier/${courier.courierId}`, { ...courier })
                    .then(({data}) => {
                        callback(data.status === 'ok');
                    });
            } else {
                axios.post('courier')
                    .then(({data}) => {
                        callback(data.status === 'ok');
                    });
            }
        },
    },
}