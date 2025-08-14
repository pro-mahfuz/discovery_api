import { Ledger, Payment, User, Bank, Invoice, Stock, InvoiceItem, Party, Category } from "../../models/model.js";

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
            {
                model: Payment,
                as: 'payment',
            },
            {
                model: Invoice,
                include: [ {model: InvoiceItem, as: "items"}],
                as: 'invoice',
            },
            {
                model: Bank,
                as: 'bank',
            },
            {
                model: Stock,
                as: 'stock',
            },
            {
                model: User,
                as: "createdByUser",
            },
            {
                model: User,
                as: "updatedByUser",
            },
        ],
    });
    if (!data || data.length === 0) throw { status: 400, message: "No Ledger found" };

    const ledgerData = data.map((ledger) => {
        const ledgerJson = ledger.toJSON();

        const isPayment =
            ledgerJson.transactionType === "payment_in" ||
            ledgerJson.transactionType === "payment_out" ||
            ledgerJson.transactionType === "expense";

        let invoiceRefNo = "";
        let paymentRefNo = "";

        if (isPayment && ledgerJson.payment) {
            paymentRefNo = ledgerJson.payment.prefix + "-" + String(ledgerJson.paymentId).padStart(6, "0");
        } 

        invoiceRefNo = ledgerJson.invoice.prefix + "-" + String(ledgerJson.invoiceId).padStart(6, "0");
       

        return {
            ...ledgerJson,
            invoiceRefNo,
            paymentRefNo,
            createdByUser: ledgerJson.createdByUser?.name ?? null,
            updatedByUser: ledgerJson.updatedByUser?.name ?? null,
        };

        
    });

    return ledgerData;
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