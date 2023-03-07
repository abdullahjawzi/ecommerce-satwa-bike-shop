import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Badge, Table} from 'react-bootstrap';

const OnlinePurchaseOrderList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getAllPurchaseOrders = async () => {
            try {
                const response = await axiosPrivate.get('/api/orders/online-purchase');
                setOrders(response.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        getAllPurchaseOrders();
    }, [axiosPrivate]);

    console.log(orders);

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Purchase Orders</h1>
            </aside>

            <hr></hr>

            {orders.length === 0 && (<h1 className='text-center'>No Purchase Orders</h1>)}
            {orders.length > 0 && (
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
                        {orders.map(o => (
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

        </div>
    );
}

export default OnlinePurchaseOrderList;