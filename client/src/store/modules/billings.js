import { httpGetAllBillings } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      billings: []
    };
  },
  mutations: {
    setBillings(state, newBillings) {
      state.billings = newBillings;
    },
    addBilling(state, newBilling) {
      state.billings.push(newBilling);
    },
    deleteBilling(state, billingId) {
      const idx = state.billings.findIndex(
        (billing) => billing.id === billingId
      );
      state.billings.splice(idx, 1);
    }
  },
  actions: {
    async loadBillings(context) {
      const loadedBillings = await httpGetAllBillings();

      const billingTrips = context.rootGetters['billingTrips/billingTrips'];

      loadedBillings.forEach((loadedBilling) => {
        loadedBilling.trips = [];
        loadedBilling.totalFee = 0;

        billingTrips.forEach((billingTrips) => {
          if (billingTrips.billingId === loadedBilling.id) {
            loadedBilling.trips.push(billingTrips);
            loadedBilling.totalFee += billingTrips.fee;
          }
        });
      });
      
      context.commit('setBillings', loadedBillings);
    },
    addBilling(context, newBilling) {
      context.commit('addBilling', newBilling);
    },
    deleteBilling(context, billingId) {
      context.commit('deleteBilling', billingId);
    }
  },
  getters: {
    billings(state) {
      return state.billings;
    }
  }
};
