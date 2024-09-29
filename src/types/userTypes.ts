export interface BaseUser {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
  userType?: string;
  userRole?: string;
  propertyIds?: number[];
}

export interface User {
  email: string;
  password: string;
}


export interface UserWithId extends BaseUser {
  id: number; 
  status?: string;
}

export interface RegisterUser extends BaseUser {
  name: string;
  phoneNumber: string;
  userType: string;
  userRole: string;
  propertyIds: number[];
}

export interface UpdateUser extends Partial<BaseUser> {}
