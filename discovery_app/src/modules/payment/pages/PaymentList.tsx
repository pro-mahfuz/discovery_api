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

import { Payment } from "../features/paymentTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import {
  selectPaymentStatus,
  selectAllPayment,

} from "../features/paymentSelectors.ts";
import { fetchAll, destroy } from "../features/paymentThunks.ts";

export default function InvoiceList() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const payments = useSelector(selectAllPayment);
  const status = useSelector(selectPaymentStatus);
console.log("payments- ", payments);
  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return payments.filter(
      (p) =>
        p.paymentType
    );
  }, [payments, filterText]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleView = (payment: Payment) => {
    navigate(`/payment/${payment.id}/view`);
  };

  const handleEdit = (payment: Payment) => {

    navigate(`/payment/${payment.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;

    try {
      // You can implement a deleteSupplier thunk and use it here:
      await dispatch(destroy(selectedPayment.id!)).unwrap();
      toast.success("Payment deleted successfully");
      closeAndResetModal();
    } catch (error) {
      toast.error("Failed to delete payment");
    }
  };

  const closeAndResetModal = () => {
    setSelectedPayment(null);
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
        title="Payment List"
        description="Invoice Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Payment List" />

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            <SearchControl value={filterText} onChange={setFilterText} />

            <Table>
              <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Reference No</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Category</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Payment Type</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Invoice Ref</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Party Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Amount</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Payment Method</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Currency</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Created By</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Updated By</TableCell>
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
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((payment, index) => (
                    <TableRow key={payment.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.paymentRefNo}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.category?.name}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.paymentType}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.invoiceRefId}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.party?.name}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.amountPaid}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.currency}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.createdByUser}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.updatedByUser}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none">
                            Actions
                            <ChevronDownIcon className="h-4 w-4 text-white" />
                          </MenuButton>

                          <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-sky-500 ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {/* <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleView(payment)}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    View
                                  </button>
                                )}
                              </MenuItem> */}
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleEdit(payment)}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
                                      setSelectedPayment(payment);
                                      openModal();
                                    }}
                                    className={`${active ? 'bg-red-100 text-red-700' : 'text-red-600'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
        title="Are you sure you want to delete this supplier?"
        width="400px"
        onCancel={closeAndResetModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
