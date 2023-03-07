import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { selectCartItems, removeItemFromCart } from '../../app/cart/cartSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {Row, Col, Image, ListGroup, Button, Card} from 'react-bootstrap';

import '../../styles/employee_management/employeeList.css';
import { toast } from 'react-toastify';


const MyCart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const cartItems = useSelector(selectCartItems);

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const response = await axiosPrivate.get(`/api/products/cart-items?items=${JSON.stringify(cartItems)}`);
                console.log(response.data);
                setCart(response.data.items);
            } catch (err) {
                console.log(err);
            }
        }
        getCartItems();
    }, [axiosPrivate, cartItems]);

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

    
    const handleRemoveItemFromCart = (id, color) => {
        dispatch(removeItemFromCart({id, color}));
        toast.success('Cart item removed');
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>My Cart</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            {cart.length === 0 && (
                <Row>
                    <Col>
                        <h2 className='text-center my-4'>No cart Items</h2>
                    </Col>
                </Row>
            )}

            {cart.length > 0 && (
                <>
                <Row><h3 className='my-3'>Cart Items</h3></Row>
                <Row>
                    <Col md={7}>
                        <ListGroup variant='flush'>
                            {cart.map((item, index) => (
                                <ListGroup.Item key={`${item}-${index}`} >
                                    <Row>
                                        <Col md={4} className='cartImageContainer d-flex align-items-center'>
                                            <Image src={item.productData?.image.url} alt={item.productData?.image.fileName} width='100%' rounded />
                                        </Col>
                                        <Col md={8}>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Name :
                                                    </Col>
                                                    <Col>{item.productData?.title}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Price :
                                                    </Col>
                                                    <Col>{`$${item.productData?.price.toFixed(2)}`}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Selected Color :
                                                    </Col>
                                                    <Col className='d-flex align-items-center gap-3'>
                                                        <p className='m-0'>{item.color.toUpperCase()}</p>
                                                        <span style={{
                                                            width: '25px', 
                                                            height: '25px', 
                                                            borderRadius: '50%',
                                                            backgroundColor: item.color
                                                        }}></span>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Selected Quantity :
                                                    </Col>
                                                    <Col>{item.qty}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            {/* <ListGroup.Item>
                                                <Row>
                                                    <Col>Quantity : </Col>
                                                    <Col>
                                                        {item.stockCount > 0 && (
                                                            <select defaultValue={item.qty} onChange={e => updateCartQuantityHandler(item.id, e.target.value)}>
                                                                {Array.from({length: item.stockCount}, (i, j) => j+1).map(i => (
                                                                    <option key={i} value={i}>{i}</option>
                                                        ))}
                                                            </select>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item> */}
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Remove Item : </Col>
                                                    <Col>
                                                        <Button variant='dark' className='btn-sm' onClick={() => handleRemoveItemFromCart(item._id, item.color)}>DELETE</Button>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col md={5}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row className='text-center'>
                                        <Col className='text-center cart-description-title'>
                                            <strong>You are ordering {cart.reduce((acc, item) => (acc + (+item.qty)), 0)} total items</strong>                             
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col className='text-center'><b>Name</b></Col>
                                        <Col className='text-center'><b>Color</b></Col>
                                        <Col className='text-center'><b>Quantity</b></Col>
                                        <Col className='text-center'><b>Total Price</b></Col>
                                    </Row>
                                </ListGroup.Item>
                                {cart.map((item, index) => (
                                    <ListGroup.Item key={`${item}-${index}`}>
                                        <Row>
                                            <Col className='text-start'>{item.productData?.title}</Col>
                                            <Col className='d-flex align-items-center justify-content-center'>
                                                <span style={{
                                                    width: '16px', 
                                                    height: '16px', 
                                                    borderRadius: '50%',
                                                    backgroundColor: item.color
                                                }}></span>
                                            </Col>
                                            <Col className='text-center'>{item.qty}</Col>
                                            <Col className='text-center'>{`$${calculateIndividualProductPrice(item.productData?.price, item.qty)}`}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <Row>
                                        <Col><h4>Total : </h4></Col>
                                        <Col><h4>{`$${calculateTotalPrice()}`}</h4></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col className='d-flex'>
                                            <Button variant='dark' className='w-100' onClick={() => navigate('/dash/checkout/location')}>ORDER NOW</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>                                      
                        </Card>                                               
                    </Col>
                    </Row>
                </>
            )}
        </div>
    );
}

export default MyCart;