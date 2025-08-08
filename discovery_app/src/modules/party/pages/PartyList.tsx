import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal.ts";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal.tsx";

import { Party } from "../features/partyTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectParties } from "../features/partySelectors.ts";
import { fetchParty, deleteParty } from "../features/partyThunks.ts";

export default function PartyList() {
  const { partyType } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectUser);
  const parties = useSelector(selectParties(Number(authUser?.business?.id), String(partyType)));
  //console.log("parties - ", parties);

  // const allParties = useSelector(selectAllParties);
  // const parties = partyType === "supplier"
  //   ? allParties.filter(p => p.type === "supplier")
  //   : partyType === "customer"
  //   ? allParties.filter(p => p.type === "customer")
  //   : allParties;

  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  useEffect(() => {
    dispatch(fetchParty('all'));
  }, [dispatch]);

  const filteredParties = useMemo(() => {
    return parties.filter(
      (p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()) ||
        p.phoneNumber.includes(filterText) ||
        p.address.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [parties, filterText]);

  const totalPages = Math.ceil(filteredParties.length / itemsPerPage);

  const paginatedParties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParties.slice(start, start + itemsPerPage);
  }, [filteredParties, currentPage, itemsPerPage]);

  const handleLedger = (party: Party) => {
    navigate(`/ledger/1/party/${party.id}`);
  };

  const handleView = (party: Party) => {
    navigate(`/party/view/${party.id}`);
  };

  const handleEdit = (party: Party) => {
    navigate(`/party/edit/${party.id}`);
  };

  const handleDelete = async () => {
    if (!selectedParty) return;
    try {
      await dispatch(deleteParty(selectedParty.id!)).unwrap();
      toast.success("Customer deleted successfully");
      closeAndResetModal();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const closeAndResetModal = () => {
    setSelectedParty(null);
    closeModal();
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <>
      <PageMeta
        title={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} List Table`}
        description="Customers Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} List`} />

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            {/* Search Input */}
            <SearchControl value={filterText} onChange={setFilterText} />

            {/* Table */}
            <Table>
              <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Party Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Phone</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Email</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Opening Balance</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">isActive</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Ledgers</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : paginatedParties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedParties.map((Customer, index) => (
                    <TableRow key={Customer.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {Customer.name}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {Customer.phoneCode+Customer.phoneNumber}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {Customer.email}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {Customer.openingBalance}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {Customer.isActive ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none"
                          onClick={() => handleLedger(Customer)}
                        >
                          Ledger
                        </button>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none">
                            Actions
                            <ChevronDownIcon className="h-4 w-4 text-white" />
                          </MenuButton>

                          <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-sky-500 ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleView(Customer)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    View
                                  </button>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleEdit(Customer)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit
                                  </button>
                                )}
                              </MenuItem>
                              
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      onClick={() => {
                                        setSelectedParty(Customer);
                                        openModal();
                                      }}
                                      className={`${
                                        active ? 'bg-red-100 text-red-700' : 'text-red-600'
                                      } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      Delete
                                    </button>
                                  )}
                                </MenuItem>
                              
                            </div>
                          </MenuItems>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        title="Are you sure you want to delete this user?"
        width="400px"
        onCancel={closeAndResetModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
