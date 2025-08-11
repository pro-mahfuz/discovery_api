import { Router } from "express";

import { upload } from "../middleware/fileUpload.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";

import { businessSchema } from "../modules/business/business.validator.js";
import { userSchema } from "../modules/user/user.validator.js";
import { profileSchema } from "../modules/profile/profile.validator.js";
import { partySchema } from "../modules/party/party.validator.js";
import { categorySchema } from "../modules/category/category.validator.js";
import { itemSchema } from "../modules/item/item.validator.js";
import { containerSchema } from "../modules/container/container.validator.js";
import { invoiceSchema } from "../modules/invoice/invoice.validator.js";
import { paymentSchema } from "../modules/payment/payment.validator.js";
import { stockSchema } from "../modules/stock/stock.validator.js";
import { warehouseSchema } from "../modules/warehouse/warehouse.validator.js";
import { bankSchema } from "../modules/bank/bank.validator.js";

import * as BusinessController from "../modules/business/business.controller.js";
import * as UserController from "../modules/user/user.controller.js";
import * as ProfileController from "../modules/profile/profile.controller.js";
import * as AuthController from "../modules/auth/auth.controller.js";
import * as RoleController from "../modules/role/role.controller.js";
import * as PermissionController from "../modules/permission/permission.controller.js";
import * as PartyController from "../modules/party/party.controller.js";
import * as CategoryController from "../modules/category/category.controller.js";
import * as ItemController from "../modules/item/item.controller.js";
import * as ContainerController from "../modules/container/container.controller.js";
import * as InvoiceController from "../modules/invoice/invoice.controller.js";
import * as PaymentController from "../modules/payment/payment.controller.js";
import * as StockController from "../modules/stock/stock.controller.js";
import * as WarehouseController from "../modules/warehouse/warehouse.controller.js";
import * as BankController from "../modules/bank/bank.controller.js";
import * as LedgerController from "../modules/ledger/ledger.controller.js";

const router = Router();

// Route accessible only by 'authorize' middleware to check if the user has permission
// This route uses the 
router.post("/logout", AuthController.logout);
router.post("/logoutAll", AuthController.logoutAll);

/*---Roles & Permissions---*/
router.get("/roles", authorize("manage_roles"), RoleController.getAllRoles);
router.post("/roles/:id/active", authorize("manage_roles"), RoleController.activeRole);
router.post("/roles/:id/deactive", authorize("manage_roles"), RoleController.deactiveRole);

router.get("/permissions", authorize("manage_permissions"), PermissionController.getAllPermissions);
router.post("/set-permissions", authorize("manage_permissions"), PermissionController.setPermissionsForRole );
router.get("/get-permissions/:roleId", authorize("manage_permissions"), PermissionController.getPermissionsForRole );

/*---Business---*/
router.get("/business/list", authorize("manage_business"), BusinessController.getAllBusiness);
router.post("/business/create", authorize("create_business"), upload.fields([
    { name: 'businessLogo', maxCount: 1 },
    { name: 'businessLicenseCopy', maxCount: 1 }
  ]), validate(businessSchema), BusinessController.createBusiness);
router.get("/business/:id/view", authorize("view_business"), BusinessController.getBusinessById);
router.put("/business/update", authorize("edit_business"), upload.fields([
    { name: 'businessLogo', maxCount: 1 },
    { name: 'businessLicenseCopy', maxCount: 1 }
  ]), validate(businessSchema), BusinessController.updateBusiness);
router.post("/business/:id/active", authorize("manage_business"), BusinessController.activeBusiness);
router.post("/business/:id/deactive", authorize("manage_business"), BusinessController.deactiveBusiness);
router.post("/business/:id/delete", authorize("delete_business"), BusinessController.deleteBusiness);

/*---Profile---*/
router.post("/profile/:id", authorize("manage_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.createProfile);
router.get("/profile/:id", authorize("view_profile"), ProfileController.getProfileById);
router.put("/profile/:id", authorize("edit_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.updateProfileById);

/*---Users---*/
router.get("/user/list", authorize("manage_users"), UserController.getAllUser);
router.post("/user/create", authorize("create_users"), validate(userSchema), UserController.createUser);
router.get("/user/:id/view", authorize("view_users"), UserController.getUserById);
router.put("/user/update", authorize("edit_users"), validate(userSchema), UserController.updateUser);
router.post("/user/:id/active", authorize("manage_users"), UserController.activeUser);
router.post("/user/:id/deactive", authorize("manage_users"), UserController.deactiveUser);

/*---Party---*/
router.get("/party/:type/list", authorize("manage_party"), PartyController.getAllParty);
router.post("/party/create", authorize("create_party"), validate(partySchema), PartyController.createParty);
router.get("/party/:id", authorize("view_party"), PartyController.getPartyById);
router.put("/party/:id", authorize("edit_party"), validate(partySchema), PartyController.updateParty);
router.post("/party/:id/active", authorize("manage_party"), PartyController.activeParty);
router.post("/party/:id/deactive", authorize("manage_party"), PartyController.deactiveParty);

/*---Category---*/
router.get("/category/list", authorize("manage_category"), CategoryController.getAllCategory);
router.post("/category/create", authorize("create_category"), validate(categorySchema), CategoryController.createCategory);
router.get("/category/:id", authorize("view_category"), CategoryController.getCategoryById);
router.put("/category/update", authorize("edit_category"), validate(categorySchema), CategoryController.updateCategory);
router.post("/category/:id/active", authorize("manage_category"), CategoryController.activeCategory);
router.post("/category/:id/deactive", authorize("manage_category"), CategoryController.deactiveCategory);

/*---Item---*/
router.get("/item/list", authorize("manage_item"), ItemController.getAllItem);
router.post("/item/create", authorize("create_item"), validate(itemSchema), ItemController.createItem);
router.get("/item/:id", authorize("view_item"), ItemController.getItemById);
router.put("/item/update", authorize("edit_item"), validate(itemSchema), ItemController.updateItem);
router.post("/item/:id/active", authorize("manage_item"), ItemController.activeItem);
router.post("/item/:id/deactive", authorize("manage_item"), ItemController.deactiveItem);

/*---Container---*/
router.get("/container/list", authorize("manage_container"), ContainerController.getAllContainer);
router.post("/container/create", authorize("create_container"), validate(containerSchema), ContainerController.createContainer);
router.get("/container/:id/view", authorize("view_container"), ContainerController.getContainerById);
router.put("/container/update", authorize("edit_container"), validate(containerSchema), ContainerController.updateContainer);
router.post("/container/:id/delete", authorize("delete_container"), ContainerController.deactiveContainer);

/*---Invoice---*/
router.get("/invoice/list", authorize("manage_invoice"), InvoiceController.getAllInvoice);
router.post("/invoice/create", authorize("create_invoice"), validate(invoiceSchema), InvoiceController.createInvoice);
router.get("/invoice/:id/view", authorize("view_invoice"), InvoiceController.getInvoiceById);
router.put("/invoice/update", authorize("edit_invoice"), validate(invoiceSchema), InvoiceController.updateInvoice);
router.post("/invoice/:id/delete", authorize("delete_invoice"), InvoiceController.deleteInvoice);

/*---Payment---*/
router.get("/payment/list", authorize("manage_payment"), PaymentController.getAllPayment);
router.post("/payment/create", authorize("create_payment"), validate(paymentSchema), PaymentController.createPayment);
router.get("/payment/:id/view", authorize("view_payment"), PaymentController.getPaymentById);
router.put("/payment/update", authorize("edit_payment"), validate(paymentSchema), PaymentController.updatePayment);
router.post("/payment/:id/delete", authorize("delete_payment"), PaymentController.deletePayment);

/*---Warehouse---*/
router.get("/warehouse/list", authorize("manage_warehouse"), WarehouseController.getAllWarehouse);
router.post("/warehouse/create", authorize("create_warehouse"), validate(warehouseSchema), WarehouseController.createWarehouse);
router.get("/warehouse/:id/view", authorize("view_warehouse"), WarehouseController.getWarehouseById);
router.put("/warehouse/update", authorize("edit_warehouse"), validate(warehouseSchema), WarehouseController.updateWarehouse);
router.post("/warehouse/:id/active", authorize("manage_warehouse"), WarehouseController.activeWarehouse);
router.post("/warehouse/:id/deactive", authorize("manage_warehouse"), WarehouseController.deactiveWarehouse);
router.post("/warehouse/:id/delete", authorize("delete_warehouse"), WarehouseController.deleteWarehouse);


/*---Bank---*/
router.get("/bank/list", authorize("manage_bank"), BankController.getAllBank);
router.post("/bank/create", authorize("create_bank"), validate(bankSchema), BankController.createBank);
router.get("/bank/:id/view", authorize("view_bank"), BankController.getBankById);
router.put("/bank/update", authorize("edit_bank"), validate(bankSchema), BankController.updateBank);
router.post("/bank/:id/active", authorize("manage_bank"), BankController.activeBank);
router.post("/bank/:id/deactive", authorize("manage_bank"), BankController.deactiveBank);
router.post("/bank/:id/delete", authorize("delete_bank"), BankController.deleteBank);

/*---Stock---*/
router.get("/stock/list", authorize("manage_stock"), StockController.getAllStock);
router.post("/stock/create", authorize("create_stock"), validate(stockSchema), StockController.createStock);
router.get("/stock/:id/view", authorize("view_stock"), StockController.getStockById);
router.put("/stock/update", authorize("edit_stock"), validate(stockSchema), StockController.updateStock);
router.post("/stock/:id/delete", authorize("delete_stock"), StockController.deleteStock);

router.post("/stock/getStockReport", authorize("manage_stock"), StockController.getStockReport);

/*---Currency ledger---*/
router.get("/ledger/list", authorize("manage_ledger"), LedgerController.getAllLedger);


export default router;