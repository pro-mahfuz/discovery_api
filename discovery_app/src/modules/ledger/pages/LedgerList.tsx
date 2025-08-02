import { useMemo, useState, useEffect } from "react";

import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import CurrencyInvoice from "./VoucherInvoice.tsx";
import CurrencyPayment from "./VoucherPaymen.tsx";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal.tsx";
import { useModal } from "../../../hooks/useModal.ts";

import { Ledger } from "../features/ledgerTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchAll } from "../features/ledgerThunks.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectLedgers } from "../features/ledgerSelectors.ts";
import { destroy } from "../../invoice/features/invoiceThunks.ts";
import { destroy as PaymentDestroy } from "../../payment/features/paymentThunks.ts";
import { useParams } from "react-router";
// import { useNavigate } from "react-router-dom";


export default function CustomerLedger() {
  const { categoryId } = useParams();
  const partyId = 0;
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectUser);
  const ledgers = useSelector(selectLedgers(Number(authUser?.business?.id), Number(categoryId), partyId));
  
  const [selectedTab, setSelectedTab] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const [editingLedgerId, setEditingLedgerId] = useState<number | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  useEffect(() => {
    if (editingPaymentId) {
      setSelectedTab(1); // Open Payment tab
    } else if (editingLedgerId) {
      setSelectedTab(0); // Open Invoice tab
    }
  }, [editingLedgerId, editingPaymentId]);

  useEffect(() => {
      dispatch(fetchAll());
  }, [dispatch]);

  // Edit handler
  const handleEdit = (ledger: Ledger) => {
    if(ledger.transactionType == "purchase" || ledger.transactionType == "sale"){
      setEditingLedgerId(Number(ledger.referenceId));
      setSelectedTab(0);
    }
    if(ledger.transactionType == "payment_in" || ledger.transactionType == "payment_out"){
      setEditingPaymentId(Number(ledger.referenceId));
      setSelectedTab(1);
    }
  };

  // Delete handler
  const handleDelete = async () => {

    if(editingLedgerId) {
      console.log("editingLedgerId: ",editingLedgerId);
      await dispatch(destroy(editingLedgerId));
    }

    if(editingPaymentId) {
      console.log("editingPaymentId: ",editingPaymentId);
      await dispatch(PaymentDestroy(editingPaymentId));
    }

    closeAndResetModal();
    window.location.reload();
    //navigate("/customers/ledger");
  };

  const closeAndResetModal = () => {
    setEditingLedgerId(null);
    setEditingPaymentId(null);
    closeModal();
  };

  // Filter users by name/email
  const filteredLedgers = useMemo(() => {
    return ledgers.filter((ledger) =>
      ledger.transactionType.toLowerCase().includes(filterText.toLowerCase()) ||
      String(ledger.referenceId).toLowerCase().includes(filterText.toLowerCase()) ||
      ledger.party?.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [ledgers, filterText]);

  // Sort by ID
  const sortedLedgers = useMemo(() => {
    return [...filteredLedgers].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [filteredLedgers]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedLedgers.length / itemsPerPage) || 1;

  // Paginate
  const paginatedLedgers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLedgers.slice(start, start + itemsPerPage);
  }, [sortedLedgers, currentPage, itemsPerPage]);

  // Calculate total debit and credit
  const {
    purchaseDebit,
    purchaseCredit,
    saleDebit,
    saleCredit,
    purchaseBalance,
    saleBalance,
    closeBalance,
  } = useMemo(() => {
    return sortedLedgers.reduce(
      (totals, ledger) => {
        const debit = Number(ledger.debit) || 0;
        const credit = Number(ledger.credit) || 0;

        if (ledger.transactionType === "purchase" || ledger.transactionType === "payment_out") {
          totals.purchaseDebit += debit;
          totals.purchaseCredit += credit;
        } else if (ledger.transactionType === "sale" || ledger.transactionType === "payment_in") {
          totals.saleDebit += debit;
          totals.saleCredit += credit;
        }

        // Calculate balances
        totals.purchaseBalance =  totals.purchaseCredit - totals.purchaseDebit;
        totals.saleBalance = totals.saleCredit - totals.saleDebit;
        totals.closeBalance = (totals.saleBalance) + (totals.purchaseBalance);

        return totals;
      },
      {
        purchaseDebit: 0,
        purchaseCredit: 0,
        saleDebit: 0,
        saleCredit: 0,
        purchaseBalance: 0,
        saleBalance: 0,
        closeBalance: 0,
      }
    );
  }, [sortedLedgers]);


  


  return (
    <>
      <PageMeta
        title="Voucher & Ledger"
        description="Voucher & Ledger with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Voucher & Ledger" />

      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        <TabList className="flex gap-4 mb-2">
          <Tab className="rounded-full px-3 py-1 text-sm font-semibold text-black bg-gray-300 data-selected:bg-sky-500 data-selected:text-white">
            Add Purchase/Sale
          </Tab>
          <Tab className="rounded-full px-3 py-1 text-sm font-semibold text-black bg-gray-300 data-selected:bg-sky-500 data-selected:text-white">
            Add Payment
          </Tab>
        </TabList>

        <TabPanels>
          {/* PURCHASE/SALE PANEL */}
          <TabPanel className="space-y-6">
            <div className="p-4 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 space-y-4">
              <h2 className="text-lg font-semibold">Add Purchase/Sale</h2>
              <CurrencyInvoice editingLedgerId={editingLedgerId ?? 0} ledgerPartyId={0}/>
            </div>
          </TabPanel>

          {/* PAYMENT PANEL */}
          <TabPanel>
            <div className="p-4 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 space-y-4">
              <h2 className="text-lg font-semibold">Add Payment</h2>
              <CurrencyPayment editingPaymentId={editingPaymentId ?? 0} paymentPartyId={0}/>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          {/* Search Input */}
          <SearchControl value={filterText} onChange={setFilterText} />
          
          <div className="max-w-full mx-4">
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
                  {/* <TableCell isHeader className="text-center px-4 py-2">Category</TableCell> */}
                  <TableCell isHeader className="text-center px-4 py-2">Transaction Type</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Reference</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Party Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Description</TableCell>
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
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : paginatedLedgers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLedgers.map((ledger, index) => (
                    <TableRow key={ledger.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { index + 1 }
                      </TableCell>
                      {/* <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        { ledger.category?.name }
                      </TableCell> */}
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {ledger.transactionType}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {'P'+String(ledger.referenceId).padStart(6, '0')}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {ledger.date}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {ledger.party?.name}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          {ledger.transactionType == "purchase" || ledger.transactionType == "sale" ? ledger.description.split('<br />').map((line, idx) => (
                            <span key={idx}>
                              {line}
                              <br />
                            </span>
                          )): ledger.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                       { ledger.transactionType === "purchase" || ledger.transactionType === "payment_out" ? ledger.debit : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                       { ledger.transactionType === "purchase" ? ledger.credit : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                       { ledger.transactionType === "sale" ? ledger.debit : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                       { ledger.transactionType === "sale" || ledger.transactionType === "payment_in" ? ledger.credit : 0 }
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                       <Button size="sm" type="button" variant="outline" onClick={() => handleEdit(ledger)}>
                        <svg className="cursor-pointer hover:fill-sky-500 dark:hover:fill-sky-500 fill-gray-700 dark:fill-gray-400" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M17.0911 3.53206C16.2124 2.65338 14.7878 2.65338 13.9091 3.53206L5.6074 11.8337C5.29899 12.1421 5.08687 12.5335 4.99684 12.9603L4.26177 16.445C4.20943 16.6931 4.286 16.9508 4.46529 17.1301C4.64458 17.3094 4.90232 17.3859 5.15042 17.3336L8.63507 16.5985C9.06184 16.5085 9.45324 16.2964 9.76165 15.988L18.0633 7.68631C18.942 6.80763 18.942 5.38301 18.0633 4.50433L17.0911 3.53206ZM14.9697 4.59272C15.2626 4.29982 15.7375 4.29982 16.0304 4.59272L17.0027 5.56499C17.2956 5.85788 17.2956 6.33276 17.0027 6.62565L16.1043 7.52402L14.0714 5.49109L14.9697 4.59272ZM13.0107 6.55175L6.66806 12.8944C6.56526 12.9972 6.49455 13.1277 6.46454 13.2699L5.96704 15.6283L8.32547 15.1308C8.46772 15.1008 8.59819 15.0301 8.70099 14.9273L15.0436 8.58468L13.0107 6.55175Z" fill=""></path>
                        </svg>
                       </Button>
                       <Button size="sm" className="ml-1" type="button" variant="outline" 
                          onClick={() => {
                            if (["purchase", "sale"].includes(ledger?.transactionType)) {
                              setEditingLedgerId(ledger.referenceId);
                            }
                            if (["payment_in", "payment_out"].includes(ledger?.transactionType)) {
                              setEditingPaymentId(ledger.referenceId);
                            }
                            openModal();
                          }}>
                        <svg className="cursor-pointer hover:fill-error-500 dark:hover:fill-error-500 fill-gray-700 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z" fill=""></path>
                        </svg>
                       </Button>
                      </TableCell>
                    </TableRow>
                  ))
                  
                )}
                <TableRow>
                  <TableCell colSpan={6} isHeader className="border border-gray-500 text-center px-4 py-1">Total:</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{purchaseDebit.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{purchaseCredit.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{saleDebit.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{saleCredit.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{' '}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} isHeader className="border border-gray-500 text-center px-4 py-1">Balance:</TableCell>
                  <TableCell colSpan={2} isHeader className="border border-gray-500 text-center px-4 py-1">{purchaseBalance.toFixed(2)}</TableCell>
                  <TableCell colSpan={2} isHeader className="border border-gray-500 text-center px-4 py-1">{saleBalance.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{' '}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} isHeader className="border border-gray-500 text-center px-4 py-1">Close Balance:</TableCell>
                  <TableCell colSpan={4} isHeader className="border border-gray-500 text-center px-4 py-1">{closeBalance.toFixed(2)}</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">{' '}</TableCell>
                </TableRow>
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
        title="Are you sure you want to delete ?"
        width="400px"
        onCancel={closeAndResetModal}
        onConfirm={handleDelete}
      />
      
    </>
  );
}
