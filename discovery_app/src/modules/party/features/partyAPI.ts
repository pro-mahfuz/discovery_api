
import axiosInstance from "../../../api/axios";
import { Party } from './partyTypes';

export const fetchParty = async (type: string) => {
  try {

    const res = await axiosInstance.get(`protected/party/${type}/list`);
    
    console.log('Fetched parties:', res.data.data);
    
    return res.data.data;

  } catch {
      throw new Error('No data available');
  }
};

export const createParty = async (partyData: Party) => {
  try {
    const res = await axiosInstance.post('protected/party/create', partyData);
    return res.data.data;
  } catch {
      throw new Error('No data available');
  }
};

export const fetchPartyById = async (id: number) => {
  try {
    const res = await axiosInstance.get(`protected/party/${id}`);
    return res.data.data;
  } catch {
    throw new Error('Failed to fetch user');
  }
};

export const updateParty = async (id: number, partyData: Party) => {
  try {

    const res = await axiosInstance.put(`protected/party/${id}`, partyData);
    return res.data.data;

  } catch {

    throw new Error('Failed to update party');

  }
};

export const deleteParty = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/party/${id}/deactive`);
    console.log("Party deleted successfully:", res.data);
    return res.data.data;

  } catch {
    
    throw new Error('Failed to delete party');
  }
};

