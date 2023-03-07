import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useNavigate} from 'react-router-dom';

import MyMap from '../../components/MyMap';

import {toast} from 'react-toastify';

import {Table, Badge} from 'react-bootstrap';

import {MdClose} from 'react-icons/md';

import '../../styles/employee_management/employeeList.css';

const AvailableServiceOrderList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState([]);
    const [isMapViewModelOpen, setIsMapViewModelOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const getAllAvailableServiceOrders = async () => {
            try {
                const response = await axiosPrivate.get('/api/orders/online-service/employee/available');
                setOrders(response.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        getAllAvailableServiceOrders();
    }, [axiosPrivate]);

    const handleMapViewModelOpen = coordinates => {
        setCurrentLocation({long: coordinates[0], lat: coordinates[1]});
        setIsMapViewModelOpen(true);
    }

    const handleMapViewModelClose = () => {
        setIsMapViewModelOpen(false);
        setCurrentLocation(null);
    }

    const handleOrderAccept = async id => {
        try {
            await axiosPrivate.put('/api/orders/online-service/employee/accept', JSON.stringify({id}), {
                headers: {'Content-Type': 'application/json'}
            })

            toast.success('Service order taken');
            navigate('/dash/employee/sales-management');
        } catch (err) {
            console.log(err);
            toast.error(err.response.data?.message);
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
                <h1>Available Service Orders</h1>
               
            </aside>

            <hr></hr>

            {orders.length === 0 && (<h1 className='text-center'>No Available Service Orders</h1>)}
            {orders.length > 0 && (
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
                        {orders.map(o => (
                            <tr key={o._id}>
                                <td>{o.orderId}</td>
                                <td><Badge bg="warning" text="dark">{o.type}</Badge></td>
                                <td>{o.onlineServiceOrder?.problem}</td>
                                <td>{o.onlineServiceOrder?.contactNo}</td>
                                <td>{o.onlineServiceOrder?.price ? o.onlineServiceOrder?.price : 'Price not set yet'}</td>
                                <td><Badge bg="info">{o.onlineServiceOrder?.status}</Badge></td>
                                <td>
                                    <div className='d-flex align-items-center gap-2'>
                                        <button className='btn btn-dark btn-sm' onClick={() => handleMapViewModelOpen(o.onlineServiceOrder?.location.coordinates)}>View Location</button>
                                        <button className='btn btn-primary btn-sm' onClick={() => handleOrderAccept(o._id)}>Accept Service</button>
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

export default AvailableServiceOrderList;