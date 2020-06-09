import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

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
  // config: {
  //   onError: (error: string) => void;
  // },
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
    //   // console.error(e);
    //   console.log(e);
    // }
    //
    // throw newError;
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
      return axios
        .post(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    patch(path, body, options) {
      return axios
        .patch(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    put(path, body, options) {
      return axios
        .put(API_ROOT + path, body)
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    delete(path, params, options) {
      return axios
        .delete(API_ROOT + path, {
          params,
        })
        .then(response => handleResponse(response))
        .catch(e => handleError(e));
    },
    request(requestConfig, options) {
      return axios
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
