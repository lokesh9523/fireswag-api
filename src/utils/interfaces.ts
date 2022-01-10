export interface SocketEventFormat {
  type: string,
  message: string,
  url: string
}

export interface AccountJwtObject {
  _id: string,
  full_name: string,
  role_id: string,
  role_type: string,
}