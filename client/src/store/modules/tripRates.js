import { httpGetAllTripRates } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      tripRates: [],
      provinces: [],
      cities: []
    };
  },
  mutations: {
    setTripRates(state, newTripRates) {
      state.tripRates = newTripRates;
      state.tripRates.forEach((tripRate) => {
        if (!state.provinces.includes(tripRate.province)) {
          state.provinces.push(tripRate.province);
        }

        if (!state.cities.includes(tripRate.city)) {
          {
            state.cities.push(tripRate.city);
          }
        }
      });
    },
    addTripRate(state, newTripRate) {
      state.tripRates.push(newTripRate);
      if (!state.provinces.includes(newTripRate.province)) {
        state.provinces.push(newTripRate.province);
      }

      if (!state.cities.includes(newTripRate.city)) {
        state.cities.push(newTripRate.city);
      }
    },
    deleteTripRate(state, tripRateId) {
      const idx = state.tripRates.find(
        (tripRate) => tripRate.id === tripRateId
      );
      state.tripRates.splice(idx, 1);
    },
    updateTripClientName(state, { newName, prevName }) {
      state.tripRates.forEach((tripRate) => {
        if (tripRate.client_name === prevName) {
          tripRate.client_name = newName;
        }
      });
    }
  },
  actions: {
    async loadTripRates(context) {
      const loadedTripRates = await httpGetAllTripRates();
      context.commit('setTripRates', loadedTripRates);
    },
    addTripRate(context, newTripRate) {
      context.commit('addTripRate', newTripRate);
    },
    deleteTripRate(context, tripRateId) {
      context.commit('deleteTripRate', tripRateId);
    },
    updateTripClientName(context, details) {
      context.commit('updateTripClientName', details);
    }
  },
  getters: {
    tripRates(state) {
      return state.tripRates;
    },
    getTripRatesByCompanyName(state) {
      return function (companyName) {
        return state.tripRates.filter((tripRate) => {
          return tripRate.client_name === companyName;
        });
      };
    },
    provinces(state) {
      return state.provinces;
    },
    cities(state) {
      return state.cities;
    }
  }
};
