import { httpGetAllBatches, httpGetNextId } from '../../requests/requests';

export default {
  namespaced: true,
  state() {
    return {
      batches: [],
      nextId: null
    };
  },
  mutations: {
    setBatches(state, newBatches) {
      state.batches = newBatches;
    },
    addBatch(state, newBatch) {
      state.batches.push(newBatch);
    },
    setNextId(state, nextId) {
      state.nextId = nextId;
    }
  },
  actions: {
    async loadBatches(context) {
      const batches = await httpGetAllBatches();
      context.commit('setBatches', batches);

      batches.forEach((batch) => {
        const { employeeId } = batch;

        const targetEmployee =
          context.rootGetters['employees/getEmployeeById'](employeeId);

        let targetSalary;
        let targetDeduction;

        if (targetEmployee.type.toLowerCase() === 'internal') {
          targetSalary =
            context.rootGetters['salaries/getSalaryByEmployeeId'](employeeId);
          targetDeduction =
            context.rootGetters['deductions/getDeductionByEmployeeId'](
              employeeId
            );
        } else {
          targetSalary =
            context.rootGetters[
              'externalSalaries/getExternalSalaryByEmployeeId'
            ](employeeId);

          targetDeduction =
            context.rootGetters[
              'externalDeductions/getExternalDeductionByEmployeeId'
            ](employeeId);
        }
        targetEmployee.salary = targetSalary;
        targetEmployee.deduction = targetDeduction;
      });
    },
    async loadNextId(context) {
      const { nextID } = await httpGetNextId();
      context.commit('setNextId', nextID);
    },
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
    },
    nextId(state) {
      return state.nextId;
    }
  }
};
