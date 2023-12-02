import { httpGetAllBillingTrips } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      billingTrips: []
    };
  },
  mutations: {
    setBillingTrips(state, newBillingTrips) {
      state.billingTrips = newBillingTrips;
    },
    addBillingTrip(state, newBillingTrip) {
      state.billingTrips.push(newBillingTrip);
    },
    deleteBillingTrip(state, billingId) {
      const idx = state.billingTrips.findIndex(
        (billingTrip) => billingTrip.billingId === billingId
      );
      state.billingTrips.splice(idx, 1);
    }
  },
  actions: {
    async loadBillingTrips(context) {
      const billingTrips = await httpGetAllBillingTrips();
      context.commit('setBillingTrips', billingTrips);
    },
    addBillingTrip(context, addNewBillingTrip) {
      context.commit('addBillingTrip', addNewBillingTrip);
    },
    deleteBillingTrip(context, billingId) {
      context.commit('deleteBillingTrip', billingId);
    }
  },
  getters: {
    billingTrips(state) {
      return state.billingTrips;
    }
  }
};
