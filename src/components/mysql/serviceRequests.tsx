// todo: create add-ons/plugins system for additional server side functional of components
import apiFactory, { Api } from '../../redux/modules/apiFactory';

const BACKEND_SERVER_API_URL = process.env['NODE_ENV'] === 'development' ? 'http://127.0.0.1:8000/api/v1/' : '/api/v1/';

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

export const makeServiceRequest = (data: any, type: string) => {
  const url = `studio/material-service-request/?type=${type}`;
  return api.post(url, data);
};
