import * as yup from "yup";

export const containerSchema = yup.object({
  date: yup
    .string()
    .required("Date is required"),

  blNo: yup
    .string()
    .required("B.L No is required"),

  soNo: yup
    .string()
    .required("S.O No is required"),

  oceanVesselName: yup
    .string()
    .required("Ocean Vessel Name is required"),

  voyageNo: yup
    .string()
    .required("Voyage No is required"),

  agentDetails: yup
    .string()
    .required("Voyage No is required"),

//   placeOfReceipt: yup
//     .string()
//     .required("Voyage No is required"),

//   portOfLoading: yup
//     .string()
//     .required("Voyage No is required"),

//   portOfDischarge: yup
//     .string()
//     .required("Voyage No is required"),

//   placeOfDelivery: yup
//     .string()
//     .required("Voyage No is required"),

  containerNo: yup
    .string()
    .required("Conainer No is required"),

  containerQuantity: yup
    .string()
    .required("Conainer Quantity No is required"),

  containerUnit: yup
    .string()
    .required("Container Unit is required"),

  stockQuantity: yup
    .string()
    .required("Stock Quantity is required"),

  stockUnit: yup
    .string()
    .required("Stock Unit is required"),

});