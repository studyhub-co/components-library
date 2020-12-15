import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

export type Params = {
  [key: string]: string;
};

export type Options = {
  shouldCamelize: boolean;
};

export type Api = {
  get<T>(path: string, params?: Params, options?: Options): Promise<T>;
  post<T>(path: string, body: any, options?: Options): Promise<T>;
  patch<T>(path: string, body: any, options?: Options): Promise<T>;
  put<T>(path: string, body: any, options?: Options): Promise<T>;
  delete<T>(path: string, params?: Params, options?: Options): Promise<T>;
  request<T>(requestConfig: AxiosRequestConfig, options?: Options): Promise<T>;
};

export default (
  API_ROOT: string,
  config?: {
    // onError: (error: string) => void;
    // sessionId?: string;
  },
) => {
  // const showError = (error: any) => {
  //   config.onError(error.message);
  //   error.apiMessage = error.message; // eslint-disable-line no-param-reassign
  // };

  const handleError = (error: any) => {
    console.log(error);
    // const newError = convertError(error);
    // try {
    //   showError(newError);
    // } catch (e) {
    //   console.log(e);
    // }
    throw error;
  };

  const api: Api = {
    get(path, params, options) {
      return axios
        .get(API_ROOT + path, {
          params,
        })
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    post(path, body, options) {
      const instance = axios.create({
        withCredentials: true,
      });
      return instance
        .post(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    patch(path, body, options) {
      const instance = axios.create({
        withCredentials: true,
      });
      return instance
        .patch(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    put(path, body, options) {
      const instance = axios.create({
        withCredentials: true,
      });
      return instance
        .put(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    delete(path, params, options) {
      const instance = axios.create({
        withCredentials: true,
      });
      return instance
        .delete(API_ROOT + path, {
          params,
        })
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    request(requestConfig, options) {
      const instance = axios.create({
        withCredentials: true,
      });
      return instance
        .request(
          Object.assign(requestConfig, {
            url: API_ROOT + requestConfig.url,
            data: requestConfig.data ? requestConfig.data : null,
          }),
        )
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
  };

  return api;
};

// function convertError(error: AxiosError) {
// }

export function handleResponse(response: AxiosResponse) {
  return response.data;
}
