import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';

import MyMap from '../../components/MyMap';

import {Tabs, Tab, Table, Badge, Form, Button, InputGroup} from 'react-bootstrap';
import {MdOutlineAddTask, MdClose} from 'react-icons/md';

import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeList.css';


const MySalesList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {id} = useSelector(selectAuthUser);

    const [orders, setOrders] = useState([]);
    const [isMapViewModelOpen, setIsMapViewModelOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    

    useEffect(() => {
        const getAllOrders = async () => {
            try {
                const response = await axiosPrivate.get(`/api/orders/employee/my/sales/${id}`);
                setOrders(response.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        getAllOrders();
    }, [axiosPrivate, id]);

    const handleMapViewModelOpen = coordinates => {
        setCurrentLocation({long: coordinates[0], lat: coordinates[1]});
        setIsMapViewModelOpen(true);
    }

    const handleMapViewModelClose = () => {
        setIsMapViewModelOpen(false);
        setCurrentLocation(null);
    }

    const handleServiceOrderPriceUpdate = async (e, id) => {
        const newPrice = +e.target.previousElementSibling.value;
       
        if(newPrice <= 0) {
            toast.error('Invalid Price Value');
            return;
        }
        
        try {
            await axiosPrivate.put(`/api/orders/online-service/employee/update/${id}?type=price`, JSON.stringify({price: newPrice}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            e.target.previousElementSibling.value = '';
            const updatedOrders = orders.map(o => {
                if(o.type === 'online-service' && o._id === id) {
                    return {
                        ...o,
                        onlineServiceOrder: {
                            ...o.onlineServiceOrder,
                            price: newPrice
                        }
                    }
                }
                return o;
            })
            setOrders(updatedOrders);
            toast.success('Service order price updated');
        } catch (err) {
            toast.error(err.response.data?.message);
        }
    }

    const handleServiceOrderCompletion = async (id, val) => {
        try {
            const response = await axiosPrivate.put(`/api/orders/online-service/employee/update/${id}?type=${val}`);

            const updatedOrders = orders.map(o => {
                if(o.type === 'online-service' && o._id === id) {
                    return {
                        ...o,
                        onlineServiceOrder: {
                            ...o.onlineServiceOrder,
                            status: val === 'accepted' ? 'accepted' : 'completed'
                        }
                    }
                }
                return o;
            })
            setOrders(updatedOrders);
            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response.data?.message);
        }
    }

    const handleInplaceOrderDelete = async id => {
        const isConfirmed = window.confirm('Are you sure that you want to delete this inplace roder?');

        if(isConfirmed) {
            
            try {
                await axiosPrivate.delete(`/api/orders/inplace/${id}`);
                toast.success('Inplace Order Deleted');
                setOrders(orders.filter(o => o._id !== id));
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div>

            {isMapViewModelOpen && (
                <>
                    <div className='mapView-overlay'></div>
                    <div className='mapView-container'>
                        <button className='mapView-container-close-btn' onClick={handleMapViewModelClose}><MdClose /></button>
                        <MyMap 
                            height={540} 
                            viewOnly
                            currentLocation={currentLocation}
                        />
                    </div>
                </>
            )}

            <aside className='employeeList-header'>
                <h1>My Sales Management</h1>
                <button className='btn btn-primary' onClick={() => navigate('/dash/employee/sales-management/add')}>New Inplace Order<MdOutlineAddTask /></button>
            </aside>

            <hr></hr>

            <Tabs
                defaultActiveKey="inplace"
                id="justify-tab-example"
                className="mb-3"
                justify
                // onSelect={(k) => setKey(k)}
            >

                <Tab eventKey="inplace" title="Inplace Orders">
                    {orders.filter(o => o.type === 'inplace').length > 0 ? (
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>#Order ID</th>
                                    <th>Order Type</th>
                                    <th>#Customer ID</th>
                                    <th>Customer Username</th>
                                    <th>Order Description</th>
                                    <th>Order Price ($)</th>
                                    <th>Order Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.filter(o => o.type === 'inplace').map(o => (
                                    <tr key={o._id}>
                                        <td>{o.orderId}</td>
                                        <td><Badge pill bg="warning" text="dark" >{o.type}</Badge></td>
                                        <td>{o.customer?.userId}</td>
                                        <td>{o.customer?.username}</td>
                                        <td>{o.inplaceOrder?.description}</td>
                                        <td>{o.inplaceOrder?.price}</td>
                                        <td>{o.inplaceOrder?.status === 'pending' ? <Badge bg="info">Pending</Badge> : <Badge bg="success">Completed</Badge>}</td>
                                        <td>
                                            <div className='d-flex align-items-center gap-2'>
                                                <button className='btn btn-sm btn-success' onClick={() => navigate(`/dash/employee/sales-management/add?edit=true&id=${o._id}`)}>Update</button>
                                                <button className='btn btn-sm btn-danger' onClick={() => handleInplaceOrderDelete(o._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <h3 className='text-center'>No Inplace Orders Yet</h3>
                    )}
                </Tab>

                <Tab eventKey="online-service" title="Online Service Orders">
                    {orders.filter(o => o.type === 'online-service').length > 0 ? (
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th>#Order ID</th>
                                    <th>Order Type</th>
                                    <th>#Customer ID</th>
                                    <th>Customer Username</th>
                                    <th>Request Issue</th>
                                    <th>Contact No.</th>
                                    <th>Order Price ($)</th>
                                    <th>Order Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.filter(o => o.type === 'online-service').map(o => (
                                    <tr key={o._id}>
                                        <td><p style={{width: '100px'}}>{o.orderId}</p></td>
                                        <td><p style={{width: '100px'}}><Badge bg="warning" text="dark" >{o.type}</Badge></p></td>
                                        <td>{o.customer?.userId}</td>
                                        <td>{o.customer?.username}</td>
                                        <td><p style={{width: '300px'}}>{o.onlineServiceOrder?.problem}</p></td>
                                        <td><p style={{width: '150px'}}>{o.onlineServiceOrder?.contactNo}</p></td>
                                        <td>
                                            <div style={{width: '300px'}}>
                                                <span>Price : {o.onlineServiceOrder?.price ?  `$ ${o.onlineServiceOrder?.price}` : 'Price not set yet'}</span>
                                                <div className='py-2'>
                                                    <InputGroup className="mb-3">
                                                        <Form.Control
                                                            placeholder="Enter new price"
                                                            aria-label="New price"
                                                            aria-describedby="basic-addon2"
                                                            type='number'
                                                            min='1'
                                                            step='.01'
                                                        />
                                                        <Button id="button-addon2" className='btn btn-primary' onClick={(e) => handleServiceOrderPriceUpdate(e, o._id)}>
                                                            Update
                                                        </Button>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select style={{width: '150px'}} value={o.onlineServiceOrder?.status === 'accepted' ? 'accepted' : 'completion'} onChange={e => handleServiceOrderCompletion(o._id, e.target.value)}>
                                                <option value='accepted'>Accepted</option>
                                                <option value='completion'>Completed</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className='d-flex align-items-center gap-2' style={{width: '250px'}}>
                                                <button className='btn btn-dark btn-sm' onClick={() => handleMapViewModelOpen(o.onlineServiceOrder?.location.coordinates)}>View Location</button>
                                                <button className='btn btn-danger btn-sm'>Cancel Order</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <h3 className='text-center'>No online service orders yet</h3>
                    )}
                </Tab>

            </Tabs>

        </div>
    );
}

export default MySalesList;