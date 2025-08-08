import { useMemo, useState, useEffect } from "react";

import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableFooter,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchAll } from "../features/ledgerThunks.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectLedgerByPartyType } from "../features/ledgerSelectors.ts";
import { useParams } from "react-router";
// import { useNavigate } from "react-router-dom";


export default function LedgerList() {
  const { partyType } = useParams();
  
  
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const authUser = useSelector(selectUser);
  const ledgers = useSelector(selectLedgerByPartyType(Number(authUser?.business?.id), String(partyType)));

  useEffect(() => {
      dispatch(fetchAll());
  }, [dispatch]);

  // Filter users by name/email
  const filteredLedgers = useMemo(() => {
    return ledgers.filter((ledger) =>
      ledger.transactionType.toLowerCase().includes(filterText.toLowerCase()) ||
      String(ledger.invoiceId ?? ledger.paymentId).toLowerCase().includes(filterText.toLowerCase()) ||
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
  type CurrencyTotals = {
    purchaseDebit: number;
    purchaseCredit: number;
    saleDebit: number;
    saleCredit: number;
    purchaseBalance: number;
    saleBalance: number;
    closeBalance: number;
  };

  const ledgerTotalsByCurrency = useMemo(() => {
    return sortedLedgers.reduce<Record<string, CurrencyTotals>>((totals, ledger) => {
      const currency = ledger.currency || 'UNKNOWN';
      const debit = Number(ledger.debit) || 0;
      const credit = Number(ledger.credit) || 0;

      if (!totals[currency]) {
        totals[currency] = {
          purchaseDebit: 0,
          purchaseCredit: 0,
          saleDebit: 0,
          saleCredit: 0,
          purchaseBalance: 0,
          saleBalance: 0,
          closeBalance: 0,
        };
      }

      const current = totals[currency];

      if (ledger.transactionType === "purchase" || ledger.transactionType === "payment_out") {
        current.purchaseDebit += debit;
        current.purchaseCredit += credit;
      } else if (ledger.transactionType === "sale" || ledger.transactionType === "payment_in") {
        current.saleDebit += debit;
        current.saleCredit += credit;
      }

      current.purchaseBalance = current.purchaseCredit - current.purchaseDebit;
      current.saleBalance = current.saleCredit - current.saleDebit;
      current.closeBalance = current.purchaseBalance + current.saleBalance;

      return totals;
    }, {});
  }, [sortedLedgers]);



  return (
    <>
      <PageMeta
        title={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} Ledger List`}
        description="Voucher & Ledger with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} Ledger List`} />

      

      

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          {/* Search Input */}
          <SearchControl value={filterText} onChange={setFilterText} />
          
          <div className="max-w-full mx-4">
            {/* Table */}
            <Table>
              <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Transaction Type</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Reference</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Party Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Description</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Currency</TableCell>

                  
                  {partyType === "supplier" && (
                    <TableCell isHeader className="border border-gray-500 text-center">
                      <Table>
                        <TableRow className="text-center">
                          <TableCell colSpan={2} className="text-center px-4 py-2 font-semibold">Purchase</TableCell>
                        </TableRow>
                        <TableRow className="text-center border-t border-gray-500 px-4">
                          <TableCell className="text-center px-4 py-2">Debit</TableCell>
                          <TableCell className="border-l border-gray-500 text-center px-4 py-2">Credit</TableCell>
                        </TableRow>
                      </Table>
                    </TableCell>
                  )}
                  
                  {partyType === "customer" && (
                    <TableCell isHeader className="border border-gray-500 text-center">
                      <Table>
                        <TableRow className="text-center">
                          <TableCell colSpan={2} className="text-center px-4 py-2 font-semibold">Sale</TableCell>
                        </TableRow>
                        <TableRow className="text-center border-t border-gray-500">
                          <TableCell className="text-center px-4 py-2">Debit</TableCell>
                          <TableCell className="border-l border-gray-500 text-center px-4 py-2">Credit</TableCell>
                        </TableRow>
                      </Table>
                    </TableCell>
                  )}
                  
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
                    <TableRow key={index} className="border-b border-gray-100 dark:border-white/[0.05]">
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
                        {ledger.refNo}
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
                      <TableCell className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                        {ledger.currency}
                      </TableCell>

                      {partyType === "supplier" && (
                        <>
                          <TableCell className="text-center py-2 text-sm">
                            <Table>
                              <TableRow className="text-center py-2">
                                <TableCell className="text-center px-4 py-2">
                                  {["purchase", "payment_out"].includes(ledger.transactionType) ? ledger.debit : 0}
                                </TableCell>
                                <TableCell className="text-center px-4 py-2">
                                  {ledger.transactionType === "purchase" ? ledger.credit : 0}
                                </TableCell>
                              </TableRow>
                            </Table>
                          </TableCell>
                        </>
                      )}

                      {partyType === "customer" && (
                        <>
                          <TableCell className="text-center py-2 text-sm">
                            <Table>
                              <TableRow className="text-center py-2">
                                <TableCell className="text-center px-4 py-2">
                                  {ledger.transactionType === "sale" ? ledger.debit : 0}
                                </TableCell>
                                <TableCell className="text-center px-4 py-2">
                                  {["sale", "payment_in"].includes(ledger.transactionType) ? ledger.credit : 0}
                                </TableCell>
                              </TableRow>
                            </Table>
                          </TableCell>
                        </>
                      )}


                    </TableRow>
                  ))
                  
                )}
                

              </TableBody>

              {Object.entries(ledgerTotalsByCurrency).map(([currency, totals]) => (
                
                  <TableFooter className="border-separate border-spacing-y-2 text-black text-sm dark:bg-gray-800 mt-4">
                    <TableRow><TableCell className="text-center px-4 py-2">{""}</TableCell></TableRow>
                    <TableRow>
                      <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-4 py-2">{currency}</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center">
                        <Table>
                          <TableRow>
                            <TableCell className="flex items-center justify-center text-center border-b border-gray-500 px-4 py-2">
                              Total:
                            </TableCell>
                            <TableCell className="flex items-center justify-center text-center px-4 py-2">
                              Balance:
                            </TableCell>
                          </TableRow>
                        </Table>
                        
                      </TableCell>

                    {partyType === "supplier" && (
                      <TableCell isHeader className="border border-gray-500 text-center">
                        <Table>
                          <TableRow className="text-center border-b border-gray-500 py-2">
                              <TableCell className="text-center px-4 py-2">{totals.purchaseDebit.toFixed(2)}</TableCell>
                              <TableCell className="border-l border-gray-500 text-center px-4 py-2">{totals.purchaseCredit.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow className="text-center py-2">
                              <TableCell colSpan={2} className="text-center px-4 py-2 font-semibold">{totals.purchaseBalance.toFixed(2)}</TableCell>
                          </TableRow>
                        </Table>
                      </TableCell>
                    )}

                    {partyType === "customer" && (
                      <TableCell isHeader className="border border-gray-500 text-center">
                        <Table>
                          <TableRow className="text-center border-b border-gray-500 py-2">
                              <TableCell className="text-center px-4 py-2">{totals.saleDebit.toFixed(2)}</TableCell>
                              <TableCell className="border-l border-gray-500 text-center px-4 py-2">{totals.saleCredit.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow className="text-center px-4 py-2">
                              <TableCell colSpan={2} className="text-center px-4 py-2 font-semibold">{totals.saleBalance.toFixed(2)}</TableCell>
                          </TableRow>
                        </Table>
                      </TableCell>
                    )}
                      
                    </TableRow>
                    
                  </TableFooter>
                
              ))}         
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

    </>
  );
}
