import { Invoice, InvoiceItem, User, Payment, Item, Container, Stock, Ledger, Category, Party, sequelize } from "../../models/model.js";

export const getAllInvoice = async () => {
    const data = await Invoice.findAll({
        include: [
            {
                model: InvoiceItem,
                as: "items",
            },
            {
                model: Category,
                as: "category",
            },
            {
                model: Party,
                as: "party",
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

    if (!data || data.length === 0) throw { status: 400, message: "No Invoice found" };


    const invoiceData = data
    .map(invoice => {
        let invoiceNo = '';
        invoiceNo = invoice.prefix + "-" + String(invoice.id).padStart(6, '0');
       

        return {
            ...invoice.toJSON(),
            invoiceNo,
            createdByUser: invoice.createdByUser?.name ?? null,
            updatedByUser: invoice.updatedByUser?.name ?? null,
        };
    });
    
    return invoiceData;
}

export const getSaleReport = async () => {
    const data = await InvoiceItem.findAll({
        include: [
            {
                model: Invoice,
                as: "invoice",
                where: { invoiceType: "sale" },
                include: [{ model: Party, as: "party"}]
            },
            {
                model: Item,
                as: "item",
            },
            {
                model: Container,
                as: "container",
            },
        ],
    });

    if (!data || data.length === 0) throw { status: 400, message: "No Invoice found" };

    return data.filter(
    (invoiceItem) =>
      invoiceItem.invoice &&
      invoiceItem.invoice.invoiceType === "sale"
    );
}

export const getSalePaymentReport = async () => {
  const data = await Invoice.findAll({
    where: { invoiceType: "sale" },
    include: [
      { model: Party, as: "party" },
      { model: Payment, as: "payments" },
    ],
  });

  if (!data || data.length === 0) {
    throw { status: 400, message: "No Invoice found" };
  }

  // Add totalPaidAmount to each invoice
  const result = data.map(invoice => {

    const invoiceNo = invoice.prefix + "-" + String(invoice.id).padStart(6, '0');

    const totalPaidAmount = invoice.payments?.reduce(
      (sum, payment) => sum + (Number(payment.amountPaid) || 0),
      0
    ) || 0;

    return {
      ...invoice.toJSON(),
      invoiceNo,
      totalPaidAmount,
    };
  });

  return result;
};


export const createInvoice = async (req) => {
    const { items, ...invoiceData } = req.body;

    const t = await sequelize.transaction();
    try {
        const prefixMap = {
            purchase: "PCO",
            sale: "SLO",
            purchaseReturn: "PCR",
            saleReturn: "SLR",
        };

        const prefix = prefixMap[invoiceData.invoiceType] || "";
        invoiceData.prefix = prefix;
        
        // Step 1: Create Invoice
        const invoice = await Invoice.create(invoiceData, { transaction: t });

        // Step 2: Create Invoice Items and Stocks
        if (items && Array.isArray(items)) {
            const invoiceItems = items.map((item) => ({
                invoiceId: invoice.id,
                itemId: item.itemId,
                containerId: item.containerId,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                subTotal: item.subTotal
            }));

            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }

        let debitAmount = 0;
        let creditAmount = 0;
        let debitQty = 0;
        let creditQty = 0;
        if (invoice.invoiceType === 'purchase'){
            creditAmount = invoice.totalAmount;
            creditQty = items[0].quantity;
        }
        else if (invoice.invoiceType === 'sale'){
            debitAmount = invoice.totalAmount;
            debitQty = items[0].quantity;
        }
        else if (invoice.invoiceType === 'saleReturn'){
            creditAmount = invoice.totalAmount;
            creditQty = invoice.items[0].quantity;
        }
        
        const category = await Category.findByPk(req.body.categoryId);

        // Step 3: create ledger
        await Ledger.create(
            {
                businessId: invoice.businessId,
                categoryId: invoice.categoryId,
                transactionType: invoice.invoiceType,
                partyId: invoice.partyId,
                date: invoice.date,
                invoiceId: invoice.id,
                description: Array.isArray(items)
                ? `${items
                    .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                    .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                : '',
                currency: req.body.currency,
                debit: debitAmount,
                credit: creditAmount,
                createdBy: invoice.createdBy,
            }, 
            { transaction: t }
        );

        if( ["currency", "gold"].includes(category.name.toLowerCase()) ) {
       
            await Ledger.create(
                {
                    businessId: invoice.businessId,
                    categoryId: invoice.categoryId,
                    transactionType: invoice.invoiceType,
                    partyId: invoice.partyId,
                    date: invoice.date,
                    invoiceId: invoice.id,
                    description: Array.isArray(items)
                    ? `${items
                        .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                        .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                    : '',
                    currency: items[0].name,
                    debitQty: ["currency", "gold"].includes(category.name.toLowerCase()) ? debitQty : 0,
                    creditQty: ["currency", "gold"].includes(category.name.toLowerCase()) ? creditQty : 0,
                    createdBy: invoice.createdBy,
                }, 
                { transaction: t }
            )
        }

        

        await t.commit();

        // Fetch and return invoice with its items
        const createdInvoiceWithItems = await Invoice.findByPk(invoice.id, {
            include: [
                {
                    model: InvoiceItem,
                    as: "items",
                },
            ],
        });

        console.log("Invoice with items created:", createdInvoiceWithItems.id);
        return createdInvoiceWithItems;

    } catch (error) {
        await t.rollback();
        console.error("Failed to create invoice:", error);
        throw error;
    }
}


export const getInvoiceById = async (id) => {
    const data = await Invoice.findByPk(id, { 
        include: { 
            model: InvoiceItem, 
            as: 'items' 
        } 
    });
    
    if (!data) {
        throw { status: 404, message: "Invoice not found" };
    }
    return data;
}

export const updateInvoice = async (req) => {
  const { id } = req.body;
    const { items, ...invoiceData } = req.body;

    const prefixMap = {
        purchase: "PCO",
        sale: "SLO",
        purchaseReturn: "PCR",
        saleReturn: "SLR",
    };

    const prefix = prefixMap[invoiceData.invoiceType] || "";

    invoiceData.prefix = prefix;

    const t = await sequelize.transaction();
    try {
        // Step 1: Find existing invoice
        const invoice = await Invoice.findByPk(id, { transaction: t });
        if (!invoice) {
            throw { status: 404, message: 'Invoice not found' };
        }

        // Step 2: Update invoice
        await invoice.update(invoiceData, { transaction: t });

        // Step 3: Remove old items and stocks
        await InvoiceItem.destroy({ where: { invoiceId: id }, transaction: t });
        //await Stock.destroy({ where: { invoiceId: id }, transaction: t });

        // Step 4: Re-create Invoice Items and Stocks
        if (items && Array.isArray(items)) {
            const invoiceItems = items.map((item) => ({
                invoiceId: invoice.id,
                itemId: item.itemId,
                containerId: item.containerId,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                subTotal: item.subTotal
            }));

            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }

        // Step 5: update ledger
        let debitAmount = 0;
        let creditAmount = 0;
        let debitQty = 0;
        let creditQty = 0;
        if (invoice.invoiceType === 'purchase'){
            creditAmount = invoice.totalAmount;
            creditQty = items[0].quantity;
        }
        else if (invoice.invoiceType === 'sale'){
            debitAmount = invoice.totalAmount;
            debitQty = items[0].quantity;
        }
        else if (invoice.invoiceType === 'saleReturn'){
            creditAmount = invoice.totalAmount;
            creditQty = items[0].quantity;
        }

        const category = await Category.findByPk(req.body.categoryId);

        await Ledger.destroy({
            where: { invoiceId: invoice.id },
            transaction: t,
        });

        await Ledger.create(
            {
                businessId: invoice.businessId,
                categoryId: invoice.categoryId,
                transactionType: invoice.invoiceType,
                partyId: invoice.partyId,
                date: invoice.date,
                invoiceId: invoice.id,
                description: Array.isArray(items)
                ? `${items
                    .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                    .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                : '',
                currency: req.body.currency,
                debit: debitAmount,
                credit: creditAmount,
                createdBy: invoice.createdBy,
            }, 
            { transaction: t }
        );

        if( ["currency", "gold"].includes(category.name.toLowerCase()) ) {
            await Ledger.create(
                {
                    businessId: invoice.businessId,
                    categoryId: invoice.categoryId,
                    transactionType: invoice.invoiceType,
                    partyId: invoice.partyId,
                    date: invoice.date,
                    invoiceId: invoice.id,
                    description: Array.isArray(items)
                    ? `${items
                        .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                        .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                    : '',
                    currency: items[0].name,
                    debitQty: ["currency", "gold"].includes(category.name.toLowerCase()) ? debitQty : 0,
                    creditQty: ["currency", "gold"].includes(category.name.toLowerCase()) ? creditQty : 0,
                    createdBy: invoice.createdBy,
                }, 
                { transaction: t }
            )
        }


        await t.commit();

        // Step 5: Return updated invoice with its items
        const updatedInvoiceWithItems = await Invoice.findByPk(invoice.id, {
            include: [
                {
                    model: InvoiceItem,
                    as: "items",
                },
            ],
        });

        console.log("Invoice updated:", updatedInvoiceWithItems.id);
        return updatedInvoiceWithItems;

    } catch (error) {
        await t.rollback();
        console.error("Failed to update invoice:", error);
        throw error;
    }
};

export const deleteInvoice = async (req) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Invoice ID is required");
  }

  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Payment, as: "payments" }, // include payments
        { model: Stock, as: "stocks" },     // include stocks
      ],
      transaction: t,
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.payments && invoice.payments.length > 0) {
      throw new Error("You cannot delete this invoice because it has payment references");
    }

    if (invoice.stocks && invoice.stocks.length > 0) {
      throw new Error("You cannot delete this invoice because it has stock references");
    }

    await Ledger.destroy({
      where: { invoiceId: id },
      transaction: t,
    });

    await InvoiceItem.destroy({
      where: { invoiceId: id },
      transaction: t,
    });

    await Invoice.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return {
      success: true,
      message: "Invoice and its items deleted successfully",
    };
  } catch (error) {
    await t.rollback();
    console.error("Failed to delete invoice:", error);
    throw error;
  }
};

