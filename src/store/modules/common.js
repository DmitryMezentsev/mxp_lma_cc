import api from 'Common/js/api';

export default {
  namespaced: true,
  state: {
    clientWidth: null,
    deliveryServices: null,
    showZammadChat: localStorage.showZammadChat === 'true' || false,
  },
  mutations: {
    setClientWidth(state, payload) {
      state.clientWidth = payload;
    },
    setDeliveryServices(state, payload) {
      state.deliveryServices = payload;
    },
    toggleShowZammadChat(state) {
      state.showZammadChat = !state.showZammadChat;
      localStorage.showZammadChat = state.showZammadChat;
    },
  },
  actions: {
    loadDeliveryServices({ commit, state }) {
      if (!state.deliveryServices) {
        api.get('/deliveryServiceCodes').then(({ data }) => {
          if (data.status === 'ok') {
            commit('setDeliveryServices', data.codes.deliveryServices);
          } else {
            window.app.$message({
              message: window.app.$t('deliveryServicesLoadingError'),
              type: 'error',
            });
          }
        });
      }
    },
  },
};
