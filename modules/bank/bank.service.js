import { Bank } from "../../models/model.js";

export const getAllBank = async () => {
    const data = await Bank.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No Bank found" };
    return data;
}

export const createBank = async (req) => {
    const data = await Bank.create(req.body);
    console.log("Bank response body:", data);
    
    return data;
}

export const getBankById = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }
    return data;
}

export const updateBank = async (req) => {
    const data = await Bank.findByPk(req.body.id);
    console.log("Bank: ", data);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeBank = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }

    data.isActive = true;

    await data.save();
    return data;
}

export const deactiveBank = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }

    data.isActive = false;

    await data.save();
    return data;
}

export const deleteBank = async (id) => {
      
    const data = await Bank.findByPk(id);
    if (!data) {
      throw new Error("Bank not found");
    }

    data.destroy();

    return data;
}