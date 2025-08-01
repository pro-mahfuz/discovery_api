import * as PaymentService from "./payment.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllPayment = async (req, res, next) =>{
    try {
        const data = await PaymentService.getAllPayment();
        return success(res, data, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createPayment = async (req, res, next) => {
    try {
        console.log("Payment create Request: ", req.body);
        const data = await PaymentService.createPayment(req);
        return success(res, data, "Payment created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getPaymentById = async (req, res, next) => {
    try {
        const data = await PaymentService.getPaymentById(req.params.id);
        return success(res, data, "Payment retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updatePayment = async (req, res, next) => {
    try {
        const data = await PaymentService.updatePayment(req);
        return success(res, data, "Payment updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deletePayment = async (req, res, next) => {
    try {
        const data = await PaymentService.deletePayment(req.params.id);
        return success(res, data, "Payment deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}