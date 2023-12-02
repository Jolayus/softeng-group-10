import { httpGetAllBillingTrips } from "../../requests/requests";

export default {
  namespaced: true,
  state() {
    return {
      billingTrips: []
    }
  },
  mutations: {
    setBillingTrips(state, newBillingTrips) {
      state.billingTrips = newBillingTrips;
    }
  },
  actions: {
    async loadBillingTrips(context) {
      const billingTrips = await httpGetAllBillingTrips();
      context.commit('setBillingTrips', billingTrips);
    }
  },
  getters: {
    billingTrips(state) {
      return state.billingTrips;
    }
  }
}