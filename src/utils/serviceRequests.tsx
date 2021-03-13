// todo: create add-ons/plugins system for additional server side functional of components
import apiFactory, { Api } from '../redux/modules/apiFactory';

const BACKEND_SERVER_API_URL = process.env['NODE_ENV'] === 'development' ? 'http://127.0.0.1:8000/api/v1/' : '/api/v1/';

const api: Api = apiFactory(BACKEND_SERVER_API_URL);

// TODO move from mysql
// export const makeServiceRequest = (data: any, type: string) => {
//   const url = `studio/material-service-request/?type=${type}`;
//   return api.post(url, data);
// };

export const uploadImage = (image: any, materialUuid: string) => {
  const url = `studio/images/`;
  const data = new FormData();
  data.append('image', image, image.name);
  data.append('material', materialUuid);
  data.append('name', image.name || 'image');
  return api.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
