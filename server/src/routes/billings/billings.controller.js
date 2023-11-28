const path = require('path');
const Excel = require('exceljs');

const {
  getAllBillings,
  addNewBilling
} = require('../../models/billings.model');

function httpGetBillings(req, res) {
  return res.status(200).json(getAllBillings());
}

function httpPostNewBilling(req, res) {
  const newBilling = req.body;
  addNewBilling(newBilling);

  return res.status(201).json(newBilling);
}

// Download Billing File
function httpGetFile(req, res) {
  const data = req.body;
  const workbook = new Excel.Workbook();
  workbook.xlsx
    .readFile(path.join(__dirname, 'billing-template.xlsx'))
    .then(() => {
      const worksheet = workbook.worksheets[0];

      worksheet.getCell('B9').value = data.company_name.toUpperCase();
      worksheet.getCell('A10').value = data.company_address.toUpperCase();
      worksheet.getCell('H9').value = new Date(data.date);
      worksheet.getCell('G11').value = data.transactionNumber;

      let currentCell = 16;
      data.trips.forEach((trip, index) => {
        worksheet.getCell(`A${currentCell}`).value = index + 1;
        worksheet.getCell(`B${currentCell}`).value = new Date(trip.date);
        worksheet.getCell(
          `D${currentCell}`
        ).value = `SHIPMENT NO.: ${trip.shipmentNumber}`;
        worksheet.getCell(
          `D${currentCell + 1}`
        ).value = `SPO NO.: ${trip.SPONumber}`;
        worksheet.getCell(`H${currentCell}`).value = trip.fee;

        currentCell += 2;
      });

      workbook.xlsx.writeFile(path.join(__dirname, 'output.xlsx')).then(() => {
        res.download(path.join(__dirname, 'output.xlsx'));
      });
    });
}

module.exports = {
  httpGetBillings,
  httpPostNewBilling,
  httpGetFile
};
