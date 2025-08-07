import { Payment, Ledger, sequelize } from "../../models/model.js";

export const getAllPayment = async () => {
    const data = await Payment.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No payment found" };

    const paymentData = data
    .map(payment => {
        let paymentRefNo = '';
        paymentRefNo = payment.prefix + String(payment.id).padStart(6, '0');
       

        return {
            ...payment.toJSON(),
            paymentRefNo: paymentRefNo.toString(), 
        };
    });

    return paymentData;
}

export const createPayment = async (req) => {

    const t = await sequelize.transaction();

    try {
        const prefixMap = {
            payment_in: "PMI",
            payment_out: "PMO",
            expense: "PME",
        };

        const prefix = prefixMap[req.body.paymentType] || "";

        req.body.prefix = prefix;

        const data = await Payment.create(req.body, { transaction: t });

        let debitAmount = 0;
        let creditAmount = 0;
        if (req.body.paymentType === 'payment_in'){
            creditAmount = req.body.amountPaid;
        }
        if (req.body.paymentType === 'payment_out'){
            debitAmount = req.body.amountPaid;
        }
        await Ledger.create(
            {
                businessId: req.body.businessId,
                categoryId: req.body.categoryId,
                transactionType: req.body.paymentType,
                partyId: req.body.partyId,
                date: req.body.date,
                referenceId: data.id,
                description: req.body.note,
                currency: req.body.currency,
                debit: debitAmount,
                credit: creditAmount,
            }, 
            { transaction: t }
        );

        await t.commit();
        console.log("Payment response body:", data);
        
        return data;

    } catch (error) {
        await t.rollback();
        console.error("Failed to create invoice:", error);
        throw error;
    }
}

export const getPaymentById = async (id) => {
    const data = await Payment.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Payment not found" };
    }
    return data;
}

export const updatePayment = async (req) => {
    const payment = await Payment.findByPk(req.body.id);
    if (!payment) {
        throw { status: 404, message: "Payment not found" };
    }

    const t = await sequelize.transaction();

    try {
        const data = await Payment.update(req.body, { transaction: t });

        let debitAmount = 0;
        let creditAmount = 0;
        if (req.body.paymentType === 'payment_in'){
            creditAmount = req.body.amountPaid;
        } else if (req.body.paymentType === 'payment_out'){
            debitAmount = req.body.amountPaid;
        }

        const ledger = await Ledger.findOne({
            where: { referenceId: req.body.id },
            transaction: t, // Also add transaction here to be safe
            lock: t.LOCK.UPDATE
        });

        if (!ledger) {
            throw { status: 404, message: "Ledger entry not found" };
        }

        await ledger.update({
            businessId: req.body.businessId,
            categoryId: req.body.categoryId,
            transactionType: req.body.paymentType,
            partyId: req.body.partyId,
            date: req.body.date,
            referenceId: data.id,
            description: req.body.note,
            currency: req.body.currency,
            debit: debitAmount,
            credit: creditAmount,
        }, { transaction: t });

        await t.commit();
        return data;

    } catch (err) {
        await t.rollback();
        throw err;
    }

};


export const deletePayment = async (id) => {
    const t = await sequelize.transaction();

    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error("Payment not found");
    }

    try {
        // Find the related ledger entry
        const ledger = await Ledger.findOne({
            where: { referenceId: payment.id },
            transaction: t
        });

        if (ledger) {
            await ledger.destroy({ transaction: t });
        }

        await payment.destroy({ transaction: t });

        await t.commit();

        return { success: true, message: "Payment and ledger deleted successfully" };
    } catch (err) {
        await t.rollback();
        throw err;
    }
};
