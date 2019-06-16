import api from 'Common/js/api';


export default {
    namespaced: true,
    state: {
        courierCalculation: null,
    },
    mutations: {
        setCourierCalculation: (state, payload) => state.courierCalculation = payload,
    },
    actions: {
        loadCourierCalculation ({commit}, params) {
            commit('setCourierCalculation', null);

            api.get('courier/closeBillingDay', { params })
                .then(({data:{_meta:{totalCardCOD, totalCashCOD}, data}}) => {
                    commit('setCourierCalculation', {
                        totalCardCOD,
                        totalCashCOD,
                        orders: data,
                    });
                });
        },
    },
}