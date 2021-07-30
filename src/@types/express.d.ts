declare namespace Express {
  export interface Request {
    session: import('@api/middleware/auth').Session
  }

  namespace Multer {
    interface File extends Multer.File {
      key: string
      location?: string
    }
  }
}
