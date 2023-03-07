import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Tabs, Tab, Table, Badge} from 'react-bootstrap';

import '../../styles/employee_management/employeeList.css';

const MyOrderList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {id} = useSelector(selectAuthUser);

    const [key, setKey] = useState('online-purchase');

    
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [serviceOrders, setServiceOrders] = useState([]);
    
    const [inplaceOrders, setInplaceOrders] = useState([]);

    useEffect(() => {
        if(key === 'online-purchase') {
            const getAllPurchaseOrders = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/orders/online-purchase/customer`);
                    console.log(response.data);
                    setPurchaseOrders(response.data.orders);
                } catch (err) {
                    console.log(err);
                }
            }
            getAllPurchaseOrders();
            
        } else if(key === 'online-service') {
            const getAllServiceOrders = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/orders/online-service/customer/${id}`);
                    setServiceOrders(response.data.orders);
                } catch (err) {
                    console.log(err);
                }
            }
            getAllServiceOrders();
        } else if(key === 'inplace') {
            const getAllInplaceOrders = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/orders/inplace/customer/${id}`);
                    setInplaceOrders(response.data.orders);
                } catch (err) {
                    console.log(err);
                }
            }
            getAllInplaceOrders();
        }
    }, [key, id, axiosPrivate]);

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>My Orders</h1>
                
            </aside>

            <hr></hr>

            <Tabs
                defaultActiveKey="online-purchase"
                id="justify-tab-example"
                className="mb-3"
                justify
                onSelect={(k) => setKey(k)}
            >

                <Tab eventKey="online-purchase" title="Online Purchase Orders">
                    {purchaseOrders.length === 0 && <h3 className='text-center'>No purchase orders yet</h3>}
                    {purchaseOrders.length > 0 && (
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>#Order ID</th>
                                    <th>Order Type</th>
                                    <th>Delivery Address</th>
                                    <th>Delivery City</th>
                                    <th>Delivery Postal Code</th>
                                    <th>Paid Status</th>
                                    <th>Order Total Price ($)</th>
                                    <th>Order Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseOrders.map(o => (
                                    <tr key={o._id}>
                                        <td>{o.orderId}</td>
                                        <td><Badge bg="warning" text="dark">{o.type}</Badge></td>
                                        <td>{o.onlinePurchaseOrder?.deliveryAddress.address}</td>
                                        <td>{o.onlinePurchaseOrder?.deliveryAddress.city}</td>
                                        <td>{o.onlinePurchaseOrder?.deliveryAddress.postalCode}</td>
                                        <td><Badge bg={o.onlinePurchaseOrder?.isPaid ? 'success' : 'danger'}>{o.onlinePurchaseOrder?.isPaid ? 'Paid' : 'Not Paid'}</Badge></td>
                                        <td>{o.onlinePurchaseOrder?.totalPrice.toFixed(2)}</td>
                                        <td><Badge bg='info'>{o.onlinePurchaseOrder?.status}</Badge></td>
                                        <td>
                                            <div className='d-flex align-items-center gap-2'>
                                               <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/my-orders/purchase-order/${o._id}`)}>More</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Tab>

                <Tab eventKey="online-service" title="Online Service Orders">
                    {serviceOrders.length === 0 && <h3 className='text-center'>No service orders yet</h3>}
                    {serviceOrders.length > 0 && (
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>#Order ID</th>
                                    <th>Order Type</th>
                                    <th>Request Issue</th>
                                    <th>Contact No.</th>
                                    <th>Order Price ($)</th>
                                    <th>Order Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceOrders.map(o => (
                                    <tr key={o._id}>
                                        <td>{o.orderId}</td>
                                        <td><Badge bg="warning" text="dark">{o.type}</Badge></td>
                                        <td>{o.onlineServiceOrder?.problem}</td>
                                        <td>{o.onlineServiceOrder?.contactNo}</td>
                                        <td>{o.onlineServiceOrder?.price ? o.onlineServiceOrder?.price : 'Price not set yet'}</td>
                                        <td><Badge bg="info">{o.onlineServiceOrder?.status}</Badge></td>
                                        <td>
                                            <div className='d-flex align-items-center gap-2'>
                                                {o.onlineServiceOrder?.status !== 'completed' && (<button className='btn btn-sm btn-success' onClick={() => navigate(`/dash/online-service/add?edit=true&id=${o._id}`)}>Update</button>)}
                                                {!o.onlineServiceOrder?.isUndertaken && (<button className='btn btn-sm btn-danger'>Cancel Order</button>)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Tab>

                <Tab eventKey="inplace" title="Inplace Orders">
                    {inplaceOrders.length === 0 && <h3 className='text-center'>No inplace orders yet</h3>}
                    {inplaceOrders.length > 0 && (
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>#Order ID</th>
                                    <th>Order Type</th>
                                    <th>Order Description</th>
                                    <th>Order Price ($)</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inplaceOrders.map(o => (
                                    <tr key={o._id}>
                                        <td>{o.orderId}</td>
                                        <td><Badge pill bg="warning" text="dark" >{o.type}</Badge></td>
                                        <td>{o.inplaceOrder?.description}</td>
                                        <td>{o.inplaceOrder?.price}</td>
                                        <td>{o.inplaceOrder?.status === 'pending' ? <Badge bg="info">Pending</Badge> : <Badge bg="success">Completed</Badge>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Tab>

            </Tabs>

        </div>
    );
}


export default MyOrderList;