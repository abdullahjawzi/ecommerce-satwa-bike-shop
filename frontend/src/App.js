import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';


import RequireAuth from './utils/RequireAuth';
import PersistAuth from './utils/PersistAuth';


import LandingPage from './components/LandingPage';
import Login from './components/Login';


import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';



import EmployeeList from './features/employees/EmployeeList';
import EmployeeAdd from './features/employees/EmployeeAdd';
import EmployeeSales from './features/employees/EmployeeSales';

import SupplierList from './features/suppliers/SupplierList';
import SupplierAdd from './features/suppliers/SupplierAdd';

import WarehouseList from './features/warehouse/WarehouseList';
import WarehouseAdd from './features/warehouse/WarehouseAdd';
import WarehouseUpdate from './features/warehouse/WarehouseUpdate';


import CustomerList from './features/customers/CustomerList';
import CustomerAdd from './features/customers/CustomerAdd';

import MySalesList from './features/mysales/MySalesList';
import MySalesAdd from './features/mysales/MySalesAdd';

import AvailableServiceOrderList from './features/orders/AvailableServiceOrderList';
import OnlinePurchaseOrderList from './features/orders/OnlinePurchaseOrderList';


import OnlineServiceAdd from './features/online-service/OnlineServiceAdd';
import MyOrderList from './features/myorders/MyOrderList';
import PurchaseOrderView from './features/myorders/PurchaseOrderView';
import ProductView from './features/product/ProductView';
import ShowroomView from './features/showroom/ShowroomView';
import MyCart from './features/cart/MyCart';
import CheckoutLocation from './features/checkout/CheckoutLocation';

import ProfileView from './features/profile/ProfileView';


const App = () => {


  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<LandingPage />} />
        <Route path='login' element={<Login />} />

        <Route element={<PersistAuth />}>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route index element={<Welcome />} />
            </Route>
          </Route>

          {/* Admin Specific */}

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/employee-management" element={<EmployeeList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/employee-management/add" element={<EmployeeAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/supplier-management" element={<SupplierList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/supplier-management/add" element={<SupplierAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/warehouse-management" element={<WarehouseList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="admin/employee-management/sales/:id" element={<EmployeeSales />} />
            </Route>
          </Route>

          {/* Employee, Admin */}

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="warehouse-management/add" element={<WarehouseAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="warehouse-management/update" element={<WarehouseUpdate />} />
            </Route>
          </Route>

          {/* Employee  */}

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/customer-management" element={<CustomerList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/customer-management/add" element={<CustomerAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/sales-management" element={<MySalesList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/sales-management/add" element={<MySalesAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/order-management/online-service-orders" element={<AvailableServiceOrderList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="employee/order-management/online-purchase-orders" element={<OnlinePurchaseOrderList />} />
            </Route>
          </Route>

          {/* Customer specific */}

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="online-service/add" element={<OnlineServiceAdd />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="my-orders" element={<MyOrderList />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="my-orders/purchase-order/:id" element={<PurchaseOrderView />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="product/:id" element={<ProductView />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="showroom" element={<ShowroomView />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="my-cart" element={<MyCart />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="checkout/location" element={<CheckoutLocation />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['Customer', 'Employee', 'Admin']}/>}>
            <Route path='dash' element={<DashLayout />}>
              <Route path="my-profile" element={<ProfileView />} />
            </Route>
          </Route>
          
        </Route>

      </Route>
    </Routes>
  );
}


export default App;
