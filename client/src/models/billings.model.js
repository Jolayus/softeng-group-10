import store from '../store';

function getBillingsModel() {
  return store.getters['billings/billings'];
} 

export { getBillingsModel };
