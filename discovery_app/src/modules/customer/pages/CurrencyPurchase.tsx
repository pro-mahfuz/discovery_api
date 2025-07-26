import { useState } from "react";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Select from "../../../components/form/Select.tsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

interface Transaction {
  date: string;
  itemId: number | null;
  rate: number | null;
  quantity: number | null;
  totalAmount: number;
  transactionFor: 'currency' | 'gold';
  transactionType: 'purchase' | 'sale' | 'makePayment' | 'receivedPayment';
  entryType: 'debit' | 'credit';
  description: string;
}

export default function CurrencyPurchase() {
  const itemOptions = [
    { value: "1", label: "AED" },
    { value: "2", label: "BDT" },
    { value: "3", label: "USD" },
  ];
  const transactionOptions = [
    { value: "sale", label: "Sale" },
    { value: "purchase", label: "Purchase" },
  ];
  const paymentOptions = [
    { value: "makePayment", label: "Make Payment" },
    { value: "receivedPayment", label: "Received Payment" },
  ];

  const [form, setForm] = useState<Transaction>({
    date: "",
    itemId: 0,
    rate: 0,
    quantity: 0,
    totalAmount: 0,
    transactionFor: 'currency',
    transactionType: 'purchase',
    entryType: 'debit',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['rate', 'quantity', 'totalAmount'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleItemChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      itemId: parseInt(value),
    }));
  };

  const handleTransactionChange = (value: string) => {
    setForm(prev => ({
        ...prev,
        transactionType: value as Transaction['transactionType'],
        entryType:
        value === 'purchase' || value === 'receivedPayment'
            ? 'credit'
            : 'debit',
    }));
  };


  const handleAddTransaction = () => {
    console.log("Submitting transaction:", form);
    // Add API or state management logic here
  };

  return (
    <div className="flex">
      <div className="w-full">
        <TabGroup>
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Transaction Type</Label>
                    <Select
                      options={transactionOptions}
                      onChange={handleTransactionChange}
                    />
                  </div>

                  <div>
                    <Label>Select Item</Label>
                    <Select
                      options={itemOptions}
                      onChange={handleItemChange}
                    />
                  </div>

                  <div>
                    <Label>BDT Rate</Label>
                    <Input
                      type="text"
                      name="rate"
                      value={form.rate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="text"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Total</Label>
                    <Input
                      type="text"
                      name="totalAmount"
                      value={form.totalAmount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <Label>Description / Note</Label>
                    <Input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddTransaction}
                    className="rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-700"
                  >
                    Submit Purchase/Sale
                  </button>
                </div>
              </div>
            </TabPanel>

            {/* PAYMENT PANEL */}
            <TabPanel>
              <div className="p-4 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 space-y-4">
                <h2 className="text-lg font-semibold">Add Payment</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Payment Type</Label>
                    <Select
                      options={paymentOptions}
                      onChange={handleTransactionChange}
                    />
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="text"
                      name="totalAmount"
                      value={form.totalAmount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <Label>Description / Note</Label>
                    <Input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddTransaction}
                    className="rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-700"
                  >
                    Submit Payment
                  </button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
