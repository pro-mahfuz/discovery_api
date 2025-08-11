import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import DatePicker from "../../../components/form/date-picker.tsx";
import Select from "react-select";
import { toast } from "react-toastify";

import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

import { OptionStringType, InvoiceTypeOptions, InvoiceType, CurrencyOptions, selectStyles } from "../../types.ts";
import { Invoice } from "../../invoice/features/invoiceTypes.ts";
import { Item } from "../../item/features/itemTypes.ts";
import { AppDispatch } from "../../../store/store.ts";
import { create, fetchById, update } from "../../invoice/features/invoiceThunks.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { selectAllParties } from "../../party/features/partySelectors.ts";
import { selectAllItem } from "../../item/features/itemSelectors.ts";
import { selectInvoiceById } from "../../invoice/features/invoiceSelectors.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";

interface CurrencyPurchaseProps {
  editingLedgerId: number;
  ledgerPartyId: number;
}

export default function VoucherInvoice({ editingLedgerId, ledgerPartyId }: CurrencyPurchaseProps) {

  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  // console.log("VoucherInvoice authUser: ", authUser);
  // console.log("VoucherInvoice user: ", user);
  
  const matchingParties = useSelector(selectAllParties);
  const items = useSelector(selectAllItem);
  const selectedInvoice = useSelector(selectInvoiceById(Number(editingLedgerId)));

  const [form, setForm] = useState<Invoice>({
    businessId: 0,
    categoryId: 1,
    invoiceType: "",
    partyId: 0,
    date: "",
    note: "",
    items: [],
    currency: "AED",
    totalAmount: 0,
    isVat: false,
    vatPercentage: 0,
    discount: 0,
    grandTotal: 0,
    createdBy: 0,
  });

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
        partyId: ledgerPartyId
      }));
    }

    
  }, [user, ledgerPartyId]);

  // console.log("VoucherInvoice Create FormData: ", form);

  const [currentItem, setCurrentItem] = useState<Item>({
    id: 0,
    itemId: 0,
    name: '',
    price: 0,
    quantity: 0,
    subTotal: 0,
  });

  useEffect(() => {
    dispatch(fetchParty('all'));
    dispatch(fetchAllItem());
    if (editingLedgerId) {
      dispatch(fetchById(editingLedgerId));
    }
  }, [editingLedgerId, dispatch]);


  useEffect(() => {
    // console.log("selectedInvoice", selectedInvoice);
    // console.log("ledgerPartyId", ledgerPartyId);
    if (!selectedInvoice) return;

    setForm({
      businessId: user?.business?.id,
      categoryId: selectedInvoice.categoryId ?? 1,
      invoiceType: selectedInvoice.invoiceType ?? "",
      partyId: selectedInvoice.partyId ?? 0,
      date: selectedInvoice.date,
      note: selectedInvoice.note ?? '',
      items: [],
      currency: selectedInvoice.currency,
      totalAmount: selectedInvoice.totalAmount ?? 0,

      isVat: false,
      vatPercentage: selectedInvoice.vatPercentage,
      discount: selectedInvoice.discount,
      grandTotal: selectedInvoice.grandTotal,
    });

    if (selectedInvoice.items && selectedInvoice.items.length > 0) {
      const firstItem = selectedInvoice.items[0];
      setCurrentItem({
        id: firstItem.id ?? 0,
        itemId: firstItem.itemId ?? 0,
        name: firstItem.name ?? '',
        price: firstItem.price ?? 0,
        quantity: firstItem.quantity ?? 0,
        subTotal: Math.round(firstItem.subTotal) ?? 0,
      });
    } else {
      setCurrentItem({
        id: 0,
        itemId: 0,
        name: '',
        price: 0,
        quantity: 0,
        subTotal: 0,
      });
    }
  }, [selectedInvoice]);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!form) return;

    setForm((prev) => ({
      ...prev!,
      [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleCurrentItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev: Item) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form) return;

    const newItem: Item = {
      ...currentItem,
      subTotal: currentItem.price * currentItem.quantity,
    };

    // console.log("newItem", newItem);
    const updatedItems = [...form.items, newItem];

    

    // setForm(updatedForm);
    // setCurrentItem({ id: 0, itemId: 0, name: "", price: 0, quantity: 1, subTotal: 0 });

    if (editingLedgerId) {
      const total = updatedItems.reduce( (sum, item) => sum + item.price * item.quantity, 0 );
      const discount = Number(form.discount) || 0;
      const discountedTotal = Math.max(0, total - discount);
      const vatAmount = form.isVat === true ? discountedTotal * (Number(user?.business?.vatPercentage) / 100) : 0;
      const grandTotal = discountedTotal + vatAmount;

      const updatedForm: Invoice = {
        ...form,
        id: selectedInvoice?.id,
        items: updatedItems,
        totalAmount: total,
        grandTotal: Math.round(grandTotal),
        vatPercentage: form.isVat === true ? user?.business?.vatPercentage ?? 0 : 0,
        updatedBy: user?.id,
      };

      //console.log("Updated formData: ", updatedForm);

      await dispatch(update(updatedForm));
      toast.success("Invoice updated successfully!");
    }else{

      const total = updatedItems.reduce( (sum, item) => sum + item.price * item.quantity, 0 );
      const discount = Number(form.discount) || 0;
      const discountedTotal = Math.max(0, total - discount);
      const vatAmount = form.isVat === true ? discountedTotal * (Number(user?.business?.vatPercentage) / 100) : 0;
      const grandTotal = discountedTotal + vatAmount;

      const createdForm: Invoice = {
        ...form,
        items: updatedItems,
        //totalAmount: updatedItems.reduce((total, item) => total + item.subTotal, 0),
        createdBy: user?.id,
        totalAmount: total,
        grandTotal: grandTotal,
        vatPercentage: form.isVat === true ? user?.business?.vatPercentage ?? 0 : 0,
      };

      //console.log("Created createdForm: ", createdForm);

      await dispatch(create(createdForm));
      toast.success("Invoice created successfully!");
    }
    window.location.reload();
    //navigate("/currency/ledger");
  };

  return (
    <div className="flex">
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {!ledgerPartyId && (
              <div>
                <Label>Select Party</Label>
                <Select
                  options={matchingParties.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  placeholder="Search and select party"
                  value={
                    form
                      ? matchingParties
                          .filter((p) => p.id === form.partyId)
                          .map((p) => ({ label: p.name, value: p.id }))[0] || null
                      : null
                  }
                  onChange={(selectedOption) =>
                    setForm((prev) => ({
                      ...prev!,
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
                defaultDate={form.date}
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  console.log({ dates, currentDateString });
                  setForm((prev) => ({
                    ...prev!,
                    date: currentDateString,
                  }))
                }}
              />
            </div>

            <div>
              <Label>Select Invoice Type</Label>
              <Select<OptionStringType>
                options={InvoiceTypeOptions}
                placeholder="Select Transaction type"
                value={
                  form
                    ? InvoiceTypeOptions.find((option) => option.value === form.invoiceType)
                    : null
                }
                onChange={(selectedOption) => {
                  setForm((prev) => ({
                    ...prev!,
                    invoiceType: selectedOption!.value as InvoiceType,
                  }));
                }}
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <Label>Search Item Name</Label>
              <Select
                options={items.map((i) => ({
                  label: i.name,
                  value: i.id,
                }))}
                placeholder="Search and select item"
                value={
                  items
                    .filter((i) => i.id === currentItem.itemId)
                    .map((i) => ({ label: i.name, value: i.id }))[0] || null
                }
                onChange={(selectedOption) =>
                  setCurrentItem((prev: Item) => ({
                    ...prev,
                    itemId: selectedOption?.value ?? 0,
                    name: selectedOption?.label ?? "",
                  }))
                }
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div>
              <Label>Rate</Label>
              <Input
                type="number"
                step={1}
                name="price"
                value={currentItem.price}
                onChange={handleCurrentItemChange}
                required
              />
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="text"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleCurrentItemChange}
                required
              />
            </div>

            <div>
              <Label>Total Amount</Label>
              <Input
                type="text"
                name="subTotal"
                value={currentItem.quantity * currentItem.price}
                readonly
              />
            </div>

            <div className="col-span-2">
              <Label>Description / Note</Label>
              <Input
                type="text"
                name="note"
                value={form?.note ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-700"
            >
              Submit Purchase/Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
