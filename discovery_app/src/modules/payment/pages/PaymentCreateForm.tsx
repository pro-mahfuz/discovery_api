import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker.tsx";
import Button from "../../../components/ui/button/Button";
import Select from "react-select";

import { AppDispatch } from "../../../store/store";
import { OptionStringType, InvoiceType, InvoiceTypeOptions, OptionNumberType } from "../../types.ts";
import { Payment, paymentMethodOptions, paymentOptions } from "../features/paymentTypes.ts";

import { create } from "../features/paymentThunks";
import { fetchAll as fetchPayment } from "../../payment/features/paymentThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllParties } from "../../party/features/partySelectors";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";


export default function PaymentCreateForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));

    useEffect(() => {
        dispatch(fetchPayment());
        dispatch(fetchParty("all"));
        dispatch(fetchAllInvoice());
    }, [dispatch]);

    const matchingParties = useSelector(selectAllParties);
    const invoices = useSelector(selectAllInvoice);

    const [formData, setFormData] = useState<Payment>({
        businessId: 0,
        invoiceId: null,
        categoryId: null,
        partyId: 0,
        paymentType: '',
        paymentDate: "",
        note: "",
        amountPaid: 0,
        paymentMethod: "",
        paymentDetails: "",
        currency: "AED",
        createdBy: 0,
    });

    useEffect(() => {
        if (user?.business?.id) {
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
            createdBy: user.id
          }));
        }
    }, [user]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        try {
            // Dispatch create action, including totalAmount
            
            await dispatch(create(formData));
            toast.success("Payment created successfully!");

            navigate(`/payment/list`);
        } catch (err) {
            toast.error("Failed to create payment.");
        }
    };

    const selectStyles = {
        control: (base: any, state: any) => ({
        ...base,
        borderColor: state.isFocused ? "#72a4f5ff" : "#d1d5db",
        boxShadow: state.isFocused ? "0 0 0 1px #8eb8fcff" : "none",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.375rem",
        minHeight: "38px",
        fontSize: "0.875rem",
        "&:hover": {
            borderColor: "#3b82f6",
        },
        }),
        menu: (base: any) => ({
        ...base,
        zIndex: 20,
        }),
        option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "#e0f2fe" : "white",
        color: "#1f2937",
        fontSize: "0.875rem",
        padding: "0.5rem 0.75rem",
        }),
    };

    

    return (
        <div>
        <PageMeta title="Payment Create" description="Form to create a new payment" />
        <PageBreadcrumb pageTitle="Payment Create" />

        <ComponentCard title="Fill up all fields to create a new invoice">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Ref (if have)</Label>
                    <Select
                        options={invoices.map((i) => ({
                            label: `#${i.invoiceNo}`,
                            value: i.id,
                            invoiceType: i.invoiceType,
                            categoryId: i.categoryId,
                            partyId: i.partyId
                        }))}
                        placeholder="Select invoice type"

                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                invoiceId: Number(selectedOption!.value),
                                invoiceType: selectedOption?.invoiceType,
                                categoryId: Number(selectedOption?.categoryId),
                                partyId: Number(selectedOption?.partyId)
                                
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Search Party */}
                <div>
                    <Label>Search & Select Party (if have)</Label>
                    <Select
                        options={matchingParties.map((p) => ({
                            label: p.name,
                            value: p.id,
                        }))}
                        placeholder="Search and select party"
                        value={
                            matchingParties
                                .filter((p) => p.id === formData.partyId)
                                .map((p) => ({ label: p.name, value: p.id }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                partyId: selectedOption?.value ?? 0,
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Date */}
                <div>
                    <DatePicker
                        id="date-picker"
                        label="Date"
                        placeholder="Select a date"
                        defaultDate={formData.paymentDate}
                        onChange={(dates, currentDateString) => {
                            console.log({ dates, currentDateString });
                            setFormData((prev) => ({
                            ...prev!,
                            paymentDate: currentDateString, 
                            }));
                        }}
                    />
                </div>

                {/* Payment Type */}
                <div>
                    <Label>Select Payment Type</Label>
                    <Select<OptionStringType>
                        options={paymentOptions}
                        placeholder="Select Payment type"
                        value={paymentOptions.find(option => option.value === formData.paymentType) || null}
                        onChange={(selectedOption) => {
                        if (selectedOption) {
                            setFormData((prev) => ({
                                ...prev,
                                paymentType: selectedOption.value,
                            }));
                        }
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Paid Amount */}
                <div>
                <Label>Amount</Label>
                <Input
                    type="number"
                    name="amountPaid"
                    placeholder="Enter amount"
                    value={formData.amountPaid}
                    onChange={handleChange}
                />
                </div>

                {/* Note */}
                <div className="md:col-span-3">
                    <Label>Note</Label>
                    <Input
                        type="text"
                        name="note"
                        placeholder="Optional note"
                        value={formData.note}
                        onChange={handleChange}
                    />
                </div>

                {/* Payment Type */}
                <div>
                    <Label>Select Payment Method</Label>
                    <Select<OptionStringType>
                        options={paymentMethodOptions}
                        placeholder="Select Payment Method"
                        value={paymentMethodOptions.find(option => option.value === formData.paymentMethod) || null}
                        onChange={(selectedOption) => {
                        if (selectedOption) {
                            setFormData((prev) => ({
                                ...prev,
                                paymentMethod: selectedOption.value,
                            }));
                        }
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Note */}
                <div className="md:col-span-3">
                    <Label>Payment Details (if have)</Label>
                    <Input
                        type="text"
                        name="paymentDetails"
                        placeholder="Optional payment details"
                        value={formData.paymentDetails}
                        onChange={handleChange}
                    />
                </div>
            </div>

            

            <div className="flex justify-end">
                <Button type="submit" variant="success">
                Submit
                </Button>
            </div>
            </form>
        </ComponentCard>
        </div>
    );
}
