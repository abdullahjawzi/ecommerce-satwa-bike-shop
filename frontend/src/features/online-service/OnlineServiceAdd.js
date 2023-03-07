import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import MyMap from '../../components/MyMap';

import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeAdd.css';


const OnlineServiceAdd = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();

    const isEdit = searchParams.get('edit') === 'true' ? searchParams.get('edit') : null;
    const id = searchParams.get('id') || null;


    const [problem, setProblem] = useState('');
    const [contact, setContact] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        if(isEdit && isEdit === 'true' && id) {
            const getOrder = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/orders/online-service/${id}`);
                    const order = response.data.order.onlineServiceOrder;
                    setProblem(order?.problem);
                    setContact(order?.contactNo);
                    setCurrentLocation({lat: order?.location.coordinates[1], long: order?.location.coordinates[0]});
                } catch (err) {
                    navigate(-1);
                }
            }
            getOrder();
        }
    }, [isEdit, id, axiosPrivate, navigate])

    const handleSubmit = async e => {
        e.preventDefault();

        const newService = {
            problem: problem.trim(),
            contact: contact.trim(),
            currentLocation
        }

        if(!newService.problem || !newService.contact) {
            toast.error('Please fill all the fields');
            return;
        }

        if(!newService.currentLocation) {
            toast.error('Please select your location on the map');
            return;
        }

        if(isEdit === 'true' && id) {
            try {
                await axiosPrivate.put(`/api/orders/online-service/${id}`, JSON.stringify(newService), {
                    headers: {'Content-Type': 'application/json'}
                })
                setProblem('');
                setContact('');
                setCurrentLocation(null);
                toast.success('Service order updated');
                navigate('/dash/my-orders');
            } catch (err) {
                console.log(err)
                toast.error(err.response.data?.message);
            }

        } else {

            
            try {
                await axiosPrivate.post('/api/orders/online-service', JSON.stringify(newService), {
                    headers: {'Content-Type': 'application/json'}
                });

                setProblem('');
                setContact('');
                setCurrentLocation(null);
                toast.success('Service Order is created');
            } catch (err) {
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Online Service' : 'Request New Online Service'}</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <form className='employeeAdd-form' onSubmit={handleSubmit}>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Problem (Please enter detailed description of the problem that your having)</label>
                        <textarea rows={10} className='p-4' value={problem} onChange={e => setProblem(e.target.value)}></textarea>
                    </div>
                </div> 

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Contact No.</label>
                        <input type='text' value={contact} onChange={e => setContact(e.target.value)} />
                    </div>
                </div>   

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label className='mb-2'>Select Your Location (double click on the map to mark your location)</label>
                        <MyMap 
                            height={600} 
                            handleCurrentLocation={setCurrentLocation} 
                            currentLocation={currentLocation} 
                        />
                    </div>
                </div>

                <button className='btn btn-dark'>{isEdit === 'true' ? 'Update Service Order' : 'Request Service'}</button>    

            </form>

        </div>
    );
}

export default OnlineServiceAdd;