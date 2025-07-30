import { Invoice, InvoiceItem, Stock, Ledger, sequelize } from "../../models/model.js";

export const getAllInvoice = async () => {
    const data = await Invoice.findAll({ 
        include: { 
            model: InvoiceItem, 
            as: 'items' 
        } 
    });

    if (!data || data.length === 0) throw { status: 400, message: "No Invoice found" };
    return data;
}

export const createInvoice = async (req) => {
    const { items, ...invoiceData } = req.body;

    const t = await sequelize.transaction();
    try {

        
        // Step 1: Create Invoice
        const invoice = await Invoice.create(invoiceData, { transaction: t });

        // Determine movementType based on invoice type
        let movementType = null;
        if (invoice.invoiceType === 'purchase') movementType = 'in';
        else if (invoice.invoiceType === 'sale') movementType = 'out';
        else if (invoice.invoiceType === 'return') movementType = 'in';

        // Step 2: Create Invoice Items and Stocks
        if (items && Array.isArray(items)) {
            const invoiceItems = items.map((item) => ({
                invoiceId: invoice.id,
                itemId: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subTotal: item.subTotal
            }));

            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });

            // Create Stock entries
            const stockEntries = items.map((item) => ({
                invoiceType: invoice.invoiceType,
                invoiceId: invoice.id,
                movementType: movementType,
                quantity: item.quantity,
                warehouseId: item.warehouseId || null, // allow null
                itemId: item.itemId,
            }));

            await Stock.bulkCreate(stockEntries, { transaction: t });
        }

        let debitAmount = 0;
        let creditAmount = 0;
        if (invoice.invoiceType === 'purchase'){
            creditAmount = invoice.totalAmount;
        }
        else if (invoice.invoiceType === 'sale'){
            debitAmount = invoice.totalAmount;
        }
        
        // Step 3: create ledger
        await Ledger.create(
            {
                categoryId: invoice.categoryId,
                transactionType: invoice.invoiceType,
                partyId: invoice.partyId,
                date: invoice.date,
                referenceId: invoice.id,
                description: Array.isArray(items)
                ? `${items
                    .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                    .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                : '',
                debit: debitAmount,
                credit: creditAmount,
            }, 
            { transaction: t }
        );

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

    const t = await sequelize.transaction();
    try {
        // Step 1: Find existing invoice
        const invoice = await Invoice.findByPk(id, { transaction: t });
        if (!invoice) {
            throw { status: 404, message: 'Invoice not found' };
        }

        // Step 2: Update invoice
        await invoice.update(invoiceData, { transaction: t });

        // Determine movementType based on updated invoiceType
        let movementType = null;
        if (invoice.invoiceType === 'purchase') movementType = 'in';
        else if (invoice.invoiceType === 'sale') movementType = 'out';
        else if (invoice.invoiceType === 'return') movementType = 'in';

        // Step 3: Remove old items and stocks
        await InvoiceItem.destroy({ where: { invoiceId: id }, transaction: t });
        await Stock.destroy({ where: { invoiceId: id }, transaction: t });

        // Step 4: Re-create Invoice Items and Stocks
        if (items && Array.isArray(items)) {
            const invoiceItems = items.map((item) => ({
                invoiceId: invoice.id,
                itemId: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subTotal: item.subTotal
            }));

            await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });

            const stockEntries = items.map((item) => ({
                invoiceType: invoice.invoiceType,
                invoiceId: invoice.id,
                movementType: movementType,
                quantity: item.quantity,
                warehouseId: item.warehouseId || null, // allow null
                itemId: item.itemId,
            }));

            await Stock.bulkCreate(stockEntries, { transaction: t });
        }

        // Step 5: update ledger
        let debitAmount = 0;
        let creditAmount = 0;
        if (invoice.invoiceType === 'purchase'){
            creditAmount = invoice.totalAmount;
        }
        else if (invoice.invoiceType === 'sale'){
            debitAmount = invoice.totalAmount;
        }

        const ledger = await Ledger.findOne({
            where: { referenceId: invoice.id },
            transaction: t,
        });

        if (ledger) {
            await ledger.update(
                {
                    categoryId: invoice.categoryId,
                    transactionType: invoice.invoiceType,
                    partyId: invoice.partyId,
                    date: invoice.date,
                    referenceId: invoice.id,
                    description: Array.isArray(items)
                    ? `${items
                        .map((item) => `${item.name} x${item.quantity} @${item.price}`)
                        .join(', ')}${invoice.note ? `<br />Note: ${invoice.note}` : ''}`
                    : '',
                    debit: debitAmount,
                    credit: creditAmount,
                },
                { transaction: t }
            );
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
    // Check if invoice exists
    const invoice = await Invoice.findByPk(id, { transaction: t });
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Delete the ledger
    await Ledger.destroy({
      where: { referenceId: id },
      transaction: t,
    });

    // Delete the stock
    await Stock.destroy({
      where: { invoiceId: id },
      transaction: t,
    });

    // Delete related invoice items first
    await InvoiceItem.destroy({
      where: { invoiceId: id },
      transaction: t,
    });

    // Delete the invoice itself
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
