
import { Party } from './partyTypes.ts';
import { RootState } from "../../../store/store.ts";
import { createSelector } from 'reselect';

export const selectPartyStatus = (state: RootState) => state.party.status;
export const selectPartyError = (state: RootState) => state.party.error;

export const selectAllParties = (state: RootState): Party[] => state.party.parties || [];

export const selectParties = (businessId: number, partyType: string) =>
  createSelector([selectAllParties], (parties) => {
    if (businessId === 0 && partyType === "all") return parties;
    if (businessId === 0 && partyType)
      return parties.filter(party => party.type === partyType);
    if (businessId > 0 && partyType === "all")
      return parties.filter(party => party.businessId === businessId);
    if (businessId > 0 && partyType)
      return parties.filter(
        party => party.type === partyType && party.businessId === businessId
      );
    return [];
  });

export const selectPartyById = (id: number) => (state: RootState) => state.party.parties.find(party => party.id === id);
export const searchPartyByText = (text: string) => (state: RootState) => {
  const search = text.toLowerCase();
  return state.party.parties.filter(party =>
    party.name.toLowerCase().includes(search) ||
    (party.phoneNumber && party.phoneNumber.toLowerCase().includes(search)) ||
    (party.email && party.email.toLowerCase().includes(search))
  );
};

export const selectAllSuppliers = createSelector(
  [selectAllParties],
  (parties) => parties.filter(party => party.type === 'supplier')
);

export const selectAllCustomers = createSelector(
  [selectAllParties],
  (parties) => parties.filter(party => party.type === 'customer')
);