import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { sequelize, User, Role, Permission, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

async function seed() {
  await sequelize.sync({ force: true });

  const [admin, manager, sales, purchase] = await Promise.all([
    Role.create({ name: "Admin", action: "admin" }),
    Role.create({ name: "Manager", action: "manager" }),
    Role.create({ name: "Sales", action: "sales" }),
    Role.create({ name: "Purchase", action: "purchase" }),
  ]);


  const [Mahfuz] = await Promise.all([
    User.create({
      name: "Mahfuz",
      email: "admin@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    }),
  ]);

  await Mahfuz.setRole(admin); // Assign admin role to Mahfuz

  const saleRole = await Role.findOne({ where: { name: 'sales' } });
  if (!saleRole) {
    throw new Error('Admin role not found. Make sure roles are seeded first.');
  }

  const usersData = [];

  for (let i = 0; i < 20; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash('password123', 10),
      isActive: true,
    });
  }

  const users = await Promise.all(usersData.map(data => User.create(data)));
  // Assign the same role to all users
  for (const user of users) {
    await user.setRole(saleRole); // make sure `User.belongsTo(Role)` exists
  }

  const permissions = await Permission.bulkCreate([
    { name: "Role Manage", action: "manage_roles" },
    { name: "Permission Manage", action: "manage_permissions" },
    { name: "Dashboard Manage", action: "manage_dashboard" },

    { name: "User Manage", action: "manage_users" },
    { name: "User Create", action: "create_users" },
    { name: "User Edit", action: "edit_users" },
    { name: "User View", action: "view_users" },
    { name: "User Delete", action: "delete_users" },

    { name: "Profile Manage", action: "manage_profile" },
    { name: "Profile Edit", action: "edit_profile" },
    { name: "Profile View", action: "view_profile" },

    { name: "Party Manage", action: "manage_party" },
    { name: "Party Create", action: "create_party" },
    { name: "Party Edit", action: "edit_party" },
    { name: "Party View", action: "view_party" },
    { name: "Party Delete", action: "delete_party" },

    { name: "Category Manage", action: "manage_category" },
    { name: "Category Create", action: "create_category" },
    { name: "Category Edit", action: "edit_category" },
    { name: "Category View", action: "view_category" },
    { name: "Category Delete", action: "delete_category" },

    { name: "Item Manage", action: "manage_item" },
    { name: "Item Create", action: "create_item" },
    { name: "Item Edit", action: "edit_item" },
    { name: "Item View", action: "view_item" },
    { name: "Item Delete", action: "delete_item" },

    { name: "Invoice Manage", action: "manage_invoice" },
    { name: "Invoice Create", action: "create_invoice" },
    { name: "Invoice Edit", action: "edit_invoice" },
    { name: "Invoice View", action: "view_invoice" },
    { name: "Invoice Delete", action: "delete_invoice" },

    { name: "Payment Manage", action: "manage_payment" },
    { name: "Payment Create", action: "create_payment" },
    { name: "Payment Edit", action: "edit_payment" },
    { name: "Payment View", action: "view_payment" },
    { name: "Payment Delete", action: "delete_payment" },

    { name: "Warehouse Manage", action: "manage_warehouse" },
    { name: "Warehouse Create", action: "create_warehouse" },
    { name: "Warehouse Edit", action: "edit_warehouse" },
    { name: "Warehouse View", action: "view_warehouse" },
    { name: "Warehouse Delete", action: "delete_warehouse" },

    { name: "Stock Manage", action: "manage_stock" },
    { name: "Stock Create", action: "create_stock" },
    { name: "Stock Edit", action: "edit_stock" },
    { name: "Stock View", action: "view_stock" },
    { name: "Stock Delete", action: "delete_stock" },

    { name: "Ledger Manage", action: "manage_ledger" },
    { name: "Ledger Create", action: "create_ledger" },
    { name: "Ledger Edit", action: "edit_ledger" },
    { name: "Ledger View", action: "view_ledger" },
    { name: "Ledger Delete", action: "delete_ledger" },
  ]);

  await admin.setPermissions(permissions); // Admin gets all
  
  await manager.setPermissions([
    permissions[7],
    permissions[8],
    permissions[9]
  ]); // Manager gets manage_profile, edit_profile, view_profile
  
  await sales.setPermissions([
    permissions[7],
    permissions[8],
    permissions[9]
  ]); // Sales gets manage_profile, edit_profile, view_profile
  
  await purchase.setPermissions([
    permissions[7],
    permissions[8],
    permissions[9]
  ]); // Purchase gets manage_profile, edit_profile, view_profile

  await Category.bulkCreate([
    {
      name: "Fruit",
      isActive: true,
    },
    {
      name: "Vegetable",
      isActive: true,
    }
  ]);

  await Item.bulkCreate([
    {
      code: "001",
      name: "Orange",
      categoryId: 1,
      isActive: true,
    },
    {
      code: "002",
      name: "Carrot",
      categoryId: 2,
      isActive: true,
    }
  ]);

  console.log("Seed complete");
  process.exit();
}

seed();
// This script seeds the database with initial roles and permissions.
// It creates two roles: admin and user, and assigns permissions to them.