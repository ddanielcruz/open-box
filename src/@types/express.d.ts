declare namespace Express {
  export interface Request {
    session: import('@api/middleware/auth').Session
  }
}
