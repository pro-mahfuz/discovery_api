import * as PartyService from "./party.service.js";
import { success, error } from "../../utils/responseHandler.js";

export const getAllParty = async (req, res, next) =>{
    try {
        const parties = await PartyService.getAllParty();
        return success(res, parties, "Response successful");

    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const createParty = async (req, res, next) => {
    try {
        console.log("Party create Request: ", req.body);
        const party = await PartyService.createParty(req);
        return success(res, party, "Party created successfully", 201);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const getPartyById = async (req, res, next) => {
    try {
        const party = await PartyService.getPartyById(req.params.id);
        return success(res, party, "Party retrieved successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const updateParty = async (req, res, next) => {
    try {
        const party = await PartyService.updateParty(req.params.id, req);
        return success(res, party, "Party updated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const activeParty = async (req, res, next) => {
    try {
        const party = await PartyService.activeParty(req.params.id);
        return success(res, party, "Party activated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}

export const deactiveParty = async (req, res, next) => {
    try {
        const party = await PartyService.deactiveParty(req.params.id);
        return success(res, party, "Party deactivated successfully", 200);
    } catch (err) {
        return error(res, err.message, err.status || 500);
    }
}