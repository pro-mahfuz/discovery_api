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

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import {
  selectInvoiceStatus,
  selectSaleReport
} from "../../invoice/features/invoiceSelectors.ts";
import { getSaleReport } from "../../invoice/features/invoiceThunks.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";

export default function SaleReport() {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));


  const status = useSelector(selectInvoiceStatus);
  const saleReports = useSelector(selectSaleReport(0));
  console.log("saleReports: ", saleReports);


  useEffect(() => {
    dispatch(getSaleReport());
  }, [dispatch]);



  return (
    <>
      <PageMeta
        title="Stock Report"
        description="Stock Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Stock Report" />

      {/* Print Button */}
      <div className="mb-4 flex justify-end print:hidden">
          <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
          Print Stock
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        
                    </p>
                  </div>
                </div>
              </div>
            

              <Table>
                <TableHeader className="border border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Date</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Customer</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Item</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Qty</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Unit</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Price</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Sub-Total</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">vat(%)</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Grand Total</TableCell>
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
                    saleReports.map((report, index) => (
                      <TableRow key={index} className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        
                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.date}
                        </TableCell>
                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.party?.name}
                        </TableCell>

                        <TableCell>
                            <Table>
                                {report.items.map((item) => (
                                    <TableRow>
                                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {item.container?.stockUnit}
                                        </TableCell>
                                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {item.price}
                                        </TableCell>
                                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {item.subTotal}
                                        </TableCell>
                                    </TableRow>
                                    
                                ))}
                                
                            </Table>
                        </TableCell>


                        
                        

                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.vatPercentage}
                        </TableCell>
                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.grandTotal}
                        </TableCell>
                        {/* <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.invoice?.totalAmount}
                        </TableCell>
                        <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {report.invoice?.totalAmount}
                        </TableCell> */}


                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
