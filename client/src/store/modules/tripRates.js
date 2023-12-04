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
    deleteTripRate(state, tripRateDetails) {
      const { branch, province, city } = tripRateDetails;
      const idx = state.tripRates.findIndex((tripRate) => {
        return (
          tripRate.branch === branch &&
          tripRate.province === province &&
          tripRate.city === city
        );
      });
      state.tripRates.splice(idx, 1);
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
    deleteTripRate(context, tripRateDetails) {
      context.commit('deleteTripRate', tripRateDetails);
    }
  },
  getters: {
    tripRates(state) {
      return state.tripRates;
    },
    getTripRatesByCompanyName(state) {
      return function (companyName) {
        return state.tripRates.filter(
          (tripRate) => {
            return tripRate.client_name === companyName
          }
        );
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
