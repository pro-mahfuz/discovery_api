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
  TableFooter,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import {
  selectInvoiceStatus,
  selectAllSalePaymentReport
} from "../../invoice/features/invoiceSelectors.ts";
import { getSalePaymentReport } from "../../invoice/features/invoiceThunks.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";

export default function SalePaymentReport() {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));


  const status = useSelector(selectInvoiceStatus);
  const salePaymentReports = useSelector(selectAllSalePaymentReport);
  console.log("salePaymentReports: ", salePaymentReports);


  useEffect(() => {
    dispatch(getSalePaymentReport());
  }, [dispatch]);


  // Calculate total debit and credit

  const totalSaleReports = useMemo(() => {
  return salePaymentReports.reduce(
    (acc, payment) => {
      acc.billAmount += Number(payment.grandTotal);
      acc.paidAmount += Number(payment.totalPaidAmount);

      return acc;
    },
    { billAmount: 0, paidAmount: 0 } // initial accumulator
  );
}, [salePaymentReports]);



  return (
    <>
      <PageMeta
        title="Sale Report"
        description="Sale Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Sale Report" />

      {/* Print Button */}
      <div className="mb-4 flex justify-end print:hidden">
          <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
          Print Report
          </button>
      </div>

      <div id="print-section">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full">

              <div className="p-5 rounded-2xl lg:p-6">
                <div className="flex flex-row items-center text-center gap-5 xl:flex-row xl:justify-between">
                  <div className="flex flex-col items-center w-full gap-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {user?.business?.businessName}
                    </h4>
                    {user?.business?.trnNo && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            TRN No: {user.business.trnNo}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Address: {user?.business?.address} , Email: {user?.business?.email} , Phone: {(user?.business?.phoneCode ?? '') + user?.business?.phoneNumber}
                    </p>
                    <h6 className="border border-gray-500 p-1 rounded text-sm font-semibold text-gray-800 dark:text-white/90 mt-5">
                        Customer Payment Report
                    </h6>
                  </div>
                </div>
              </div>
            

              <Table>
                <TableHeader className="border border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Reference No</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Customer</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Amount (Bill)</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Amount (Paid)</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Amount (Due)</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === 'loading' ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : salePaymentReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    salePaymentReports.map((invoice, index) => (
                          
                          <TableRow>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {index + 1}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {invoice?.date}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {invoice.invoiceNo}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {invoice.party?.name}
                            </TableCell>
              
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {invoice.grandTotal}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {invoice.totalPaidAmount}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {Number(invoice.grandTotal) - Number(invoice.totalPaidAmount)}
                            </TableCell>

                          </TableRow>
                            
                        ))
                      
                  )}
                </TableBody>
                <TableFooter className="border border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader colSpan={4} className="text-center px-4 py-2">Total Summany:</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.billAmount}</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.paidAmount}</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.billAmount - totalSaleReports.paidAmount}</TableCell>
                    {/* <TableCell isHeader className="text-center px-4 py-2">Received Amount</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Due Amount</TableCell> */}
                  </TableRow>
                </TableFooter>
              </Table>

              
              
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
