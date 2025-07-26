import { Router } from "express";
import { upload } from "../middleware/fileUpload.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { userSchema } from "../modules/user/user.validator.js";
import { profileSchema } from "../modules/profile/profile.validator.js";
import { partySchema } from "../modules/party/party.validator.js";
import { categorySchema } from "../modules/category/category.validator.js";
import { itemSchema } from "../modules/item/item.validator.js";
import { invoiceSchema } from "../modules/invoice/invoice.validator.js";

import * as UserController from "../modules/user/user.controller.js";
import * as ProfileController from "../modules/profile/profile.controller.js";
import * as AuthController from "../modules/auth/auth.controller.js";
import * as RoleController from "../modules/role/role.controller.js";
import * as PermissionController from "../modules/permission/permission.controller.js";
import * as PartyController from "../modules/party/party.controller.js";
import * as CategoryController from "../modules/category/category.controller.js";
import * as ItemController from "../modules/Item/item.controller.js";
import * as InvoiceController from "../modules/invoice/invoice.controller.js";

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

/*---Profile---*/
router.post("/profile/:id", authorize("manage_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.createProfile);
router.get("/profile/:id", authorize("view_profile"), ProfileController.getProfileById);
router.put("/profile/:id", authorize("edit_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.updateProfileById);

/*---Users---*/
router.get("/users", authorize("manage_users"), UserController.getAllUser);
router.post("/users", authorize("create_users"), validate(userSchema), UserController.createUser);
router.get("/users/:id", authorize("view_users"), UserController.getUserById);
router.put("/users/:id", authorize("edit_users"), validate(userSchema), UserController.updateUser);
router.post("/users/:id/active", authorize("manage_users"), UserController.activeUser);
router.post("/users/:id/deactive", authorize("manage_users"), UserController.deactiveUser);

/*---Party---*/
router.get("/party/list", authorize("manage_party"), PartyController.getAllParty);
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

/*---Invoice---*/
router.get("/invoice/list", authorize("manage_invoice"), InvoiceController.getAllInvoice);
router.post("/invoice/create", authorize("create_invoice"), validate(invoiceSchema), InvoiceController.createInvoice);
router.get("/invoice/:id/view", authorize("view_invoice"), InvoiceController.getInvoiceById);
router.put("/invoice/update", authorize("edit_invoice"), validate(invoiceSchema), InvoiceController.updateInvoice);
router.post("/invoice/:id/delete", authorize("delete_invoice"), InvoiceController.deleteInvoice);


export default router;