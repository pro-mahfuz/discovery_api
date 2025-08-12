import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { sequelize, Business, User, Role, Permission, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

async function seed() {
  await sequelize.sync({ force: true });

  await Category.bulkCreate([
    {
      name: "Currency",
      isActive: true,
    },
    {
      name: "Gold",
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

  const [root, admin, manager, sale] = await Promise.all([
    Role.create({ name: "Root", action: "root", isActive: true }),
    Role.create({ name: "Admin", action: "admin", isActive: true }),
    Role.create({ name: "Manager", action: "manager", isActive: true }),
    Role.create({ name: "Sale Person", action: "sale", isActive: true }),
  ]);


  const [Discovery, SHMGold] = await Promise.all([
    Business.create({
      businessName: "Discovery Foodstuff Trading Co.",
      businessLicenseNo: "A123456",
      ownerName: "Mr. Aftab",
      email: "discovery@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "555555555",
      address: "Ras Al Khor",
      city: "Dubai",
      Country: "UAE",
      postalCode: "00000",
      isActive: true,
    }),
    Business.create({
      businessName: "Mahfuz Trading",
      businessLicenseNo: "A123457",
      ownerName: "Mr. Abdul Hoque",
      email: "mollahin3@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "555555566",
      address: "Deira Dubai",
      city: "Dubai",
      Country: "UAE",
      postalCode: "00000",
      isActive: true,
    }),
  ]);

  const [Mahfuz, Mollah] = await Promise.all([
    User.create({
      businessId: null,
      name: "Root Admin",
      email: "root@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    }),
    User.create({
      businessId: SHMGold.id,
      name: "Admin",
      email: "admin@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    })
  ]);

  // Assign role to user
  await Mahfuz.setRole(root); 
  await Mollah.setRole(admin);

  // Assign permission to user
  const permissions = await Permission.bulkCreate([
    { name: "Role Manage", action: "manage_roles" },
    { name: "Permission Manage", action: "manage_permissions" },
    { name: "Dashboard Manage", action: "manage_dashboard" },

    { name: "Business Manage", action: "manage_business" },
    { name: "Business Create", action: "create_business" },
    { name: "Business Edit", action: "edit_business" },
    { name: "Business View", action: "view_business" },
    { name: "Business Delete", action: "delete_business" },

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

    { name: "Container Manage", action: "manage_container" },
    { name: "Container Create", action: "create_container" },
    { name: "Container Edit", action: "edit_container" },
    { name: "Container View", action: "view_container" },
    { name: "Container Delete", action: "delete_container" },

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

    { name: "Bank Manage", action: "manage_bank" },
    { name: "Bank Create", action: "create_bank" },
    { name: "Bank Edit", action: "edit_bank" },
    { name: "Bank View", action: "view_bank" },
    { name: "Bank Delete", action: "delete_bank" },

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

  await root.setPermissions(permissions);
  await admin.setPermissions(permissions);
  

  

  console.log("Seed complete");
  process.exit();
}

seed();
// This script seeds the database with initial roles and permissions.
// It creates two roles: admin and user, and assigns permissions to them.