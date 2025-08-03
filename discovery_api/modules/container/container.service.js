
import { Container } from "../../models/model.js";

export const getAllContainer = async () => {
    const data = await Container.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No Container found" };
    return data;
}

export const createContainer = async (req) => {
    const data = await Container.create(req.body);
    console.log("Container response body:", data);
    
    return data;
}

export const getContainerById = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }
    return data;
}

export const updateContainer = async (req) => {
    const data = await Container.findByPk(req.body.id);
    console.log("Container: ", data);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeContainer = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    data.isActive = true; // Set Container as active
    await data.save();
    return data;
}

export const deactiveContainer = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    data.isActive = false; // Set Container as inactive
    await data.save();
    return data;
}