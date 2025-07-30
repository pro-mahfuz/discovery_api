import { Ledger, Party, Category } from "../../models/model.js";

export const getAllLedger = async () => {
    const data = await Ledger.findAll({
        include: [
            {
                model: Party,
                as: 'party',
            },
            {
                model: Category,
                as: 'category',
            },
        ],
    });
    if (!data || data.length === 0) throw { status: 400, message: "No Ledger found" };
    return data;
}

export const createLedger = async (req) => {
    const data = await Ledger.create(req.body);
    console.log("Ledger response body:", data);
    
    return data;
}

export const getLedgerById = async (id) => {
    const data = await Ledger.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Ledger not found" };
    }
    return data;
}

export const updateLedger = async (req) => {
    const data = await Ledger.findByPk(req.body.id);
    console.log("Ledger: ", data);
    if (!data) {
        throw { status: 404, message: "Ledger not found" };
    }

    await data.update(req.body);
    return data;
}

export const deleteLedger = async (id) => {
      
    const data = await Ledger.findByPk(id);
    if (!data) {
      throw new Error("Ledger not found");
    }

    data.destroy();

    return data;
}