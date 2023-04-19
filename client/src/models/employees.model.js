import { httpGetEmployees } from '../requests/requests';

const employeesModel = [];

employeesModel.push(...(await httpGetEmployees()));

function getEmployeesModel() {
  return employeesModel;
}

export { getEmployeesModel };
