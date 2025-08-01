import { Business, User } from "../../models/model.js";

export const getAllBusiness = async () => {
    const data = await Business.findAll({ 
        include: { 
            model: User, 
            as: 'users' 
        }  
    });
    
    if (!data || data.length === 0) throw { status: 400, message: "No Business found" };
    return data;
}

export const createBusiness = async (req) => {
    if (req.files) {
        if (req.files.businessLogo) {
            req.body.businessLogo = `/${req.files.businessLogo[0].path.replace(/\\/g, "/")}`;
        }
        if (req.files.businessLicenseCopy) {
            req.body.businessLicenseCopy = `/${req.files.businessLicenseCopy[0].path.replace(/\\/g, "/")}`;
        }
    }
    
    const data = await Business.create(req.body);
    console.log("Business response body:", data);
    
    return data;
}

export const getBusinessById = async (id) => {
    const data = await Business.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Business not found" };
    }
    return data;
}

export const updateBusiness = async (req) => {
    

    const data = await Business.findByPk(req.body.id);
    console.log("Business: ", data);

    if (!data) {
        throw { status: 404, message: "Business not found" };
    }

    if (req.files) {
        if (req.files.businessLogo) {
            req.body.businessLogo = `/${req.files.businessLogo[0].path.replace(/\\/g, "/")}`;
        }
        if (req.files.businessLicenseCopy) {
            req.body.businessLicenseCopy = `/${req.files.businessLicenseCopy[0].path.replace(/\\/g, "/")}`;
        }
    }

    await data.update(req.body);
    return data;
}

export const activeBusiness = async (id) => {
    const data = await Business.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Business not found" };
    }

    data.isActive = true; // Set user as active
    await data.save();
    return data;
}

export const deactiveBusiness = async (id) => {
    const data = await Business.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Business not found" };
    }

    data.isActive = false; // Set user as inactive
    await data.save();
    return data;
}

export const deleteBusiness = async (id) => {
      
    const data = await Business.findByPk(id);
    if (!data) {
      throw new Error("Business not found");
    }

    data.destroy();

    return data;
}