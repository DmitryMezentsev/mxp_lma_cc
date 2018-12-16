import Vuex from 'vuex';
import axios from 'axios';

import {API_PATH} from '../constants/config';


export default () =>
    new Vuex.Store({
        state: {
            currentUser: null,
        },
        mutations: {
            setCurrentUser (state, payload) {
                state.currentUser = payload;
            },
        },
        actions: {
            loadCurrentUser ({commit}) {
                axios
                    .get(`${API_PATH}/current_user.json`).then(({data}) => {
                        commit('setCurrentUser', data);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
        },
        getters: {

        },
    });