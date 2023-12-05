export default {
  namespaced: true,
  state() {
    return {
      batches: []
    };
  },
  mutations: {
    setBatches(state, newBatches) {
      state.batches = newBatches;
    },
    addBatch(state, newBatch) {
      state.batches.push(newBatch);
    }
  },
  actions: {
    addBatch(context, newBatch) {
      context.commit('addBatch', newBatch);
    }
  },
  getters: {
    batches(state) {
      return state.batches;
    },
    batchCodes(state) {
      return new Set(state.batches.map((batch) => batch.batchCode));
    },
    getEmployeesIdByBatchCode(state) {
      return function (batchCode) {
        state.batches.map((batch) => {
          if (batch.batchCode === batchCode) {
            return batch.employeeId;
          }
        });
      };
    }
  }
};
