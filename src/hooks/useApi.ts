import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { logout } from "./useLogin";

type execApiProps = {
  url: string;
  data: object;
  method?: string;
  isAuthApi?: boolean;
  needLogout?: boolean;
  isCrmApi?: boolean;
};

export const execApi = async <T>({
  url,
  data,
  method,
  isAuthApi,
  needLogout = true,
  isCrmApi,
}: execApiProps): Promise<AxiosResponse<T>> => {
  let api = getApiUrl(isAuthApi, isCrmApi);

  const hasAuthToken = localStorage.getItem("token");
  let header: AxiosRequestConfig = {};
  if (hasAuthToken) {
    header = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
    };
  } else {
    header = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  let execution;
  if (method === "POST") execution = axios.post(`${api}${url}`, data, header);
  else if (method === "PUT")
    execution = axios.put(`${api}${url}`, data, header);
  else if(method === 'DELETE') execution = axios.delete(`${api}${url}`, header);
  else execution = axios.get(`${api}${url}`, header);
  try {
    const response = await execution;
    return response;
  } catch (error: any) {
    let statusCode: number | undefined;
    console.log({err: error})
    console.log(error)
    if (error.response) {
      statusCode = error.response.status;
    } else {
      console.log("Erro desconhecido")
      console.log(error)
      throw error;
    }

    console.log(statusCode, needLogout);

    if (statusCode === 401 && needLogout) {
      await logout()
    }
    
    throw error

  }
};

type execPrcProps = {
  url: string;
  prc: string;
  data: object;
  method: string;
  needLogout?: boolean;
};

export const execPrc = async ({
  data,
  method,
  prc,
  url,
  needLogout = true,
}: Readonly<execPrcProps>): Promise<AxiosResponse<[]>> => {
  let header: AxiosRequestConfig = {};
  const hasAuthToken = localStorage.getItem("token");
  if (hasAuthToken) {
    header = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
        Codigo: prc,
      },
    };
  } else {
    header = {
      headers: {
        "Content-Type": "application/json",
        Codigo: prc,
      },
    };
  }
  try {
    let execution;
    if (method === "POST")
      execution = axios.post(
        `${import.meta.env.VITE_URL_DOTCORE}${url}`,
        data,
        header
      );
    else if (method === "PUT")
      execution = axios.put(
        `${import.meta.env.VITE_URL_DOTCORE}${url}`,
        data,
        header
      );
    // else if(method === 'DELETE') execution = axios.delete(`${import.meta.env.VITE_URL_DOTCORE}${url}`,data,header);
    else execution = axios.get(`${import.meta.env.VITE_URL_DOTCORE}${url}`);

    const response = await execution;
    return response;
  } catch (error: any) {
    console.log(error);
    if (error.code == "ERR_NETWORK") {
      throw error;
    } else if (error.response.status == 401 && needLogout) {
      await logout()
    }
    throw error;
  }
};

function getApiUrl(isAuthApi?: boolean, isCrmApi?: boolean): string {
  console.log(import.meta.env.VITE_URL_CRM_DOTCORE, import.meta.env.VITE_URL_AUTH_DOTCORE, import.meta.env.VITE_URL_DOTCORE)
  if (isCrmApi) {
    return import.meta.env.VITE_URL_CRM_DOTCORE;
  }
  if (isAuthApi) {
    return import.meta.env.VITE_URL_AUTH_DOTCORE;
  }
  return import.meta.env.VITE_URL_DOTCORE;
}
