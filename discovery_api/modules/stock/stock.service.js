import invoice from "../../models/invoice.js";
import { Stock, Business, User, Item, Container, Ledger, Warehouse, sequelize } from "../../models/model.js";
import { fn, col, literal } from "sequelize";


export const getAllStock = async () => {
    const data = await Stock.findAll({
        include: [
            {
                model: Business,
                as: "business",
            },
            {
                model: Item,
                as: "item",
            },
            {
                model: Container,
                as: "container",
            },
            {
                model: Warehouse,
                as: "warehouse",
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
    if (!data || data.length === 0) throw { status: 400, message: "No stock found" };

    const stockData = data.map((stock) => {
        return {
            ...stock.toJSON(),
            createdByUser: stock.createdByUser?.name ?? null,
            updatedByUser: stock.updatedByUser?.name ?? null,
        };
    });

    return stockData;
}

export const getStockReport = async () => {
  const data = await Stock.findAll({
    attributes: [
      "containerId",
      "itemId",

      // Sum quantity where movementType = 'in'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'stock_in' THEN quantity ELSE 0 END`)
        ),
        "totalIn",
      ],

      // Sum quantity where movementType = 'out'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'stock_out' THEN quantity ELSE 0 END`)
        ),
        "totalOut",
      ],

      // Sum quantity where movementType = 'damaged'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'damaged' THEN quantity ELSE 0 END`)
        ),
        "totalDamaged",
      ],
    ],
    include: [
      {
        model: Container,
        as: "container",
      },
      {
        model: Item,
        as: "item",
      },
    ],
    group: ["containerId", "itemId", "container.id", "item.id"],
  });

  if (!data || data.length === 0) {
    throw { status: 400, message: "No stock found" };
  }

  return data.map((d) => {
    const json = d.toJSON();
    return {
      ...json,
      totalIn: Number(json.totalIn),
      totalOut: Number(json.totalOut),
      totalDamaged: Number(json.totalDamaged),
    };
  });
};

export const createStock = async (req) => {
  console.log("req.body: ", req.body);

  const t = await sequelize.transaction();

  const data = await Stock.create(req.body, { transaction: t });
  console.log("Stock response body:", data);

  let debitQty = 0;
  let creditQty = 0;
  if (req.body.movementType === 'stock_out') {
    creditQty = req.body.quantity;
  } else if (req.body.movementType === 'stock_in') {
    debitQty = req.body.quantity;
  }

  const item = await Item.findByPk(req.body.itemId);

  const ledgerType = "currency";
  if(ledgerType === "currency"){
    await Ledger.create({
      businessId: req.body.businessId,
      categoryId: req.body.categoryId,
      invoiceId: req.body.invoiceId,
      transactionType: req.body.movementType,
      partyId: req.body.partyId,
      date: req.body.paymentDate,
      stockId: data.id,
      debitQty: debitQty,
      creditQty: creditQty,
      currency: item.name,
      updatedBy: req.body.updatedBy
    }, { transaction: t });
  }

  await t.commit();
    
  return data;
}

export const getStockById = async (id) => {
    const data = await Stock.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Stock not found" };
    }
    return data;
}

export const updateStock = async (req) => {
  const t = await sequelize.transaction();

  const data = await Stock.findByPk(req.body.id);
  console.log("req.body: ", req.body);
  console.log("Stock: ", data);
  if (!data) {
      throw { status: 404, message: "Stock not found" };
  }

  await data.update(req.body);

  let debitQty = 0;
  let creditQty = 0;
  if (req.body.movementType === 'stock_out') {
    creditQty = req.body.quantity;
  } else if (req.body.movementType === 'stock_in') {
    debitQty = req.body.quantity;
  }

  const item = await Item.findByPk(req.body.itemId)

  const ledger = await Ledger.findOne({
    where: { stockId: req.body.id },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  console.log("Ledger- ", ledger);

  if (!ledger) {
    throw { status: 404, message: "Ledger entry not found" };
  }

  const ledgerType = "currency";

  if(ledgerType === "currency"){
    await Ledger.update({
      businessId: req.body.businessId,
      categoryId: req.body.categoryId,
      invoiceId: req.body.invoiceId,
      transactionType: req.body.movementType,
      partyId: req.body.partyId,
      date: req.body.paymentDate,
      stockId: data.id,

      debitQty: debitQty,
      creditQty: creditQty,
      currency: item.name,
      updatedBy: req.body.updatedBy
  }, { transaction: t });
  }
  

  await t.commit();
  return data;
}

export const deleteStock = async (id) => {
      
    const data = await Stock.findByPk(id);
    if (!data) {
      throw new Error("Stock not found");
    }

    data.destroy();

    return data;
}