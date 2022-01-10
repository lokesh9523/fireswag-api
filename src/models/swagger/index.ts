/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ResponseFormat {
  success: boolean;
  message: string;

  /** Object or Array */
  data?: any;
  count?: number;

  /** String or Object */
  error?: any;
  token?: string;
}

export interface Accounts {
  username?: string;
  password?: string;
  first_name: string;
  last_name: string;
  active?: boolean;
  email: string;

  /** String or object */
  role_id: any;

  /** Date and time */
  created_date?: any;
  phone?: string;
  city?: string;
  state?: string;
}

export interface Sessions {
  /** String or object */
  account_id: any;
  ip_address: string;

  /** Date and time */
  login_time: any;

  /** Date and time */
  last_active_time: any;
  status: "Online" | "Terminated" | "Session Expired" | "Logged Out";
}

export interface Users {
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  active?: boolean;
  email: string;
  created_date?: string;
  phone: string;
  phone_verified?: boolean;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  dob?: string;
  gender?: string;
  ip_address?: string;
}

export interface Roles {
  name: "SUPERADMIN" | "ADMIN" | "USER";
  active: boolean;
  created_date: string;
}

export interface ProductType {
  name: string;
  display_name: string;
  active: boolean;
  created_date?: string;
}

export interface Products {
  /** String or object */
  product_type_id: any;
  name: string;
  active: boolean;
  description: string;
  price: string;
  discount: string;
  total_count: number;
  pre_booking: boolean;
  created_date?: string;
  image_url: string;
  pre_booking_price: string;
}
