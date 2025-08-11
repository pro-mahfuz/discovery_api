import { Payment, User, Party, Category, Invoice, Ledger, sequelize } from "../../models/model.js";

// ✅ Get All Payments
export const getAllPayment = async () => {
  const data = await Payment.findAll({
    include: [
      {
        model: Party,
        as: "party",
      },
      {
        model: Category,
        as: "category",
      },
      {
        model: Invoice,
        as: "invoice",
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

  if (!data || data.length === 0) throw { status: 400, message: "No payment found" };

  const paymentData = data.map(payment => {
    const paymentRefNo = payment.prefix + "-" + String(payment.id).padStart(6, '0');
    return {
      ...payment.toJSON(),
      paymentRefNo,
      createdByUser: payment.createdByUser?.name ?? null,
      updatedByUser: payment.updatedByUser?.name ?? null,
    };
  });

  return paymentData;
};

// ✅ Create Payment
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

    const payment = await Payment.create(req.body, { transaction: t });

    let debitAmount = 0;
    let creditAmount = 0;
    if (req.body.paymentType === 'payment_in') {
      creditAmount = req.body.amountPaid;
    } else if (req.body.paymentType === 'payment_out') {
      debitAmount = req.body.amountPaid;
    }

    await Ledger.create({
      businessId: req.body.businessId,
      categoryId: req.body.categoryId,
      transactionType: req.body.paymentType,
      partyId: req.body.partyId,
      date: req.body.paymentDate,
      paymentId: payment.id,
      invoiceId: req.body.invoiceId,
      bankId: req.body.bankId,
      description: req.body.note,
      currency: req.body.currency,
      debit: debitAmount,
      credit: creditAmount,
      createdBy: req.body.createdBy
    }, { transaction: t });

    await t.commit();

    const paymentRefNo = payment.prefix + "-" + String(payment.id).padStart(6, "0");

    return {
      ...payment.toJSON(),
      paymentRefNo,
    };

  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Failed to create payment:", error);
    throw error;
  }
};

// ✅ Get Payment By ID
export const getPaymentById = async (id) => {
  const data = await Payment.findByPk(id);
  if (!data) {
    throw { status: 404, message: "Payment not found" };
  }
  return data;
};

// ✅ Update Payment
export const updatePayment = async (req) => {
  const payment = await Payment.findByPk(req.body.id);
  if (!payment) {
    throw { status: 404, message: "Payment not found" };
  }

  const t = await sequelize.transaction();

  try {
    const updatedPayment = await payment.update(req.body, { transaction: t });

    let debitAmount = 0;
    let creditAmount = 0;
    if (req.body.paymentType === 'payment_in') {
      creditAmount = req.body.amountPaid;
    } else if (req.body.paymentType === 'payment_out') {
      debitAmount = req.body.amountPaid;
    }

    const ledger = await Ledger.findOne({
      where: { paymentId: req.body.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!ledger) {
      throw { status: 404, message: "Ledger entry not found" };
    }

    await ledger.update({
      businessId: req.body.businessId,
      categoryId: req.body.categoryId,
      transactionType: req.body.paymentType,
      partyId: req.body.partyId,
      date: req.body.paymentDate,
      paymentId: updatedPayment.id,
      invoiceId: req.body.invoiceId,
      description: req.body.note,
      currency: req.body.currency,
      debit: debitAmount,
      credit: creditAmount,
      createdBy: req.body.createdBy,
      updatedBy: req.body.updatedBy
    }, { transaction: t });

    await t.commit();
    return updatedPayment;

  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
};

// ✅ Delete Payment
export const deletePayment = async (id) => {
  const t = await sequelize.transaction();

  const payment = await Payment.findByPk(id);
  if (!payment) {
    throw new Error("Payment not found");
  }

  try {
    const ledger = await Ledger.findOne({
      where: { paymentId: payment.id },
      transaction: t,
    });

    if (ledger) {
      await ledger.destroy({ transaction: t });
    }

    await payment.destroy({ transaction: t });

    await t.commit();
    return { success: true, message: "Payment and ledger deleted successfully" };

  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
};
