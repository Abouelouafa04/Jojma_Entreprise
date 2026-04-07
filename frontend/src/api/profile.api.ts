import { AxiosError } from 'axios';
import { axiosInstance } from './api';

export type AccountType = 'creator' | 'company' | 'studio' | 'agency';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  prenom: string | null;
  nom: string | null;
  accountType: AccountType;
  role: 'user' | 'admin';
  phone: string | null;
  location: string | null;
  company: string | null;
  industry: string | null;
  jobTitle: string | null;
  profilePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiSuccess<T> = {
  status: 'success';
  message?: string;
  data: T;
};

export type UpdateProfileDTO = Partial<Pick<
  UserProfile,
  'fullName' | 'phone' | 'location' | 'company' | 'industry' | 'jobTitle' | 'accountType'
>>;

function extractApiMessage(error: unknown): string {
  const err = error as AxiosError<any>;
  return err?.response?.data?.message || err?.message || 'Une erreur est survenue.';
}

export async function getMyProfile() {
  try {
    const res = await axiosInstance.get<ApiSuccess<{ profile: UserProfile }>>('/api/user/profile');
    return res.data.data.profile;
  } catch (error) {
    throw new Error(extractApiMessage(error));
  }
}

export async function updateMyProfile(payload: UpdateProfileDTO) {
  try {
    const res = await axiosInstance.put<ApiSuccess<{ profile: UserProfile }>>('/api/user/profile', payload);
    return res.data;
  } catch (error) {
    throw new Error(extractApiMessage(error));
  }
}

export async function updateMyProfilePhoto(file: File) {
  try {
    const form = new FormData();
    form.append('photo', file);
    const res = await axiosInstance.put<ApiSuccess<{ profile: UserProfile }>>('/api/user/profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractApiMessage(error));
  }
}

export async function deleteMyAccount() {
  try {
    const res = await axiosInstance.delete<ApiSuccess<null>>('/api/user/account');
    return res.data;
  } catch (error) {
    throw new Error(extractApiMessage(error));
  }
}

