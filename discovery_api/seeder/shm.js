import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { Business, User, Bank, Warehouse, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

export async function shmSeed(permissions, root, admin, manager, sale) {
  

  { /* SHM Gold */ }
  // Business
  const [SHMGold] = await Promise.all([
    Business.create({
      businessName: "SHM Gold & Jewellery",
      businessLicenseNo: "",
      ownerName: "Mr. Abdul Hoque",
      email: "mollahin3@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "569969296",
      address: "Deira Dubai",
      city: "Dubai",
      country: "UAE",
      postalCode: "00000",
      isActive: true,
    }),
  ]);

  // Category
  const [Currency, Gold] = await Promise.all([
     Category.create({
      businessId: SHMGold.id,
      name: "Currency",
      isActive: true,
    }),
     Category.create({
      businessId: SHMGold.id,
      name: "Gold",
      isActive: true,
    })
  ]);

  // Item
  await Item.bulkCreate([
    {
      businessId: SHMGold.id,
      code: "001",
      name: "AED",
      categoryId: Currency.id,
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      code: "002",
      name: "BDT",
      categoryId: Currency.id,
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      code: "003",
      name: "USD",
      categoryId: Currency.id,
      isActive: true,
    }
  ]);

  // Warehouse
  await Warehouse.bulkCreate([
    {
      businessId: SHMGold.id,
      name: "SHM Store",
      details: "SHM store",
      details: "SHM Store",
      isActive: true,
    }
  ]);

  // Account
  await Bank.bulkCreate([
    {
      business: SHMGold.id,
      accountName: "DS: Cash In Hand",
      accountNo: "ds-cash-in-hand",
      address: "",
      isActive: true,
    },
    {
      business: SHMGold.id,
      accountName: "BD: Cash In Hand",
      accountNo: "bdcash-in-hand",
      address: "",
      isActive: true,
    },
  ]);

  // User
  const [Mahfuz, Admin] = await Promise.all([
    User.create({
      businessId: SHMGold.id,
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
  await Admin.setRole(admin);

  // Assign permission to user
  await root.setPermissions(permissions);
  await admin.setPermissions(permissions);

}
