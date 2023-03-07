import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import { PayPalButton } from "react-paypal-button-v2";

import MyMap from '../../components/MyMap';

import {Row, Col, ListGroup, Card,  Image, Alert} from 'react-bootstrap';

import {FaPaypal} from 'react-icons/fa';

import {toast} from 'react-toastify';

const PurchaseOrderView = () => {

    const navigate = useNavigate();
    const {roles} = useSelector(selectAuthUser);
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();

    const [order, setOrder] = useState({});
    const [orderStatus, setOrderStatus] = useState('');

    const [sdkReady, setSdkReady] = useState(false);

    // load paypal script duynamicly
    // useEffect(() => {

        
    //         const script = document.createElement('script');
    //         script.type = 'text/javascript';
    //         script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
    //         script.async = true;
    //         script.onload = () => {
    //             setSdkReady(true);
    //         }
    //         document.body.appendChild(script);
       
    // }, []);

    useEffect(() => {

        const getPurchaseOrder = async () => {
            try {
                const response = await axiosPrivate.get(`/api/orders/online-purchase/${id}`);

                if(!response.data.order.onlinePurchaseOrder?.isPaid) {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
                    script.async = true;
                    script.onload = () => {
                        setSdkReady(true);
                    }
                    document.body.appendChild(script);
                }
                setOrderStatus(response.data.order.onlinePurchaseOrder?.status);
                setOrder(response.data.order);
            } catch(err) {
                toast.error(err.response.data?.message);
                navigate('/dash/my-orders');
            }
        }
        getPurchaseOrder();

    }, [axiosPrivate, navigate, id])



    const calculateIndividualProductPrice = (itemPrice, itemQty) => {
        let total = +(itemPrice) * (+itemQty);
        total = total.toFixed(2);
        return total;
    }

    const calculateTotalPrice = () => {
        let total = order.onlinePurchaseOrder?.orderItems.reduce((acc, item) => (acc + (+item.unitPrice) * (+item.qty)) , 0);
        total = total.toFixed(2);
        return total;
    }

    const handlePayment =async result => {

        const paymentResults = {
            id: result.id,
            status: result.status,
            update_time: result.update_time,
            email_address: result.payer.email_address
        }

        try {
            const response = await axiosPrivate.put(`/api/orders/online-purchase/${order._id}/pay`, JSON.stringify({paymentResults}), {
                headers: {'Content-Type': 'application/json'}
            });
            const updatedOrder = {
                ...response.data.order,
                customer: {
                    ...order.customer
                }
            }
            setOrder(updatedOrder);
            toast.success('Payment success');
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
        }
    }

    const handleOrderStatusUpdate = async () => {
        try {
            const response = await axiosPrivate.put(`/api/orders/online-purchase/${order._id}/status`, JSON.stringify({status: orderStatus}), {
                headers: {'Content-Type': 'application/json'}
            });

            const updatedOrder = {
                ...response.data.order,
                customer: {
                    ...order.customer
                }
            }
            setOrder(updatedOrder);
            toast.success('Order status updated');
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Purchase Order - {order.orderId}</h1>
                <button className='btn btn-primary' onClick={() => navigate(roles.indexOf('Employee') === -1 ? '/dash/my-orders' : '/dash/employee/order-management/online-purchase-orders')}>{roles.indexOf('Employee') === -1 ? 'My Orders' : 'Purchase Orders'}</button>
            </aside>

            <hr></hr>

            {order.orderId && (
                <div className='pb-5'>
                    <Row>
                        <Col><h1 className='text-center mb-4 mt-2'>Order State</h1></Col>
                    </Row>

                    <Row>

                        <Col md={8}>
                            <Card>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Order Id : </strong></Col>
                                            <Col>{order.orderId}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Name : </strong></Col>
                                            <Col>{order.customer?.customer.firstName}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Email : </strong></Col>
                                            <Col>{order.customer?.customer.email}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Phone : </strong></Col>
                                            <Col>{order.customer?.customer.phone}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Payment Method :</strong></Col>
                                                <Col>Paypal & Debit or Credit Card</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Delivery Address : </strong> </Col>
                                                <Col>{`${order.onlinePurchaseOrder?.deliveryAddress.address}, ${order.onlinePurchaseOrder?.deliveryAddress.city}`}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Delivery Postal Code : </strong> </Col>
                                                <Col>{order.onlinePurchaseOrder?.deliveryAddress.postalCode}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    <strong className='d-block mb-3'>Delivery Location : </strong> 
                                                    <MyMap
                                                        height={400}
                                                        deliveryLocation={{long: order.onlinePurchaseOrder?.deliveryLocation.coordinates[0], lat: order.onlinePurchaseOrder?.deliveryLocation.coordinates[1]}}
                                                        viewOnly
                                                    />
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Payment Status : </strong></Col>
                                                <Col>
                                                    <Alert variant={`${order.onlinePurchaseOrder?.isPaid ? 'success' : 'danger'}`}>{order.onlinePurchaseOrder?.isPaid ? 'Paid' : 'Not Paid'}</Alert>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {order.onlinePurchaseOrder?.isPaid && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col><strong>Paid At : </strong></Col>
                                                    <Col>
                                                        <Alert variant={`${order.onlinePurchaseOrder?.isPaid ? 'success' : 'danger'}`}>{order.onlinePurchaseOrder?.paidAt}</Alert>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                        
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Order Status : </strong></Col>
                                                <Col>
                                                    <Alert variant={`${order.onlinePurchaseOrder?.status === 'pending' ? 'warning' : order.onlinePurchaseOrder?.status === 'delivered' ? 'info' : 'success'}`}>{order.onlinePurchaseOrder?.status}</Alert>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><h4 className='text-center mt-1'>Order Items</h4></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col className='text-center'>Image</Col>
                                                <Col className='text-center'>Name</Col>
                                                <Col className='text-center'>Unit Price</Col>
                                                <Col className='text-center'>Color</Col>
                                                <Col className='text-center'>Quantity</Col>
                                                <Col className='text-center'>Total</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {order.onlinePurchaseOrder.orderItems.map((item, index) => (
                                            <ListGroup.Item key={`${item.product.id}-${index}`}>
                                                <Row>
                                                    <Col className='text-center'>
                                                        <Image src={item.product?.image.url} alt={item.product?.image.fileName} fluid />
                                                    </Col>
                                                    <Col className='text-start'>{item.product?.title}</Col>
                                                    <Col className='d-flex align-items-center justify-content-center'>{`$${item.unitPrice}`}</Col>
                                                    <Col className='d-flex align-items-center justify-content-center'>
                                                        <span style={{
                                                            width: '20px', 
                                                            height: '20px', 
                                                            borderRadius: '50%',
                                                            backgroundColor: item.color
                                                        }}></span>
                                                    </Col>
                                                    <Col className='d-flex align-items-center justify-content-center'>{item.qty}</Col>
                                                    <Col className='d-flex align-items-center justify-content-center'>{`$${calculateIndividualProductPrice(item.unitPrice, item.qty)}`}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                </ListGroup>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Row>
                                <Col>
                                    <Card>
                                        <ListGroup>
                                            <ListGroup.Item>
                                                <Row className='text-center'>
                                                    <Col className='text-center cart-description-title'>
                                                        <strong>You are ordering {order.onlinePurchaseOrder?.orderItems.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col><h4>Total : </h4></Col>
                                                    <Col><h4>{`$${calculateTotalPrice()}`}</h4></Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {roles.indexOf('Employee') >= 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <div className='d-flex flex-column align-items-start gap-2'>
                                                                <label>Update Order Status</label>
                                                                <select className='w-100 p-1' value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                                                                    <option value=''>--select status--</option>
                                                                    <option value='pending'>pending</option>
                                                                    <option value='delivered'>delivered</option>
                                                                    <option value='completed'>completed</option>
                                                                </select>
                                                                <button className='btn btn-dark btn-sm d-block w-100' onClick={handleOrderStatusUpdate}>Update Status</button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className='my-4'>
                                <Col>
                                    <ListGroup>
                                        {sdkReady && !order.onlinePurchaseOrder?.isPaid && (
                                            <>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <p className='text-center mt-1 mb-1' style={{fontSize: '20px'}}><FaPaypal color='#3b7bbf' /> Pay Now</p>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <PayPalButton
                                                                amount={order.onlinePurchaseOrder?.totalPrice}
                                                                onSuccess={handlePayment}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            </>
                                        )}
                                    </ListGroup>
                                </Col>
                            </Row>

                        </Col>

                    </Row>
                </div>
            )}

        </div>
    );
}

export default PurchaseOrderView;