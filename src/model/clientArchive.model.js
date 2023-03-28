const clientModelArchive = [];

function getClientModelArchive() {
    return clientModelArchive;
}

function addClientArchive(client) {
    clientModelArchive.push(client);
}

export {
    getClientModelArchive,
    addClientArchive
}