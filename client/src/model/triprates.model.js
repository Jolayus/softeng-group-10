let tripRatesModel = [];

// async function getMockData() {
//   const response = await fetch('./src/model/mockTripRatesData.json');
//   const data = await response.json();
//   return data;
// }

// tripRatesModel = await getMockData();

function getTripRatesModel() {
  return tripRatesModel;
}

export { getTripRatesModel };
