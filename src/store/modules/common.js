export default {
  namespaced: true,
  state: {
    clientWidth: null,
  },
  mutations: {
    setClientWidth(state, payload) {
      state.clientWidth = payload;
    },
  },
};
