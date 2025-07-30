
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";

import Select from "react-select";
import { toast } from "react-toastify";

import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { fetchAll, create, update, fetchById } from "../../payment/features/paymentThunks.ts";
import { selectAllParties } from "../../party/features/partySelectors.ts";
import { selectPaymentById } from "../../payment/features/paymentSelectors.ts";
import { Payment, paymentOptions, paymentMethodOptions, OptionType } from "../../payment/features/paymentTypes.ts";
// import { useNavigate } from "react-router-dom";

interface CurrencyPaymentProps {
  editingPaymentId: number;
}

export default function CurrencyPayment({ editingPaymentId }: CurrencyPaymentProps) {
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const matchingParties = useSelector(selectAllParties);
  const selectedPayment = useSelector(selectPaymentById(Number(editingPaymentId)));

  const [form, setForm] = useState<Payment>({
      categoryId: 1,
      paymentType: "payment_in",
      invoiceId: null,
      partyId: 0,
      paymentDate: '',
      note: "",
      amountPaid: 0,
      paymentMethod: "cash",
      paymentDetails: ''
  });

  useEffect(() => {
    console.log("editingPaymentId", editingPaymentId);
     dispatch(fetchParty());
     if (editingPaymentId) {
       dispatch(fetchById(editingPaymentId));
     }
  }, [editingPaymentId, dispatch]);

  useEffect(() => {
    console.log("selectedPayment", selectedPayment);
    if (!selectedPayment) return;

    setForm({
      categoryId: selectedPayment.categoryId ?? 1,
      paymentType: selectedPayment.paymentType ?? '',
      partyId: selectedPayment.partyId ?? 0,
      paymentDate: selectedPayment.paymentDate
        ? new Date(selectedPayment.paymentDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      note: selectedPayment.note ?? '',
      amountPaid: selectedPayment.amountPaid ?? 0,
      paymentMethod: selectedPayment.paymentMethod,
      paymentDetails: selectedPayment.paymentDetails
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
      console.log("Updated formData: ", updatedForm);
      await dispatch(update(updatedForm));
    }else{
      console.log("formData: ", form);
      await dispatch(create(form));
    }
    toast.success("Invoice created successfully!");
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

            <div>
              <Label>Date</Label>
              <Input
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={handlePaymentChange}
                  required
              />
            </div>

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
              <Label>Amount</Label>
              <Input
                type="text"
                name="amountPaid"
                value={form.amountPaid}
                onChange={handlePaymentChange}
                required
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

            <div className="col-span-3">
              <Label>Description / Note</Label>
              <Input
                  type="text"
                  name="note"
                  value={form.note}
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

