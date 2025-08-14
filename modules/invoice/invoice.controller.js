import * as InvoiceService from "./invoice.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllInvoice = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getAllInvoice();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getSaleReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSaleReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getSalePaymentReport = async (req, res, next) =>{
    try {
        const data = await InvoiceService.getSalePaymentReport();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createInvoice = async (req, res, next) => {
    try {
        console.log("Invoice create Request: ", req.body);
        const data = await InvoiceService.createInvoice(req);
        return success(res, data, "Invoice created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getInvoiceById = async (req, res, next) => {
    try {
        const data = await InvoiceService.getInvoiceById(req.params.id);
        return success(res, data, "Invoice retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateInvoice = async (req, res, next) => {
    try {
        const data = await InvoiceService.updateInvoice(req);
        return success(res, data, "Invoice updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}


export const deleteInvoice = async (req, res, next) => {
    try {
        const data = await InvoiceService.deleteInvoice(req);
        return success(res, data, "Invoice deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}