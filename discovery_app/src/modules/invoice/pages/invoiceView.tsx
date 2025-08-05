import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";


import { fetchParty } from "../../party/features/partyThunks.ts";
import { AppDispatch } from "../../../store/store";
import { selectInvoiceById } from "../features/invoiceSelectors";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";


export default function InvoiceView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchParty("all"));
    }, [dispatch]);

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));
    const invoice = useSelector(selectInvoiceById(Number(id)));
    console.log("invoiceData: ", user);

    const handlePrint = () => {
        window.print();
    };


   

    return (
        <div>
            <PageMeta title="Invoice Create" description="Form to create a new invoice" />
            <PageBreadcrumb pageTitle="Invoice Create" />

            {/* ✅ Print Button */}
            <div className="mb-4 flex justify-end print:hidden">
                <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                Print Invoice
                </button>
            </div>

            <div id="print-section">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <div className="space-y-6">
                        <div className="p-5 rounded-2xl lg:p-6">
                            <div className="flex flex-col items-center text-center gap-5 xl:flex-row xl:justify-between">
                                <div className="flex flex-col items-center w-full gap-1">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                        {user?.business?.businessName}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Address: {user?.business?.address}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Phone: {(user?.business?.phoneCode ?? '') + user?.business?.phoneNumber}
                                    </p>
                                </div>
                                
                            </div>
                            
                        </div>

                        <div className="flex flex-col items-start text-center gap-5 xl:flex-row xl:justify-between">
                                <div className="flex flex-col items-start w-full gap-1 xl:justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Date: {invoice?.date}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        # Ref: {invoice?.id}
                                    </p>
                                </div>
                            </div>

                        <div className="flex flex-col items-start text-left gap-5 xl:flex-row xl:justify-between">
                            <div className="flex flex-col items-start w-full gap-1 xl:justify-between">
                                <h6 className="text-lg font-semibold text-gray-800 dark:text-white/90">To,</h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <b>Customer Name:</b> {invoice?.party?.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <b>Address:</b> {invoice?.party?.address}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <b>Phone:</b> {(invoice?.party?.phoneCode ?? '') + invoice?.party?.phoneNumber}
                                </p>
                            </div>
                        </div>

                        <Table>
                            <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                                <TableRow>
                                <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                                <TableCell isHeader className="text-center px-4 py-2">Item</TableCell>
                                <TableCell isHeader className="text-center px-4 py-2">Price</TableCell>
                                <TableCell isHeader className="text-center px-4 py-2">Quantity</TableCell>
                                <TableCell isHeader className="text-center px-4 py-2">Unit</TableCell>
                                <TableCell isHeader className="text-right px-4 py-2">Sub-Total (Dhs.)</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {invoice?.items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                    No items added yet.
                                    </TableCell>
                                </TableRow>
                                ) : (
                                invoice?.items.map((item, index) => (
                                    <TableRow key={item.id ?? index}>
                                        <TableCell className="text-center px-4 py-2">{index + 1}</TableCell>
                                        <TableCell className="text-center px-4 py-2">{item.name}</TableCell>
                                        <TableCell className="text-center px-4 py-2">{item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-center px-4 py-2">{item.quantity}</TableCell>
                                        <TableCell className="text-center px-4 py-2">Box</TableCell>
                                        <TableCell className="text-right px-4 py-2">{(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                )))}

                                
                            </TableBody>
                            {/* <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                                <TableRow>
                                    <TableCell colSpan={4} isHeader className="text-right px-4 py-2">Net Total Amount:</TableCell>
                                    <TableCell colSpan={1} isHeader className="text-center px-4 py-2">{invoice?.totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableHeader> */}
                        </Table>

                        <div className="my-6 flex justify-end pb-6 text-right">
                            <div className="w-[220px]">
                                <p className="my-4 text-left text-sm font-medium text-gray-800 dark:text-white/90">
                                Order summary
                                </p>
                                <ul className="space-y-2">
                                
                                <li className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700 dark:text-gray-400">
                                    Total (Dhs.) :
                                    </span>
                                    <span className="text-lg font-semibold text-gray-800 dark:text-white/90 pr-4">{invoice?.totalAmount.toFixed(2)}</span>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
