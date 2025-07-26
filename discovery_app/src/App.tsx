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
import CustomerLedger from "./modules/customer/pages/CustomerLedger";
import PartyCreateForm from "./modules/party/pages/PartyCreateForm";
import PartySupplierList from "./modules/party/pages/PartySupplierList";
import PartyCustomerList from "./modules/party/pages/PartyCustomerList";
import PartyEditForm from "./modules/party/pages/PartyEditForm";
import PartyView from "./modules/party/pages/PartyView";


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

            <Route index path="/party/supplier/list" element={
              <PrivateRoute permissions={['manage_users']}>
                <PartySupplierList />
              </PrivateRoute>} 
            />
            <Route index path="/party/customer/list" element={
              <PrivateRoute permissions={['manage_users']}>
                <PartyCustomerList />
              </PrivateRoute>} 
            />
            <Route index path="/party/create" element={
              <PrivateRoute permissions={['manage_users']}>
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
            
            <Route index path="/customers/ledger/" element={
              <PrivateRoute permissions={['manage_users']}>
                <CustomerLedger />
              </PrivateRoute>} 
            />
            

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



            <Route index path="/permission/list" element={
              <PrivateRoute permissions={['manage_permissions']}>
                <PermissionTable />
              </PrivateRoute>} 
            />

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
