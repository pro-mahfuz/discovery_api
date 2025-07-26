import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../../../components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal.tsx";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal.ts";
import CurrencyPurchase from "./CurrencyPurchase.tsx";

// ✅ Define a type for customer
interface Customer {
  id: number;
  date: string;
  transactionFor: string;
  transactionType: string;
  description: string,
  entryType: string;
  amount: number;
}

// ✅ Replace any[] with Customer[]
const mockCustomers: Customer[] = [
  {
    id: 1,
    date: "20-07-2025",
    transactionFor: "currency",
    transactionType: "purchase",
    description: "Purchase currency (AED), rate: 33.50, total 5000",
    entryType: "credit",
    amount: 5000
  },
  {
    id: 2,
    date: "20-07-2025",
    transactionFor: "currency",
    transactionType: "sale",
    description: "Purchase currency (AED), rate: 33.50, total 2000",
    entryType: "debit",
    amount: 2000
  },
  {
    id: 3,
    date: "20-07-2025",
    transactionFor: "gold",
    transactionType: "purchase",
    description: "Purchase gold, rate: 33.50, total 7000",
    entryType: "credit",
    amount: 7000
  },
  {
    id: 3,
    date: "20-07-2025",
    transactionFor: "gold",
    transactionType: "payment made",
    description: "paid 4000 from 7000",
    entryType: "debit",
    amount: 4000
  },
];

export default function CustomerLedger() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  
    const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.transactionFor.includes(filterText) ||
        c.transactionType.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [customers, filterText]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const handleLedger = (id: number) => {
    navigate(`/customers/ledger/${id}`);
  };


  const handleEdit = (customer: Customer) => {
    console.log("Editing customer:", customer);
    navigate(`/customer/edit/${customer.id}`);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    console.log("Deleting customer ID:", selectedCustomer);
    try {
      // await dispatch(deleteCustomer(selectedCustomer.id)).unwrap();
      toast.success("Customer deleted successfully");
      closeAndResetModal();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
    
  };

  const closeAndResetModal = () => {
    setSelectedCustomer(null);
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
        title="Customer Ledger"
        description="Customers Ledger with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Customer Ledger" />

      <CurrencyPurchase />
       <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            {/* Search Input */}
            <SearchControl value={filterText} onChange={setFilterText} />

            {/* Table */}
            <Table>
              <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell colSpan={6} isHeader className="border border-gray-500 text-center px-4 py-2">{' '}</TableCell>
                  <TableCell colSpan={2} isHeader className="border border-gray-500 text-center px-4 py-2">Purchase</TableCell>
                  <TableCell colSpan={2} isHeader className="border border-gray-500 text-center px-4 py-2">Sale</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-2">{' '}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Transaction For</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Transaction Type</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Description</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Entry Type</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-2">Debit</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-2">Credit</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-2">Debit</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-2">Credit</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                    <TableRow key={customer.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.date}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.transactionFor}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.transactionType}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.description}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.entryType}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { customer.transactionFor == 'currency' && customer.entryType == 'debit' ? customer.amount : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { customer.transactionFor == 'currency' && customer.entryType == 'credit' ? customer.amount : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { customer.transactionFor == 'gold' && customer.entryType == 'debit' ? customer.amount : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { customer.transactionFor == 'gold' && customer.entryType == 'credit' ? customer.amount : 0 }
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
                                    onClick={() => handleEdit(customer)}
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
                                        setSelectedCustomer(customer);
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
