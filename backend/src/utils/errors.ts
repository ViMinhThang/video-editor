export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500, public isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(public details: any) {
    super("Validation Error", 400);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
