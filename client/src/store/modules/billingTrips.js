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
    },
    addBillingTrip(state, newBillingTrip) {
      state.billingTrips.push(newBillingTrip);
    }
  },
  actions: {
    async loadBillingTrips(context) {
      const billingTrips = await httpGetAllBillingTrips();
      context.commit('setBillingTrips', billingTrips);
    },
    addBillingTrip(context, addNewBillingTrip) {
      context.commit('addBillingTrip', addNewBillingTrip);
    }
  },
  getters: {
    billingTrips(state) {
      return state.billingTrips;
    }
  }
}