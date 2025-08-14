import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { Business, Role, User, Container, Bank, Warehouse, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

export async function discoverySeed(permissions) {
  

  { /* Discovery */ }
  // Business
  const [Discovery] = await Promise.all([
    Business.create({
      businessName: "Discovery Foodstuff Trading Co.",
      businessLicenseNo: "",
      ownerName: "Mr. Aftab",
      email: "discovery@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "557175842",
      address: "Ras Al Khor",
      city: "Dubai",
      country: "UAE",
      postalCode: "00000",
      isActive: true,
    })
  ]);
  
  // Role
  const [root, admin, manager, sale] = await Promise.all([
    Role.create({ businessId: Discovery.id, name: "Root", action: "root", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Admin", action: "admin", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Manager", action: "manager", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Sale Person", action: "sale", isActive: true }),
  ]);

  // Category
  const [Fruit, Vegetable] = await Promise.all([
    Category.create({
      businessId: Discovery.id,
      name: "Fruit",
      isActive: true,
    }),
    Category.create({
      businessId: Discovery.id,
      name: "Vegetable",
      isActive: true,
    })
  ]);

  // Item
  await Item.bulkCreate([
    {
      businessId: Discovery.id,
      code: "001",
      name: "Orange",
      categoryId: 1,
      isActive: true,
    },
    {
      businessId: Discovery.id,
      code: "002",
      name: "Carrot",
      categoryId: 2,
      isActive: true,
    }
  ]);

  // Container
  await Container.bulkCreate([
    {
      businessId: Discovery.id,
      date: "2025-08-10",
      blNo: "BL256325",
      soNo: "SO325684",
      oceanVesselName: "TS KEELUNG",
      voyageNo: "",
      agentDetails: "T.S LINES (U.A.E) L.L.C",
      containerNo: "OTPU6602650/40RH",
      sealNo: "SL325688",
      isActive: true
    },
  ]);

  // Warehouse
  await Warehouse.bulkCreate([
    {
      businessId: Discovery.id,
      name: "Golam Ali Store",
      details: "Golam Ali Store",
      location: "",
      isActive: true,
    }
  ]);

  // Account
  await Bank.bulkCreate([
    {
      businessId: Discovery.id,
      accountName: "Cash In Hand",
      accountNo: "cash-in-hand",
      address: "",
      isActive: true,
    },
  ]);

  // User
  const [Mahfuz, Admin] = await Promise.all([
    User.create({
      businessId: SHMGold.id,
      roleId: root.id,
      name: "Root Admin",
      email: "root@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    }),
    User.create({
      businessId: SHMGold.id,
      roleId: admin.id,
      name: "Admin",
      email: "admin@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    })
  ]);

  // Assign role to user
  await Mahfuz.setRole(root); 
  await Admin.setRole(admin);

  // Assign permission to user
  await root.setPermissions(permissions);
  await admin.setPermissions(permissions);

}
