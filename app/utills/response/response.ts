export type ResponseType = {
  message?: string;
  data?: any;
  metaData?: any;
  error?: {
    fieldError?: [] | unknown;
    error?: {
      description?: string;
      stackTrace?: string;
    };
  };
};

export const Response = (responseData: ResponseType) => {
  return responseData;
};
