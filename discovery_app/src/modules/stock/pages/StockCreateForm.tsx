import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import DatePicker from "../../../components/form/date-picker.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Select from "react-select";

import { AppDispatch } from "../../../store/store.ts";
import { OptionStringType, OptionNumberType, MovementTypeOptions, selectStyles } from "../../types.ts";
import { Stock } from "../features/stockTypes.ts";

import { create } from "../features/stockThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchAll as fetchContainer } from "../../container/features/containerThunks.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchAllWarehouse } from "../../warehouse/features/warehouseThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors.ts";
import { selectUserById } from "../../user/features/userSelectors.ts";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllContainer } from "../../container/features/containerSelectors.ts";
import { selectAllItem } from "../../item/features/itemSelectors.ts";
import { selectAllWarehouse } from "../../warehouse/features/warehouseSelectors.ts";


export default function PaymentCreateForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));
    // console.log("Invoice authUser: ", authUser);
    // console.log("Invoice user: ", user);
    const containers = useSelector(selectAllContainer);
    const invoices = useSelector(selectAllInvoice);
    console.log("invoices: ", invoices);
    const items = useSelector(selectAllItem);
    const warehouses = useSelector(selectAllWarehouse);

    useEffect(() => {
        dispatch(fetchAllInvoice());
        dispatch(fetchContainer());
        dispatch(fetchAllWarehouse());
        dispatch(fetchAllItem());
    }, [dispatch]);

    


    const [formData, setFormData] = useState<Stock>({
        businessId: 0,
        date: '',
        invoiceType: undefined,        
        invoiceId: undefined,
        itemId: 0,
        containerId: 0,
        movementType: '',
        warehouseId: 0,
        quantity: 0,
    });

    useEffect(() => {
        if (user?.business?.id) {
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
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
            console.log("Payment formData: ", formData);
            await dispatch(create(formData));
            toast.success("Payment created successfully!");

            //navigate(`/payment/list`);
        } catch (err) {
            toast.error("Failed to create payment.");
        }
    };

    return (
        <div>
        <PageMeta title="Stock Create" description="Form to create a new stock" />
        <PageBreadcrumb pageTitle="Stock Create" />

        <ComponentCard title="Fill up all fields to create a new stock">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Ref (if have)</Label>
                    <Select<OptionStringType>
                        options={invoices.map((i) => ({
                            label: `#${i.id} | ${i.party?.name ?? "No name"}`,
                            value: String(i.party?.name)
                        }))}
                        placeholder="Select invoice type"

                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                invoiceId: Number(selectedOption!.value) ?? null,
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Type</Label>
                    <Select<OptionStringType>
                        options={MovementTypeOptions}
                        placeholder="Select movement type"
                        value={MovementTypeOptions.find(option => option.value === formData.movementType)}
                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                movementType: selectedOption!.value,
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <Label>Search Item</Label>
                    <Select
                        options={
                            items?.map((i) => ({
                                label: i.name,
                                value: i.id,
                            })) || []
                        }
                        placeholder="Search and select item"
                        value={
                            items
                            ?.filter((i) => i.id === formData.itemId)
                            .map((i) => ({ label: i.name, value: i.id }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                itemId: Number(selectedOption?.value) ?? undefined,
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <Label>Select Container</Label>
                    <Select
                        options={
                        containers
                            .filter((i) =>
                                formData.invoiceType === "purchase"
                                ? true
                                : Number(i.netStock) > 0
                            )
                            .map((i) => ({
                                label: `${i.containerNo} - ${i.netStock} ${i.stockUnit}`,
                                value: i.id,
                            })) || []
                        }
                        placeholder="Search and select item"
                        value={
                            containers
                            ?.filter((i) => i.id === formData.containerId)
                            .map((i) => ({ label: i.containerNo, value: i.id }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                containerId: Number(selectedOption?.value),
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <Label>Select Warehouse</Label>
                    <Select
                        options={
                        warehouses
                            .map((w) => ({
                                label: `${w.name}`,
                                value: w.id,
                            })) || []
                        }
                        placeholder="Search and select warehouse"
                        value={
                            warehouses
                            ?.filter((w) => w.id === formData.warehouseId)
                            .map((w) => ({ label: w.name, value: w.id }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                warehouseId: selectedOption?.value ?? 0,
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
                        defaultDate={formData.date}
                        onChange={(dates, currentDateString) => {
                            console.log({ dates, currentDateString });
                            setFormData((prev) => ({
                            ...prev!,
                            paymentDate: currentDateString, 
                            }));
                        }}
                    />
                </div>

                

                {/* Paid Amount */}
                <div>
                <Label>Quantity</Label>
                <Input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={formData.quantity}
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
