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
    statck = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
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
