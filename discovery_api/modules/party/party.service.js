
import { Party } from "../../models/model.js";

export const getAllParty = async () => {
    const party = await Party.findAll();
    if (!party || party.length === 0) throw { status: 400, message: "No Partys found" };
    return party;
}

export const createParty = async (req) => {
    const party = await Party.create(req.body);
    console.log("Party response body:", Party);
    
    return party;
}

export const getPartyById = async (id) => {
    const party = await Party.findByPk(id);
    if (!party) {
        throw { status: 404, message: "Party not found" };
    }
    return party;
}

export const updateParty = async (id, req) => {
    const party = await Party.findByPk(id);
    console.log("party: ", party);
    if (!party) {
        throw { status: 404, message: "Party not found" };
    }

    await party.update(req.body);
    return party;
}

export const activeParty = async (id) => {
    const party = await Party.findByPk(id);
    if (!party) {
        throw { status: 404, message: "Party not found" };
    }

    party.isActive = true; // Set Party as active
    await Party.save();
    return party;
}

export const deactiveParty = async (id) => {
    const party = await Party.findByPk(id);
    if (!party) {
        throw { status: 404, message: "Party not found" };
    }

    party.isActive = false; // Set Party as inactive
    await party.save();
    return party;
}