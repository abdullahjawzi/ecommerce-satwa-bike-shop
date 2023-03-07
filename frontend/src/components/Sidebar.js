import {useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectAuthUser} from '../app/auth/authSlice';
import {logoutAuthUser} from '../app/auth/authSlice';
import { selectCartItems } from '../app/cart/cartSlice';
import {Link} from 'react-router-dom';
import $ from 'jquery';


import { MdDashboard, MdSupervisedUserCircle, MdOutlineTwoWheeler,  MdAccountCircle, MdOutlinePowerSettingsNew, MdHomeFilled, MdDirectionsBike, MdShoppingCart } from "react-icons/md";
import {FaUsers, FaMoneyBillWave, FaFileAlt, FaBuffer, FaChevronRight} from 'react-icons/fa';



const Sidebar = () => {

    const dispatch = useDispatch();
    const {roles} = useSelector(selectAuthUser);
    const cartItems = useSelector(selectCartItems);
    const slideTreeRef = useRef();


    const handleToggle = () => {
        
        
        $('.sidebar-nav-tree-items').slideToggle()

        $('.sidebar-nav-tree-expand-btn-chevron').toggleClass('rotate');
        
    }

    return (
        <aside className="dash-layout-sidebar">

            <button className='logout-btn' onClick={() => dispatch(logoutAuthUser())}>
                <MdOutlinePowerSettingsNew />
                Logout
            </button>

            <div className='sidebar-logo'>
                <img src='/img/logo.png' alt='logo' />
            </div>

            <nav className='sidebar-nav'>
                <ul>
                    <li>
                        <Link to='/dash'>
                            <MdDashboard />
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/showroom'>
                            <MdDirectionsBike />
                            Showroom
                        </Link>
                    </li>

                    <li id='sidebar-nav-cart-link'>
                        {cartItems.length > 0 && (<span>{cartItems.length}</span>)}
                        <Link to='/dash/my-cart'>
                            <MdShoppingCart />
                            My Cart
                        </Link>
                    </li>

                    
                    {roles.indexOf('Admin') !== -1 && (
                        <>
                            <li>
                                <Link to='/dash/admin/employee-management'>
                                    <MdSupervisedUserCircle />
                                    Employee Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/admin/supplier-management'>
                                    <MdOutlineTwoWheeler />
                                    Supplier Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/admin/warehouse-management'>
                                    <MdHomeFilled />
                                    Warehouse Management
                                </Link>
                            </li>
                        </>
                    )}

                    {roles.indexOf('Employee') !== -1 && (
                        <>
                            <li>
                                <div className='sidebar-nav-tree'>
                                    <button className='sidebar-nav-tree-expand-btn' onClick={handleToggle}><FaBuffer /> Order Management <FaChevronRight className='sidebar-nav-tree-expand-btn-chevron' /></button>
                                    
                                    <div className='sidebar-nav-tree-items' ref={slideTreeRef}>
                                        <div className='sidebar-nav-tree-items-item'>
                                            <Link to='/dash/employee/order-management/online-purchase-orders'>
                                                <FaUsers />
                                                Online Purchase Orders
                                            </Link>
                                        </div>
                                        {/* {roles.indexOf('Admin') !== -1 && (
                                            <>
                                                <div className='sidebar-nav-tree-items-item'>
                                                    <Link to='/dash/admin/order-management/online-service-orders'>
                                                        <FaUsers />
                                                        Online Service Orders
                                                    </Link>
                                                </div>
                                                <div className='sidebar-nav-tree-items-item'>
                                                    <Link to='/dash/admin/order-management/inplace-orders'>
                                                        <FaUsers />
                                                        Inplace Orders
                                                    </Link>
                                                </div>
                                            </>
                                        )} */}
                                        
                                        <div className='sidebar-nav-tree-items-item'>
                                            <Link to='/dash/employee/order-management/online-service-orders'>
                                                <FaUsers />
                                                Available Service Orders
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Link to='/dash/employee/customer-management'>
                                    <FaUsers />
                                    Customer Management
                                </Link>
                            </li>
                            <li>
                                <Link to='/dash/employee/sales-management'>
                                    <FaMoneyBillWave />
                                    My Sales Management
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link to='/dash/my-orders'>
                            <FaFileAlt />
                            My Orders
                        </Link>
                    </li>

                    <li>
                        <Link to='/dash/my-profile'>
                            <MdAccountCircle />
                            My Profile
                        </Link>
                    </li>

                    

                </ul>
            </nav>

        </aside>
    );
}

export default Sidebar;