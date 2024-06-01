class ApiError extends Error {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  errors: any;

  constructor(
    statusCode = 500,
    message = "Something went Wrong",
    errors = [],
    data = {},
    statck = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
    this.errors = errors;

    if (statck) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
