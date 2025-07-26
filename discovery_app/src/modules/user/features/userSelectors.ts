import { User, UserProfile } from './userTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectAllUsers = (state: RootState): User[] => state.user.users;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserProfile = (state: RootState): UserProfile | null => state.user.profile;


export const selectUserById = (id: number) => (state: RootState) =>
  state.user.users.find(user => user.id === id);
export const selectUserByEmail = (email: string) => (state: RootState) =>
  state.user.users.find(user => user.email.toLowerCase() === email.toLowerCase());


