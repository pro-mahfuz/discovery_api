export interface Permission {
  id: string;
  name: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}


export interface Role {
  id: number;
  name: string;
  action: string;
  Permission?: Permission[];
}

export interface Profile {
  fullName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  contactEmail: string;
  countryCode: string;
  phoneCode: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  profilePicture: string | File;
}

export interface BaseUser {
  name: string;
  email: string;
  countryCode: string;
  phoneCode: string;
  phoneNumber: string;
  isActive?: boolean;
}

export interface User extends BaseUser {
  id: number;
  Role?: Role;
}

export interface UpdateUser extends BaseUser {
  id: number;
  Role?: Role;
}

interface BaseUserRequest extends BaseUser {
  roleId: number;
}

export interface CreateUserRequest extends BaseUserRequest {
  password: string;
}

export interface UpdateUserRequest extends BaseUserRequest {
  id: number;
  password?: string;
}

export interface UserProfile extends User {
  Profile?: Profile;
}

export interface UserState {
  users: User[];
  profile: UserProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


