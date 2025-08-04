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

import { StatusOptions } from "../../types.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { update } from "..//features/containerThunks";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { AppDispatch } from "../../../store/store";
import { selectAllItem } from "../../item/features/itemSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAuth } from "../../auth/features/authSelectors";
import { Container } from "../features/containerTypes.ts";
import { selectContainerById } from "../features/containerSelectors";


export default function ContainerFormForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));
    // console.log("container authUser: ", authUser);
    // console.log("container user: ", user);

    const container = useSelector(selectContainerById(Number(id)));
    console.log("container - ", container);

    useEffect(() => {
        dispatch(fetchParty("all"));
        dispatch(fetchAllItem());
        dispatch(fetchAllCategory());
    }, [dispatch]);


    const items = useSelector(selectAllItem);

    const [formData, setFormData] = useState<Container>({
        id: container?.id,
        businessId: user?.business?.id ?? 0,
        date: container?.date ?? '',
        blNo: container?.blNo ?? '',
        soNo: container?.soNo,
        oceanVesselName: container?.oceanVesselName,
        voyageNo: container?.voyageNo,
        agentDetails: container?.agentDetails,
        placeOfReceipt: container?.placeOfReceipt,
        portOfLoading: container?.portOfLoading,
        portOfDischarge: container?.portOfDischarge,
        placeOfDelivery: container?.placeOfDelivery,
        containerNo: container?.containerNo ?? '',
        sealNo: container?.sealNo,
        itemId: container?.itemId ?? 0,
        containerQuantity: container?.containerQuantity ?? 0,
        containerUnit: container?.containerUnit ?? '',
        stockQuantity: container?.stockQuantity ?? 0,
        stockUnit: container?.stockUnit ?? '',
        isActive: true,
        createdUserId: user?.id
    });

    const handleStatusChange = (value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isActive: value,
        }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            console.log("container updateFormData: ", formData);
            await dispatch(update(formData));
            toast.success("Container updated successfully!");
            
            const categoryId = 0;
            navigate(`/container/${categoryId}/list`);
        } catch (err) {
            toast.error("Failed to create container.");
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
        <PageMeta title="Container Update" description="Form to update a container" />
        <PageBreadcrumb pageTitle="Container Update" />

        <ComponentCard title="Fill up all fields to update a container">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

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
                </div>

                {/* B.L No */}
                <div>
                    <Label>B.L No</Label>
                    <Input
                        type="text"
                        name="blNo"
                        placeholder="Enter B.L No"
                        value={formData.blNo}
                        onChange={handleChange}
                    />
                </div>

                
                <div>
                    <Label>S.O No</Label>
                    <Input
                        type="text"
                        name="soNo"
                        placeholder="Enter S.O No"
                        value={formData.soNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Occean Vessel Name</Label>
                    <Input
                        type="text"
                        name="oceanVesselName"
                        placeholder="Enter Vessel Name"
                        value={formData.oceanVesselName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Voyage No</Label>
                    <Input
                        type="text"
                        name="voyageNo"
                        placeholder="Enter Voyage No"
                        value={formData.voyageNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Agent</Label>
                    <Input
                        type="text"
                        name="agentDetails"
                        placeholder="Enter Agent"
                        value={formData.agentDetails}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Container No</Label>
                    <Input
                        type="text"
                        name="containerNo"
                        placeholder="Enter Container No"
                        value={formData.containerNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Seal No</Label>
                    <Input
                        type="text"
                        name="sealNo"
                        placeholder="Enter Seal No"
                        value={formData.sealNo}
                        onChange={handleChange}
                    />
                </div>

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
                                .filter((i) => i.id === formData.itemId)
                                .map((i) => ({ label: i.name, value: i.id }))[0] || null
                            }
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                itemId: selectedOption?.value ?? 0,
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <Label>Container Quantity</Label>
                    <Input
                        type="text"
                        name="containerQuantity"
                        placeholder="Enter Container Quantity"
                        value={formData.containerQuantity}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Container Unit</Label>
                    <Input
                        type="text"
                        name="containerUnit"
                        placeholder="Enter Container Unit"
                        value={formData.containerUnit}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Stock Quantity</Label>
                    <Input
                        type="number"
                        name="stockQuantity"
                        placeholder="Enter Stock Quantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Stock Unit</Label>
                    <Input
                        type="text"
                        name="stockUnit"
                        placeholder="Enter Stock Unit"
                        value={formData.stockUnit}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Select Status</Label>
                    <Select
                        options={StatusOptions}
                        placeholder="Select status"
                        value={StatusOptions.find(option => option.value === formData.isActive)}
                        onChange={(selected)=> handleStatusChange(selected?.value ?? false)}
                        className="dark:bg-dark-900"
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
