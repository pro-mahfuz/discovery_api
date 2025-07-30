import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Select from "react-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";

import { Invoice, categoryOptions, invoiceTypeOptions, OptionType, InvoiceType, Item } from "../features/invoiceTypes";
import { fetchAll } from "../../item/features/itemThunks.ts";
import { create } from "../features/invoiceThunks";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { AppDispatch } from "../../../store/store";
import { selectAllParties } from "../../party/features/partySelectors";
import { selectAllItem } from "../../item/features/itemSelectors";


export default function InvoiceCreateForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchParty());
        dispatch(fetchAll());
    }, [dispatch]);

    const matchingParties = useSelector(selectAllParties);
    const items = useSelector(selectAllItem);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState<Omit<Invoice, "totalAmount">>({
        categoryId: 1,
        invoiceType: "purchase",
        partyId: 0,
        date: new Date().toISOString().split("T")[0],
        note: "",
        items: [],
    });

    const [totalAmount, setTotalAmount] = useState(0);

    // Local state for current item inputs
    const [currentItem, setCurrentItem] = useState<Item>({
        id: 0,
        name: '',
        price: 0,
        quantity: 1,
        subTotal: 0,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
        }));
    };

    const handleCurrentItemChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: name === "price" || name === "quantity" ? Number(value) : value,
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.categoryId) newErrors.categoryId = "Select Category";
        if (!formData.invoiceType.trim()) newErrors.invoiceType = "Select Invoice Type";
        if (!formData.partyId) newErrors.partyId = "Select Party";
        if (!formData.date.trim()) newErrors.date = "Date is required";
        if (totalAmount <= 0) newErrors.totalAmount = "Amount is required";
        if (!formData.items || formData.items.length === 0) newErrors.items = "At least one item is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            // Dispatch create action, including totalAmount
            console.log("formData: ", formData);
            // await dispatch(create({ ...formData, totalAmount }));
            toast.success("Invoice created successfully!");
            // navigate("/invoice/list");
        } catch (err) {
            toast.error("Failed to create invoice.");
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

    const addItem = () => {
        
        if (!currentItem.id || currentItem.price <= 0 || currentItem.quantity <= 0) {
            toast.error("Please fill all item fields properly");
            return;
        }

        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { ...currentItem, id: Date.now() }, // unique id
            ],
        }));

        setCurrentItem({
            id: 0,
            name: '',
            price: 0,
            quantity: 1,
            subTotal: 0,
        });
    };

    const removeItem = (id: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id),
        }));
    };

    

    // Auto calculate totalAmount from items, separate from formData
    useEffect(() => {
        const total = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalAmount(total);
    }, [formData.items]);

    return (
        <div>
        <PageMeta title="Invoice Create" description="Form to create a new invoice" />
        <PageBreadcrumb pageTitle="Invoice Create" />

        <ComponentCard title="Fill up all fields to create a new invoice">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category */}
                <div>
                    <Label>Select Category</Label>
                    <Select<OptionType>
                        options={categoryOptions}
                        placeholder="Select category"
                        value={categoryOptions.find(option => option.value === String(formData.categoryId))}
                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                categoryId: Number(selectedOption?.value ?? 0),
                            }));
                        }}
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                    {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                </div>

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Type</Label>
                    <Select<OptionType>
                        options={invoiceTypeOptions}
                        placeholder="Select invoice type"
                        value={invoiceTypeOptions.find(option => option.value === formData.invoiceType)}
                        onChange={(selectedOption) => {
                        setFormData(prev => ({
                            ...prev,
                            invoiceType: selectedOption!.value as InvoiceType,
                        }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                    {errors.invoiceType && <p className="text-red-500 text-sm">{errors.invoiceType}</p>}
                </div>

                {/* Search Party */}
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
                    {errors.partyId && <p className="text-red-500 text-sm">{errors.partyId}</p>}
                </div>

                {/* Date */}
                <div>
                <Label>Date</Label>
                <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>

                {/* Total Amount */}
                <div>
                <Label>Total Amount</Label>
                <Input
                    type="number"
                    name="totalAmount"
                    placeholder="Enter total amount"
                    value={totalAmount}
                    readonly={true}
                />
                {errors.totalAmount && <p className="text-red-500 text-sm">{errors.totalAmount}</p>}
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
            </div>

            {/* Add Item Section */}
            <h5>Add Item</h5>
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div>
                        <Label>Search Item Name</Label>
                        <Select
                            options={items.map((i) => ({
                                label: i.name,
                                value: i.id,
                            }))}
                            placeholder="Search and select party"
                            value={
                                items
                                    .filter((i) => i.id === currentItem.id)
                                    .map((i) => ({ label: i.name, value: i.id }))[0] || null
                                }
                            onChange={(selectedOption) =>
                                setCurrentItem((prev) => ({
                                    ...prev,
                                    id: selectedOption?.value ?? 0,
                                    name: selectedOption?.label ?? ''
                                }))
                            }
                            isClearable
                            styles={selectStyles}
                            classNamePrefix="react-select"
                        />
                        {errors.partyId && <p className="text-red-500 text-sm">{errors.partyId}</p>}
                    </div>

                    <div>
                        <Label>Price</Label>
                        <Input
                            type="number"
                            name="price"
                            value={currentItem.price}
                            onChange={handleCurrentItemChange}
                            placeholder="Enter price"
                            min='0'
                        />
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            name="quantity"
                            value={currentItem.quantity}
                            onChange={handleCurrentItemChange}
                            placeholder="Enter quantity"
                            min='1'
                        />
                    </div>

                    <div className="flex items-end">
                        <Button type="button" onClick={addItem}>
                            Add Item
                        </Button>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <Table>
                <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                    <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Item</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Price</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Quantity</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Sub-Total</TableCell>
                    <TableCell isHeader className="text-center px-4 py-2">Action</TableCell>
                </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {formData.items.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                        No items added yet.
                    </TableCell>
                    </TableRow>
                ) : (
                    formData.items.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="text-center px-4 py-2">{index + 1}</TableCell>
                        <TableCell className="text-center px-4 py-2">{item.name}</TableCell>
                        <TableCell className="text-center px-4 py-2">{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center px-4 py-2">{item.quantity}</TableCell>
                        <TableCell className="text-center px-4 py-2">{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-center px-4 py-2">
                        <button
                            onClick={() => removeItem(Number(item.id))}
                            className="text-red-500 hover:underline"
                            type="button"
                        >
                            Remove
                        </button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>

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
