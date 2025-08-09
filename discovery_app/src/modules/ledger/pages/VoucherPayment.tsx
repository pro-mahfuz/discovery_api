
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import DatePicker from "../../../components/form/date-picker.tsx";

import Select from "react-select";
import { toast } from "react-toastify";

import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { create, update, fetchById } from "../../payment/features/paymentThunks.ts";
import { selectAllParties } from "../../party/features/partySelectors.ts";
import { selectPaymentById } from "../../payment/features/paymentSelectors.ts";
import { Payment, paymentOptions, paymentMethodOptions, OptionType } from "../../payment/features/paymentTypes.ts";
import { selectUserById } from "../../user/features/userSelectors.ts";
import { selectAuth } from "../../auth/features/authSelectors.ts";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { CurrencyOptions, OptionStringType } from "../../types.ts";
// import { useNavigate } from "react-router-dom";

interface CurrencyPaymentProps {
  editingPaymentId: number;
  paymentPartyId: number;
}

export default function VoucherPayment({ editingPaymentId, paymentPartyId }: CurrencyPaymentProps) {
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  // console.log("VoucherPayment authUser: ", authUser);
  // console.log("VoucherPayment user: ", user);

  const invoices = useSelector(selectAllInvoice);
 
  const matchingParties = useSelector(selectAllParties);
  const selectedPayment = useSelector(selectPaymentById(Number(editingPaymentId)));

  const [form, setForm] = useState<Payment>({
    businessId: user?.business?.id,
    categoryId: 1,
    paymentType: "payment_in",
    invoiceId: null,
    partyId: paymentPartyId ?? 0,
    paymentDate: '',
    note: "",
    amountPaid: 0,
    paymentMethod: "cash",
    paymentDetails: '',
    currency: 'AED',
  });

  useEffect(() => {
      dispatch(fetchAllInvoice());
      dispatch(fetchParty('all'));
      if (editingPaymentId) {
        dispatch(fetchById(editingPaymentId));
      }
  }, [editingPaymentId, dispatch]); 

  useEffect(() => {
    if (user?.business?.id) {
      setForm((prev) => ({
        ...prev,
        businessId: user?.business?.id,
      }));
    }

    if (user?.business?.id) {
      setForm((prev) => ({
        ...prev,
        partyId: paymentPartyId
      }));
    }
  }, [user]);

  // console.log("VoucherPayment Update FormData: ", form);

  

  useEffect(() => {
    // console.log("selectedPayment", selectedPayment);
    if (!selectedPayment) return;

    setForm({
      businessId: user?.business?.id ?? 0,
      categoryId: selectedPayment.categoryId ?? 1,
      paymentType: selectedPayment.paymentType ?? '',
      partyId: selectedPayment.partyId ?? 0,
      invoiceId: selectedPayment.invoiceId ?? 0,
      paymentDate: selectedPayment.paymentDate,
      note: selectedPayment.note ?? '',
      amountPaid: selectedPayment.amountPaid ?? 0,
      paymentMethod: selectedPayment.paymentMethod,
      paymentDetails: selectedPayment.paymentDetails,
      currency: selectedPayment.currency
    });

    
    
  }, [selectedPayment]);

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!form) return;

    setForm((prev) => ({
      ...prev!,
      [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handlePaymentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form) return;
    
    if (editingPaymentId) {
      const updatedForm: Payment = {
        ...form,
        id: selectedPayment?.id,
      };
      // console.log("Updated formData: ", updatedForm);
      await dispatch(update(updatedForm));
      toast.success("Payment updated successfully!");
    }else{
      //console.log("formData: ", form);
      await dispatch(create(form));
      toast.success("Payment created successfully!");
    }
    window.location.reload();
    //navigate("/currency/ledger");
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
    <div className="flex">
      <div className="w-full">
        <form onSubmit={handlePaymentSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
                <Label>Select Invoice Ref (if have)</Label>
                <Select
                    options={invoices.map((i) => ({
                        label: `${String(i.invoiceNo)}`,
                        value: Number(i.id),
                        partyId: Number(i.partyId)
                    }))}
                    placeholder="Select invoice type"
                    value={
                      invoices
                          .filter((i) => i.id === form.invoiceId)
                          .map((i) => ({ label: `${String(i.invoiceNo)}`, partyId: i.partyId, value: i.id }))[0] || null
                    }
                    onChange={(selectedOption) => {
                        setForm(prev => ({
                            ...prev,
                            invoiceId: selectedOption!.value ?? 0,
                            partyId: Number(selectedOption?.partyId) ?? 0,
                        }));
                    }}
                    styles={selectStyles}
                    classNamePrefix="react-select"
                />
            </div>
            
            {!paymentPartyId && (
              <div>
                <Label>Select Party</Label>
                <Select
                  options={matchingParties.map((p) => ({
                      label: p.name,
                      value: p.id,
                  }))}
                  placeholder="Search and select party"
                  value={
                      matchingParties
                          .filter((p) => p.id === form.partyId)
                          .map((p) => ({ label: p.name, value: p.id }))[0] || null
                  }
                  onChange={(selectedOption) =>
                      setForm((prev) => ({
                          ...prev,
                          partyId: selectedOption?.value ?? 0,
                      }))
                  }
                  isClearable
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              </div>
            )}
            
            <div>
              <DatePicker
                id="date-picker"
                label="Date"
                placeholder="Select a date"
                defaultDate={form.paymentDate}
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  // console.log({ dates, currentDateString });
                  setForm((prev) => ({
                    ...prev!,
                    paymentDate: currentDateString,
                  }))
                }}
              />
            </div>

            {/* <div>
              <Label>Date</Label>
              <Input
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={handlePaymentChange}
                  required
              />
            </div> */}

            {/* <div>
                <Label>Select Category</Label>
                <Select<OptionType>
                    options={categoryOptions}
                    placeholder="Select category"
                    value={categoryOptions.find(option => option.value === String(form.categoryId))}
                    onChange={(selectedOption) => {
                    setForm(prev => ({
                        ...prev,
                        categoryId: Number(selectedOption?.value ?? 0),
                    }));
                    }}
                    isClearable
                    styles={selectStyles}
                    classNamePrefix="react-select"
                />
            </div> */}

            <div>
              <Label>Payment Type</Label>
              <Select<OptionType>
                options={paymentOptions}
                placeholder="Select Payment Type"
                value={paymentOptions.find(option => option.value === form.paymentType)}
                onChange={(selectedOption) => {
                    setForm(prev => ({
                        ...prev,
                        paymentType: selectedOption?.value as "payment_in" | "payment_out",
                    }));
                }}
                isClearable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <Label>Select Currency</Label>
              <Select<OptionStringType>
                options={CurrencyOptions}
                placeholder="Select Currency"
                value={
                  form
                    ? CurrencyOptions.find((option) => option.value === form.currency)
                    : null
                }
                onChange={(selectedOption) => {
                  setForm((prev) => ({
                    ...prev!,
                    currency: selectedOption!.value,
                  }));
                }}
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="text"
                name="amountPaid"
                value={form.amountPaid}
                onChange={handlePaymentChange}
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Description / Note</Label>
              <Input
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handlePaymentChange}
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select<OptionType>
                options={paymentMethodOptions}
                placeholder="Select Payment Method Type"
                value={paymentMethodOptions.find(option => option.value === form.paymentMethod)}
                onChange={(selectedOption) => {
                    setForm(prev => ({
                        ...prev,
                        paymentMethod: selectedOption?.value as "cash" | "bank",
                    }));
                }}
                isClearable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-span-2">
              <Label>Payment Details (If Bank Method)</Label>
              <Input
                  type="text"
                  name="paymentDetails"
                  value={form.paymentDetails}
                  onChange={handlePaymentChange}
              />
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              className="rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-700"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

