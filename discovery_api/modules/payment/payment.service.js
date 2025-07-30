import { Payment, Ledger, sequelize } from "../../models/model.js";

export const getAllPayment = async () => {
    const data = await Payment.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No payment found" };
    return data;
}

export const createPayment = async (req) => {

    const t = await sequelize.transaction();

    const data = await Payment.create(req.body, { transaction: t });

    let debitAmount = 0;
    let creditAmount = 0;
    if (req.body.paymentType === 'payment_in'){
        creditAmount = req.body.amountPaid;
    }
    else if (req.body.paymentType === 'payment_out'){
        debitAmount = req.body.amountPaid;
    }

    await Ledger.create(
        {
            categoryId: req.body.categoryId,
            transactionType: req.body.paymentType,
            partyId: req.body.partyId,
            date: req.body.date,
            referenceId: data.id,
            description: req.body.note,
            debit: debitAmount,
            credit: creditAmount,
        }, 
        { transaction: t }
    );

    await t.commit();
    console.log("Payment response body:", data);
    
    return data;
}

export const getPaymentById = async (id) => {
    const data = await Payment.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Payment not found" };
    }
    return data;
}

export const updatePayment = async (req) => {
    const data = await Payment.findByPk(req.body.id);
    console.log("Payment: ", data);
    if (!data) {
        throw { status: 404, message: "Payment not found" };
    }

    await data.update(req.body);
    return data;
}

export const deletePayment = async (id) => {
      
    const data = await Payment.findByPk(id);
    if (!data) {
      throw new Error("Payment not found");
    }

    data.destroy();

    return data;
}