
import { Party } from "../../models/model.js";

export const getAllParty = async (req) => {
  try {
    const { type } = req.params;

    if (!type) {
      throw { status: 400, message: "Type parameter is required" };
    }

    let party;

    if(type == "all"){
        party = await Party.findAll();
    }else{
        party = await Party.findAll({ where: { type } });
    }

    

    if (!party || party.length === 0) {
      throw { status: 404, message: "No parties found" };
    }

    return await Party.findAll();
  } catch (err) {
    // Optional: add logging here
    throw err;
  }
};

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