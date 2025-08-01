import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI);

// import your model here...
import defineBusiness from './business.js';
import defineUser from './user.js';
import defineProfile from './profile.js';
import defineRole from './role.js';
import definePermission from './permission.js';
import defineRolePermission from './rolePermission.js';
import defineTokenStore from './tokenStore.js';
import defineParty from './party.js';
import defineCategory from './category.js';
import defineItem from './item.js';
import defineInvoice from './invoice.js';
import defineInvoiceItem from './invoiceItem.js';
import definePayment from './payment.js';
import defineLedger from './ledger.js';
import defineWarehouse from './warehouse.js';
import defineStock from './stock.js';

// define your model here...
const Business = defineBusiness(sequelize, Sequelize.DataTypes);
const User = defineUser(sequelize, Sequelize.DataTypes);
const Profile = defineProfile(sequelize, Sequelize.DataTypes);
const Role = defineRole(sequelize, Sequelize.DataTypes);
const Permission = definePermission(sequelize, Sequelize.DataTypes);
const RolePermission = defineRolePermission(sequelize, Sequelize.DataTypes);
const TokenStore = defineTokenStore(sequelize, Sequelize.DataTypes);
const Party = defineParty(sequelize, Sequelize.DataTypes);
const Category = defineCategory(sequelize, Sequelize.DataTypes);
const Item = defineItem(sequelize, Sequelize.DataTypes);
const Invoice = defineInvoice(sequelize, Sequelize.DataTypes);
const InvoiceItem = defineInvoiceItem(sequelize, Sequelize.DataTypes);
const Payment = definePayment(sequelize, Sequelize.DataTypes);
const Ledger = defineLedger(sequelize, Sequelize.DataTypes);
const Warehouse = defineWarehouse(sequelize, Sequelize.DataTypes);
const Stock = defineStock(sequelize, Sequelize.DataTypes);

// define your model for associate relations here...
const models = { Business, User, Profile, Role, Permission, RolePermission, TokenStore, Party, Category, Item, Invoice, InvoiceItem, Payment, Ledger, Warehouse, Stock };
// Call associate on each model if defined
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// export your model here...
export {
  sequelize,
  Business,
  User,
  Profile,
  Role,
  Permission,
  RolePermission,
  TokenStore,
  Party,
  Category,
  Item,
  Invoice,
  InvoiceItem,
  Payment,
  Ledger,
  Warehouse,
  Stock

};
// This code initializes a Sequelize connection to a database using environment variables.
// It imports model definitions for User, Role, Permission, and RolePermission,