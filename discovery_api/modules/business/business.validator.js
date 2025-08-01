import * as yup from "yup";

export const businessSchema = yup.object({
  businessName: yup.string().trim().required("Business Name is required"),
  businessLicenseNo: yup.string().trim().required("Business License No is required"),
  ownerName: yup.string().trim().required("Owner Name is required"),
  email: yup.string().email().required("Email is required"),
  countryCode: yup.string().trim().required("countryCode is required"),
  phoneCode: yup.string().trim().required("phoneCode is required"),
  phoneNumber: yup.string().trim().required("phoneNumber is required"),
  address: yup.string().trim().required("Address is required"),
  city: yup.string().trim().required("City is required"),
  country: yup.string().trim().required("Country is required"),
  postalCode: yup.string().trim().required("Postal code is required"),
});