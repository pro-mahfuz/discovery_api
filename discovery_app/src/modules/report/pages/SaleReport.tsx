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
  selectAllSaleReport
} from "../../invoice/features/invoiceSelectors.ts";
import { getSaleReport } from "../../invoice/features/invoiceThunks.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";

export default function SaleReport() {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));


  const status = useSelector(selectInvoiceStatus);
  const saleReports = useSelector(selectAllSaleReport);
  console.log("saleReports: ", saleReports);


  useEffect(() => {
    dispatch(getSaleReport());
  }, [dispatch]);


  // Calculate total debit and credit

  const totalSaleReports = useMemo(() => {
  return saleReports.reduce(
    (acc, item) => {
      const total = Number(item.price) * Number(item.quantity) || 0;
      const vatAmount = (total * Number(item.invoice?.vatPercentage)) / 100 ;

      const totalBill = total + vatAmount;

      acc.totalBill += totalBill;

      acc.nonVatTotal += item.invoice?.isVat === false ? (total) : 0;
      acc.vatTotal += item.invoice?.isVat === true ? (total + vatAmount) : 0;

      return acc;
    },
    { totalBill: 0, nonVatTotal: 0, vatTotal: 0, } // initial accumulator
  );
}, [saleReports]);



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
                        Sales Report
                    </h6>
                  </div>
                </div>
              </div>
            

              <Table>
                <TableHeader className="border border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Container</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Customer</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Item</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Unit</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Price</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Qty</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">vat(%)</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Total</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Total Amount (Non-Vat)</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Total Amount (Vat)</TableCell>
                    {/* <TableCell isHeader className="text-center px-4 py-2">Received Amount</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Due Amount</TableCell> */}
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === 'loading' ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : saleReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    saleReports.map((item, index) => (
                          
                          <TableRow>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {index + 1}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.invoice?.date}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.container?.containerNo}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.invoice?.party?.name}
                            </TableCell>
              
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.name}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.unit}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.price}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.quantity}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.invoice?.vatPercentage}
                            </TableCell>
                            
                            
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {(item.price * item.quantity) + ((item.price * item.quantity) * Number(item.invoice?.vatPercentage) / 100)}
                            </TableCell>
                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.invoice?.isVat === false ? item.price * item.quantity : 0}
                            </TableCell>


                            <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                {item.invoice?.isVat === true ? item.price * item.quantity + (item.price * item.quantity * Number(item.invoice?.vatPercentage))/ 100 : 0}
                            </TableCell>

                          </TableRow>
                            
                        ))
                      
                  )}
                </TableBody>
                <TableFooter className="border border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader colSpan={8} className="text-center px-4 py-2">Total Summany:</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{""}</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.totalBill}</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.nonVatTotal}</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">{totalSaleReports.vatTotal}</TableCell>
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
