import { Stock, Business, User, Item, Container, Warehouse } from "../../models/model.js";
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
          literal(`CASE WHEN movementType = 'in' THEN quantity ELSE 0 END`)
        ),
        "totalIn",
      ],

      // Sum quantity where movementType = 'out'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'out' THEN quantity ELSE 0 END`)
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
    const data = await Stock.create(req.body);
    console.log("Stock response body:", data);
    
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
    const data = await Stock.findByPk(req.body.id);
    console.log("Stock: ", data);
    if (!data) {
        throw { status: 404, message: "Stock not found" };
    }

    await data.update(req.body);
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