import mockClientData from './mockClientData.json';

let clientModel = [];

async function getMockData() {
    return mockClientData;
}

clientModel = await getMockData();

function getClientModel() {
    return clientModel;
}

export {
    getClientModel,
};