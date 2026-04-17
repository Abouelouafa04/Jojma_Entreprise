export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  // Low-risk helper to normalise errors for controllers/middlewares
  static handle(error: unknown) {
    if (error instanceof AppError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        isOperational: error.isOperational
      };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: 'Unknown error' };
  }
}

export default AppError;
