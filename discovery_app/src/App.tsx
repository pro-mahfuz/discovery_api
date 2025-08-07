import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./modules/auth/pages/SignIn";
import SignUp from "./modules/auth/pages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/dashboard/Home";
import UserTable from "./modules/user/pages/UserTable";
import UserForm from "./modules/user/pages/UserForm";
import UserEditForm from "./modules/user/pages/UserEditForm";
import PrivateRoute from "./middleware/PrivateRoute";
import "../node_modules/react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify';
import ProfileEdit from "./modules/user/pages/ProfileEditForm";
import ProfileView from "./modules/user/pages/ProfileView";
import PermissionTable from "./modules/permission/pages/PermissionTable";
import RoleTable from "./modules/role/pages/RoleTable";
import RoleEditForm from "./modules/role/pages/RoleEditForm";
import RoleCreateForm from "./modules/role/pages/RoleCreateForm";
import CustomerLedger from "./modules/ledger/pages/CustomerLedger";
import LedgerList from "./modules/ledger/pages/LedgerList";
import PartyCreateForm from "./modules/party/pages/PartyCreateForm";
import PartyEditForm from "./modules/party/pages/PartyEditForm";
import PartyView from "./modules/party/pages/PartyView";
import InvoiceCreateForm from "./modules/invoice/pages/InvoiceCreateForm";
import InvoiceList from "./modules/invoice/pages/invoiceList";
import PartyList from "./modules/party/pages/PartyList";
import PartyLedger from "./modules/ledger/pages/PartyLedger";
import BusinessCreateForm from "./modules/business/pages/BusinessCreateForm";
import BusinessList from "./modules/business/pages/BusinessList";
import BusinessEditForm from "./modules/business/pages/BusinessEditForm";
import BusinessView from "./modules/business/pages/BusinessView";
import InvoiceEditForm from "./modules/invoice/pages/invoiceEditForm";
import InvoiceView from "./modules/invoice/pages/invoiceView";
import ContainerCreateForm from "./modules/container/pages/ContainerCreateForm";
import ContainerEditForm from "./modules/container/pages/ContainerEditForm";
import ContainerView from "./modules/container/pages/ContainerView";
import ContainerList from "./modules/container/pages/ContainerList";
import PaymentCreateForm from "./modules/payment/pages/PaymentCreateForm";
import PaymentList from "./modules/payment/pages/PaymentList";
import PaymentEditForm from "./modules/payment/pages/PaymentEditForm";
import StockCreateForm from "./modules/stock/pages/StockCreateForm";
import StockListForm from "./modules/stock/pages/StockList";
import StockEditForm from "./modules/stock/pages/StockEditForm";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />


          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Auth Layout */}
            <Route index path="/" element={
              <PrivateRoute permissions={['manage_dashboard']}>
                <Home />
              </PrivateRoute>} 
            />

            {/* Party */}
            <Route index path="/party/:partyType/list" element={
              <PrivateRoute permissions={['manage_party']}>
                <PartyList />
              </PrivateRoute>} 
            />

            <Route index path="/party/:partyType/create" element={
              <PrivateRoute permissions={['create_party']}>
                <PartyCreateForm />
              </PrivateRoute>} 
            />

            <Route index path="/party/view/:id" element={
              <PrivateRoute permissions={['view_party']}>
                <PartyView />
              </PrivateRoute>} 
            />

            <Route index path="/party/edit/:id" element={
              <PrivateRoute permissions={['edit_party']}>
                <PartyEditForm />
              </PrivateRoute>} 
            />


            {/* Container */}
            <Route index path="/container/create" element={
              <PrivateRoute permissions={['create_container']}>
                <ContainerCreateForm />
              </PrivateRoute>} 
            />
            <Route index path="/container/:categoryId/list" element={
              <PrivateRoute permissions={['manage_container']}>
                <ContainerList />
              </PrivateRoute>} 
            />

            <Route index path="/container/:id/view" element={
              <PrivateRoute permissions={['view_container']}>
                <ContainerView />
              </PrivateRoute>} 
            />

            <Route index path="/container/:id/edit" element={
              <PrivateRoute permissions={['edit_container']}>
                <ContainerEditForm />
              </PrivateRoute>} 
            />

            {/* Invoice */}
            <Route index path="/invoice/:invoiceType/create" element={
              <PrivateRoute permissions={['create_invoice']}>
                <InvoiceCreateForm />
              </PrivateRoute>} 
            />
            <Route index path="/invoice/:invoiceType/:categoryId/list" element={
              <PrivateRoute permissions={['manage_invoice']}>
                <InvoiceList />
              </PrivateRoute>} 
            />

            <Route index path="/invoice/:id/view" element={
              <PrivateRoute permissions={['view_invoice']}>
                <InvoiceView />
              </PrivateRoute>} 
            />

            <Route index path="/invoice/:id/edit" element={
              <PrivateRoute permissions={['edit_invoice']}>
                <InvoiceEditForm />
              </PrivateRoute>} 
            />


            {/* Payment */}
            <Route index path="/payment/create" element={
              <PrivateRoute permissions={['create_invoice']}>
                <PaymentCreateForm />
              </PrivateRoute>} 
            />
            <Route index path="/payment/list" element={
              <PrivateRoute permissions={['manage_invoice']}>
                <PaymentList />
              </PrivateRoute>} 
            />

            <Route index path="/payment/:id/edit" element={
              <PrivateRoute permissions={['manage_invoice']}>
                <PaymentEditForm />
              </PrivateRoute>} 
            />

            {/* Stock */}
            <Route index path="/stock/create" element={
              <PrivateRoute permissions={['create_invoice']}>
                <StockCreateForm />
              </PrivateRoute>} 
            />
            <Route index path="/stock/list" element={
              <PrivateRoute permissions={['manage_invoice']}>
                <StockListForm />
              </PrivateRoute>} 
            />

            <Route index path="/stock/:id/edit" element={
              <PrivateRoute permissions={['manage_invoice']}>
                <StockEditForm />
              </PrivateRoute>} 
            />
            
            {/* Ledger */}
            <Route index path="/ledger/all/:categoryId/list" element={
              <PrivateRoute permissions={['manage_users']}>
                <CustomerLedger />
              </PrivateRoute>} 
            />
            <Route index path="/ledger/:categoryId/party/:partyId" element={
              <PrivateRoute permissions={['manage_party']}>
                <PartyLedger />
              </PrivateRoute>} 
            />

            {/* Ledger */}
            <Route index path="/ledger/:partyType/list" element={
              <PrivateRoute permissions={['manage_party']}>
                <LedgerList />
              </PrivateRoute>} 
            />

            {/* Business */}
            <Route index path="/business/create" element={
              <PrivateRoute permissions={['create_business']}>
                <BusinessCreateForm />
              </PrivateRoute>
            }
            />

            <Route index path="/business/list" element={
              <PrivateRoute permissions={['manage_business']}>
                <BusinessList />
              </PrivateRoute>
            }
            />

            <Route index path="/business/edit/:id" element={
              <PrivateRoute permissions={['manage_business']}>
                <BusinessEditForm />
              </PrivateRoute>
            }
            />

            <Route index path="/business/view/:id" element={
              <PrivateRoute permissions={['view_business']}>
                <BusinessView />
              </PrivateRoute>
            }
            />
            
            {/* User */}
            <Route index path="/user/list" element={
              <PrivateRoute permissions={['manage_users']}>
                <UserTable />
              </PrivateRoute>} 
            />

            <Route index path="/user/create" element={
              <PrivateRoute permissions={['create_users']}>
                <UserForm />
              </PrivateRoute>} 
            />

            <Route index path="/user/edit/:id" element={
              <PrivateRoute permissions={['edit_users']}>
                <UserEditForm />
              </PrivateRoute>} 
            />

            <Route index path="/user/profile/view/:id" element={
              <PrivateRoute permissions={['view_profile']}>
                <ProfileView />
              </PrivateRoute>} 
            />

            <Route index path="/user/profile/edit/:id" element={
              <PrivateRoute permissions={['edit_profile']}>
                <ProfileEdit />
              </PrivateRoute>} 
            />


            {/* Permission */}
            <Route index path="/permission/list" element={
              <PrivateRoute permissions={['manage_permissions']}>
                <PermissionTable />
              </PrivateRoute>} 
            />

            {/* Role */}
            <Route index path="/role/list" element={
              <PrivateRoute permissions={['manage_roles']}>
                <RoleTable />
              </PrivateRoute>} 
            />

            <Route index path="/role/create" element={
              <PrivateRoute permissions={['manage_roles']}>
                <RoleCreateForm />
              </PrivateRoute>} 
            />

            <Route index path="/role/edit/:id" element={
              <PrivateRoute permissions={['manage_roles']}>
                <RoleEditForm />
              </PrivateRoute>} 
            />



            <Route index path="/" element={<Home />} />
            <Route index path="/" element={<Home />} />
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
