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
import { OptionStringType, MovementTypeOptions, selectStyles, UnitOptions } from "../../types.ts";
import { Stock } from "../features/stockTypes.ts";

import { update, fetchById } from "../features/stockThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchAll as fetchContainer } from "../../container/features/containerThunks.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchAllWarehouse } from "../../warehouse/features/warehouseThunks.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors.ts";
import { selectUserById } from "../../user/features/userSelectors.ts";
import { selectAllInvoice, selectInvoiceById } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllItem } from "../../item/features/itemSelectors.ts";
import { selectAllWarehouse } from "../../warehouse/features/warehouseSelectors.ts";
import { selectCategoryById } from "../../category/features/categorySelectors";
import { selectAllContainer } from "../../container/features/containerSelectors";
import { selectStockById } from "../features/stockSelectors";


export default function StockEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));
    // console.log("Invoice authUser: ", authUser);
    // console.log("Invoice user: ", user);

    const items = useSelector(selectAllItem);
    const invoices = useSelector(selectAllInvoice);
    const warehouses = useSelector(selectAllWarehouse);
    const stock = useSelector(selectStockById(Number(id)));
    console.log("Stock: ", stock);

    const [formData, setFormData] = useState<Stock>({
        id: stock?.id,
        businessId: 0,
        date: '',
        invoiceType: undefined,        
        invoiceId: undefined,
        partyId: 0,
        categoryId: 0,
        itemId: 0,
        containerId: 0,
        movementType: '',
        warehouseId: 0,
        quantity: 0,
        unit: ''
    });


    useEffect(() => {
        dispatch(fetchAllInvoice());
        dispatch(fetchContainer());
        dispatch(fetchAllWarehouse());
        dispatch(fetchAllCategory());
        dispatch(fetchAllItem());
        dispatch(fetchById(Number(id)));
    }, [dispatch]);

    useEffect(() => {
          setFormData({
            id: stock?.id,
            businessId: user?.business?.id,
            date: stock?.date ?? '',
            invoiceType: stock?.invoiceType,        
            invoiceId: stock?.invoiceId,
            categoryId: stock?.categoryId,
            itemId: stock?.itemId ?? 0,
            containerId: stock?.containerId ?? 0,
            movementType: stock?.movementType ?? '',
            warehouseId: stock?.warehouseId ?? 0,
            quantity: stock?.quantity ?? 0,
            unit: stock?.unit ?? '',
            createdBy: stock?.createdBy,
            updatedBy: user?.id
          });
    }, [user, stock]);

    // const invoice = useSelector(selectInvoiceById(Number(formData.invoiceId)));
    // const categoryItem = useSelector(selectCategoryById(Number(invoice?.categoryId)));

    const containers = useSelector(selectAllContainer);
    

    useEffect(() => {
        if (user?.business?.id) {
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
            updatedBy: user.id
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
           console.log("Stock formData: ", formData);
            await dispatch(update(formData));
            toast.success("Stock created successfully!");

            //navigate(`/stock/list`);
        } catch (err) {
            toast.error("Failed to update stock.");
        }
    };

    return (
        <div>
        <PageMeta title="Stock Update" description="Form to update a new stock" />
        <PageBreadcrumb pageTitle="Stock Update" />

        <ComponentCard title="Fill up all fields to update a stock">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Ref (if have)</Label>
                    <Select
                        options={invoices.map((i) => ({
                            label: `#${i.id} | ${i.party?.name ?? "No name"}`,
                            value: i.id,
                            invoiceType: i.invoiceType,
                            categoryId: i.categoryId,
                            partyId: i.partyId
                        }))}
                        placeholder="Select invoice type"
                        value={
                            invoices
                            .map((i) => ({
                                label: `#${i.id} | ${i.party?.name ?? "No name"}`,
                                value: i.id,
                                invoiceType: i.invoiceType,
                                categoryId: i.categoryId,
                                partyId: i.partyId
                            }))
                            .find((option) => option.value === formData.invoiceId) || null
                        }
                        onChange={(selectedOption) => {
                        setFormData((prev) => ({
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


                {/* Invoice Type */}
                <div>
                    <Label>Select Movement Type</Label>
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
                    <Label>Select Item</Label>
                    <Select
                        options={
                            items?.map(i => ({
                                label: i.name,
                                value: i.id,
                            })) || []
                        }
                        placeholder="Search and select item"
                        value={
                            items
                            ?.filter(i => i.id === formData.itemId)
                            .map(i => ({ label: i.name, value: i.id })) || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                itemId: Number(selectedOption?.value) || 0,
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
                        options={containers.map((c) => ({
                            label: `${c.containerNo}`,
                            value: c.id,
                        })) || []}
                        placeholder="Search and select item"
                        value={
                            containers
                            ?.filter(c => c.id === formData.containerId)
                            .map((c) => ({
                                label: `${c.containerNo}`,
                                value: c.id,
                            }))
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                containerId: Number(selectedOption!.value),
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

                <div>
                    <Label>Search Unit</Label>
                    <Select
                        options={
                        UnitOptions
                            .map((i) => ({
                                label: `${i.label}`,
                                value: i.value,
                            })) || []
                        }
                        placeholder="Select Unit"
                        value={
                            UnitOptions
                            ?.filter((w) => w.value === formData.unit)
                            .map((w) => ({ label: w.label, value: w.value }))[0] || null
                        }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                unit: selectedOption?.value ?? '',
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
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
