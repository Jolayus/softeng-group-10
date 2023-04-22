import { httpGetAllTripRates } from '../requests/requests';

let tripRatesModel = [];

tripRatesModel.push(...(await httpGetAllTripRates()));

function getTripRatesModel() {
  return tripRatesModel;
}

export { getTripRatesModel };
