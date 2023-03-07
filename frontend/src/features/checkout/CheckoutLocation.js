import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {selectCartItems, cleanCart} from '../../app/cart/cartSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Row, Col, Card, ListGroup, Image, Button, Badge} from 'react-bootstrap';

import MyMap from '../../components/MyMap';

import {toast} from 'react-toastify';

const CheckoutLocation = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const axiosPrivate = useAxiosPrivate();

    const [firstStep, setFirstStep] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState({
        address: '',
        city: '',
        zip: ''
    });
    const [cart, setCart] = useState([]);
    const [isOrderPlacing, setIsOrderPlacing] = useState(false);


    useEffect(() => {

        if(!firstStep) {
            const getAllCartItems = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/products/cart-items?items=${JSON.stringify(cartItems)}`);
                    setCart(response.data.items);

                } catch (err) {
                    console.log(err);
                }
            }
            getAllCartItems();
        }

    }, [firstStep, axiosPrivate, cartItems]);

    const handleCurrentLocation = loc => {
        setCurrentLocation(loc);
    }

    const handleDeliveryAddress = (data) => {

        if(!data.address.trim() || !data.city.trim() || !data.zip.trim()) {
            toast.error('Please fill all delivery information');
            return false;
        }
        
        setDeliveryAddress({
            address: data.address.trim(),
            city: data.city.trim(),
            zip: data.zip.trim()
        })

        setDeliveryLocation(currentLocation);
        setCurrentLocation(null);
        return true;
    }


    const calculateIndividualProductPrice = (itemPrice, itemQty) => {
        let total = +(itemPrice) * (+itemQty);
        total = total.toFixed(2);
        return total;
    }

    const calculateTotalPrice = () => {
        let total = cart.reduce((acc, item) => (acc + (+item.productData?.price) * (+item.qty)) , 0);
        total = total.toFixed(2);
        return total;
    }

    const handlePlaceOrder = async () => {
        setIsOrderPlacing(true);
        const data = {
            deliveryLocation,
            deliveryAddress,
            orderItems: cart,
            orderTotal: +cart.reduce((acc, item) => (acc + (+item.qty) * (+item.productData?.price)) , 0).toFixed(2)
        }

        try {
            const response = await axiosPrivate.post('/api/orders/online-purchase', JSON.stringify(data), {
                headers: {'Content-Type': 'application/json'}
            })
            
            setIsOrderPlacing(false);
            dispatch(cleanCart());
            toast.success('Order created successfully');
            navigate(`/dash/my-orders/purchase-order/${response.data.order._id}`);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
            setIsOrderPlacing(false);
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Checkout Process Step {firstStep ? '1' : '2'} - {firstStep ? 'Delivery Location' : 'Place Order'}</h1>
                <button className='btn btn-primary' onClick={() => navigate('/dash/my-cart')}>Back to cart</button>
            </aside>

            <hr></hr>

            <div>
                {firstStep && (
                    <>
                        <label className='mb-4'>Please select delivery location <span>(double click on the map & enter your address)</span></label>

                        <div style={{width: '100%', height: '600px', marginBottom: '20px'}}>

                            <MyMap 
                                height={600}
                                currentLocation={currentLocation}
                                deliveryLocation={deliveryLocation}
                                handleCurrentLocation={handleCurrentLocation}
                                popUp
                                handleDeliveryAddress={handleDeliveryAddress}
                                confirmed={deliveryAddress.address.trim() && deliveryAddress.city.trim() && deliveryAddress.zip.trim()}
                            />

                        </div>

                        <div className='mb-5 d-flex align-items-center justify-content-end'>
                            <button 
                                className='btn btn-primary px-5'
                                disabled={!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.zip}
                                onClick={() => setFirstStep(false)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {!firstStep && cart.length > 0 && (
                    <>
                        <Row className='justify-content-center'>
                            <Col md={9}>
                                {/* {placingSuccess && (<Alert variant='success'>Order Placed Successfully</Alert>)} */}
                                <h1 className='text-center my-4'>Place Order</h1>
                                <Card>
                                    <ListGroup>
                                    <ListGroup.Item>
                                                <Row className='text-center'>
                                                    <Col className='text-center cart-description-title'>
                                                        <strong>You are ordering {cart.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col className='text-center'>Image</Col>
                                                    <Col className='text-center'>Name</Col>
                                                    <Col className='text-center'>Unit Price</Col>
                                                    <Col className='text-center'>Color</Col>
                                                    <Col className='text-center'>Quantity</Col>
                                                    <Col className='text-center'>Condition</Col>
                                                    <Col className='text-center'>Total</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            {cart.map((item, index) => (
                                                <ListGroup.Item key={`${item._id}-${index}`}>
                                                    <Row>
                                                        <Col className='text-center'>
                                                            <Image src={item.productData?.image.url} alt={item.productData?.image.fileName} fluid />
                                                        </Col>
                                                        <Col className='text-start'>{item.productData?.title}</Col>
                                                        <Col className='text-center d-flex align-items-center justify-content-center'>{`$${item.productData?.price.toFixed(2)}`}</Col>
                                                        <Col className='text-center d-flex align-items-center justify-content-center'>
                                                            <span style={{
                                                                width: '20px', 
                                                                height: '20px', 
                                                                borderRadius: '50%',
                                                                backgroundColor: item.color
                                                            }}></span>
                                                        </Col>
                                                        <Col className='text-center d-flex align-items-center justify-content-center'>{item.qty}</Col>
                                                        <Col className='text-center d-flex align-items-center justify-content-center'>
                                                            <Badge 
                                                                className={item.productData?.condition === 'new' ? 'bg-success' : 'bg-warning'}
                                                            >
                                                                {item.productData?.condition === 'new' ? 'Brand New' : 'Already Used'}
                                                            </Badge>
                                                        </Col>
                                                        <Col className='text-center d-flex align-items-center justify-content-center'>{`$${calculateIndividualProductPrice(item.productData?.price, item.qty)}`}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col className='d-flex justify-content-end'><h4>Total : </h4></Col>
                                                    <Col className='d-flex justify-content-start'><h4>{`$${calculateTotalPrice()}`}</h4></Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Payment Method :</Col>
                                                    <Col>Paypal or Debit or Credit Cards</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Shipping Address : </Col>
                                                    <Col>{`${deliveryAddress.address}, ${deliveryAddress.city}`}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Postal Code : : </Col>
                                                    <Col>{deliveryAddress.zip}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        <Button 
                                                            variant='dark' 
                                                            type='button' 
                                                            className={`btn-block w-100`} 
                                                            // style={{backgroundColor: '#66EF66', fontSize: '25px'}}
                                                            disabled={isOrderPlacing}
                                                            id='place_order_btn'
                                                            onClick={handlePlaceOrder}
                                                        >
                                                            {isOrderPlacing ? 'Order placing...' : 'Place Order'}
                                                           
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>

                        <div className='my-5 d-flex align-items-center justify-content-start'>
                            <button 
                                className='btn btn-primary px-5'
                                
                                onClick={() => setFirstStep(true)}
                            >
                                Previous
                            </button>
                        </div>
                    </>
                )}
                

                

            </div>

        </div>
    );
}

export default CheckoutLocation;