import { User } from "./users/user.entity";

const entities = [
  User
];

export {
  User
};
export default entities;

export class BpmResponse {
  success: boolean;
  data: any;
  errors: string[];
  constructor(success: boolean, data: any, errors?: string[]) {
      this.success = success;
      this.data = data;
      this.errors = errors;
  }
}

export enum ResponseStauses {
  NotFound = 'Data not found',
  SuccessfullyCreated = 'Data successfully created',
  SuccessfullyUpdated = 'Data successfully updated',
  SuccessfullyDeleted = 'Data successfully deleted',
  CreateDataFailed = 'Create data failed',
  UpdateDataFailed = 'Update data falied',
  DeleteDataFailed = 'Delete data falied',
  ExistingData = 'Existing data',
  DataContains = 'Data Contains'
} 