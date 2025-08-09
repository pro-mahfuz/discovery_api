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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import Checkbox from "../../../components/form/input/Checkbox.tsx";

import { OptionStringType, InvoiceType, InvoiceTypeOptions } from "../../types.ts";
import { Invoice, Item } from "../features/invoiceTypes";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { create } from "../features/invoiceThunks";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { AppDispatch } from "../../../store/store";
import { selectAllParties } from "../../party/features/partySelectors";
import { selectAllCategory, selectCategoryById } from "../../category/features/categorySelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectContainerByItemId } from "../../container/features/containerSelectors";
import { fetchAll } from "../../container/features/containerThunks.ts";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { fetchAllInvoice } from "../features/invoiceThunks.ts";


export default function InvoiceCreateForm() {
    const { invoiceType } = useParams() as { invoiceType: 'purchase' | 'sale' };
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchParty("all"));
        dispatch(fetchAllCategory());
        dispatch(fetchAll());
        dispatch(fetchAllInvoice());
    }, [dispatch]);

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));

    const matchingParties = useSelector(selectAllParties);
    const categories = useSelector(selectAllCategory);
    const invoices = useSelector(selectAllInvoice);
    

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState<Invoice>({
        businessId: 0,
        categoryId: 1,
        invoiceType: invoiceType,
        invoiceRefId: 0,
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
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
            createdBy: user.id
          }));
        }

        setFormData((prev) => ({
            ...prev,
            invoiceType: invoiceType,
        }));
    }, [user, invoiceType]);

    const categoryItem = useSelector(selectCategoryById(Number(formData.categoryId)));

    // Local state for current item inputs
    const [currentItem, setCurrentItem] = useState<Item>({
        itemId: 0,
        containerId: 0,
        name: '',
        price: 0,
        quantity: 0,
        subTotal: 0,
    });

    const containers = useSelector(selectContainerByItemId(Number(formData.categoryId), (Number(currentItem.itemId))));

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
        if (!formData.items || formData.items.length === 0) newErrors.items = "At least one item is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if (!validateForm()) {
        //     toast.error("Please fix the errors in the form.");
        //     return;
        // }

        try {
            // Dispatch create action, including totalAmount
            console.log("Invoice FormData: ", formData);
            await dispatch(create(formData));
            toast.success("Invoice created successfully!");
            const categoryId = 0;
            navigate(`/invoice/${formData.invoiceType}/${categoryId}/list`);
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
        
        if (!currentItem.itemId || currentItem.price <= 0 || currentItem.quantity <= 0) {
            toast.error("Please fill all item fields properly");
            return;
        }

        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { ...currentItem, itemId: currentItem.itemId }, // unique id
            ],
        }));

        setCurrentItem({
            itemId: 0,
            containerId: 0,
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
        const total = formData.items.reduce( (sum, item) => sum + item.price * item.quantity, 0 );

        const discount = Number(formData.discount) || 0;
        const discountedTotal = Math.max(0, total - discount);
        const vatAmount = formData.isVat === true ? discountedTotal * (Number(user?.business?.vatPercentage) / 100) : 0;
        const grandTotal = discountedTotal + vatAmount;

        setFormData((prev) => ({
            ...prev,
            totalAmount: total,
            grandTotal: grandTotal,
            vatPercentage: formData.isVat === true ? user?.business?.vatPercentage ?? 0 : 0,
        }));
    }, [formData.items, formData.isVat, formData.discount]);

    return (
        <div>
        <PageMeta title={`${invoiceType ? invoiceType.charAt(0).toUpperCase() + invoiceType.slice(1).toLowerCase() : ''} Create`} description="Form to create a new invoice" />
        <PageBreadcrumb pageTitle={`${invoiceType ? invoiceType.charAt(0).toUpperCase() + invoiceType.slice(1).toLowerCase() : ''} Create`} />

        <ComponentCard title="Fill up all fields to create a new invoice">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Category */}
                    <div>
                        <Label>Select Category</Label>
                        <Select
                            options={categories.map((c) => ({
                                label: c.name,
                                value: c.id,
                            }))}
                            placeholder="Search and select category"
                            value={
                                categories
                                .filter((c) => c.id === formData.categoryId)
                                .map((c) => ({ label: c.name, value: c.id }))[0] || null
                            }
                            onChange={(selectedOption) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    categoryId: selectedOption?.value ?? 0,
                                }))
                            }
                            isClearable
                            styles={selectStyles}
                            classNamePrefix="react-select"
                        />
                        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                    </div>

                    {/* Invoice Type */}
                    <div>
                        <Label>Select Invoice Type</Label>
                        <Select<OptionStringType>
                            options={InvoiceTypeOptions}
                            placeholder="Select invoice type"
                            value={InvoiceTypeOptions.find(option => option.value === formData.invoiceType)}
                            onChange={(selectedOption) => {
                                setFormData(prev => ({
                                    ...prev,
                                    invoiceType: selectedOption!.value as InvoiceType,
                                }));
                            }}
                            styles={selectStyles}
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Invoice Ref ID */}
                    { formData.invoiceType === "saleReturn" && (
                        <div>
                            <Label>Search Invoice Ref (if have)</Label>
                            <Select
                                options={invoices.map((i) => ({
                                    label: String(i.id),
                                    value: Number(i.id),
                                    partyId: Number(i.partyId)
                                }))}
                                placeholder="Select invoice type"

                                onChange={(selectedOption) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        invoiceRefId: selectedOption!.value,
                                        partyId: selectedOption!.partyId,
                                    }));
                                }}
                                styles={selectStyles}
                                classNamePrefix="react-select"
                            />
                        </div>
                    )}
                    

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
                        <DatePicker
                            id="date-picker"
                            label="Date"
                            placeholder="Select a date"
                            defaultDate={formData.date}
                            onChange={(dates, currentDateString) => {
                                // Handle your logic
                                console.log({ dates, currentDateString });
                                setFormData((prev) => ({
                                    ...prev!,
                                    date: currentDateString,
                                }))
                            }}
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    {/* isVat */}
                    <div className="flex flex-col items-center text-center">
                        <Label>Select Vat (if have)</Label>
                        <Checkbox className="justify-center"
                            key={formData.id}
                            id={`is-vat-check`}
                            label={`Is Vated`}
                            checked={!!formData.isVat}
                            onChange={(checked: boolean) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    isVat: checked,
                                }));
                            }}
                        />
                    </div>


                    {/* Note */}
                    <div className="md:col-span-2">
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
                                options={
                                    categoryItem?.items?.map((i) => ({
                                        label: i.name,
                                        value: i.id,
                                    })) || []
                                }
                                placeholder="Search and select item"
                                value={
                                    categoryItem?.items
                                    ?.filter((i) => i.id === currentItem.itemId)
                                    .map((i) => ({ label: i.name, value: i.id }))[0] || null
                                }
                                onChange={(selectedOption) =>
                                    setCurrentItem((prev) => ({
                                        ...prev,
                                        itemId: selectedOption?.value,
                                        name: selectedOption?.label ?? '',
                                    }))
                                }
                                isClearable
                                styles={selectStyles}
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div>
                            <Label>Search Container</Label>
                            <Select
                                options={
                                containers
                                    .filter((i) =>
                                        formData.invoiceType === "purchase"
                                        ? true
                                        : Number(i.netStock) > 0
                                    )
                                    .map((i) => ({
                                        label: `${i.containerNo} - ${i.netStock} ${i.stockUnit} ${formData.invoiceType}`,
                                        value: i.id,
                                    })) || []
                                }
                                placeholder="Search and select item"
                                value={
                                    containers
                                    ?.filter((i) => i.id === currentItem.containerId)
                                    .map((i) => ({ label: i.containerNo, value: i.id }))[0] || null
                                }
                                onChange={(selectedOption) =>
                                    setCurrentItem((prev) => ({
                                        ...prev,
                                        containerId: selectedOption?.value ?? 0,
                                    }))
                                }
                                isClearable
                                styles={selectStyles}
                                classNamePrefix="react-select"
                            />
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">

                    {/* Total Amount */}
                    <div>
                        <Label>Total Amount</Label>
                        <Input
                            type="number"
                            name="totalAmount"
                            placeholder="0"
                            value={formData.totalAmount}
                            readonly={true}
                        />
                    </div>

                    {/* Discount */}
                    {/* <div>
                        <Label>Discount</Label>
                        <Input
                            type="number"
                            name="discount"
                            placeholder="0"
                            value={formData.discount}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;

                                setFormData((prev) => ({
                                    ...prev!,
                                    discount: value,
                                    grandTotal: formData.totalAmount - value,
                                }));
                            }}
                        />
                    </div> */}

                    {/* Grand Amount */}
                    <div>
                        <Label>Grand Total</Label>
                        <Input
                            type="number"
                            name="grandTotal"
                            placeholder="0"
                            value={formData.grandTotal}
                            readonly={true}
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
