import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeAdd.css';

const CustomerAdd = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [searchParams] = useSearchParams();
    const isEdit = searchParams.get('edit') === 'true' ? searchParams.get('edit') : null;
    const id = searchParams.get('id') || null;

    
    const [customer, setCustomer] = useState({});

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if(isEdit && isEdit === 'true' && id) {
            const getCustomer = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/users/manage/customer/${id}`);
                    const cus = response.data.customer;
                    setCustomer(cus);
                    setFirstName(cus.customer?.firstName);
                    setLastName(cus.customer?.lastName);
                    setEmail(cus.customer?.email);
                    setPhone(cus.customer?.phone);
                    setAddress(cus.customer?.address);
                    setUsername(cus.username);

                } catch (err) {
                    toast.error(err.response.data?.message);
                    navigate('/dash/employee/customer-management');
                }
            }

            getCustomer();
        }
    }, [navigate, axiosPrivate, isEdit, id]);

    
    const handleSubmit = async e => {
        e.preventDefault();

        const newCustomer = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            username: username.trim(),
            password: password.trim(),
            roles: ['Customer']
        }

        
        if(
            !newCustomer.firstName ||
            !newCustomer.lastName ||
            !newCustomer.email ||
            !newCustomer.phone ||
            !newCustomer.address ||
            !newCustomer.username ||
            (!isEdit && !newCustomer.password) 
        ) {
            toast.error('All fields are required');
            return;
        }

        
        if(newCustomer.password !== confirmPassword.trim()) {
            toast.error('Passwords do not match');
            return;
        }

        if(isEdit === 'true' && id) {
            
            try {
                await axiosPrivate.put(`/api/users/manage/customer/${id}`, JSON.stringify(newCustomer), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');

                toast.success('Customer info updated');
                navigate('/dash/employee/customer-management');
            } catch(err) {
                toast.error(err.response.data?.message);
            }
        } else {

            
            try {
                await axiosPrivate.post('/api/users/manage/customer', JSON.stringify(newCustomer), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                toast.success('Customer added successfully');
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message);
            }
        }

        
    }

    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Customer' : 'Add New Customer'}</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <form className='employeeAdd-form' onSubmit={handleSubmit}>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>First Name</label>
                        <input type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Last Name</label>
                        <input type='text' value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Email</label>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Phone No.</label>
                        <input type='text' value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Address</label>
                        <input type='text' value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                </div>   

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Username</label>
                        <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group form-group-wrapper-item'>
                        <label>{isEdit === 'true' ? 'New Password' : 'Password'} {isEdit === 'true' && (<small className='text-bold text-dark'>(For security reasons we are not showing current password)</small>)}</label>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>{isEdit === 'true' ? 'Confirm New Password' : 'Confirm Password'}</label>
                        <input type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                </div>

                <button className='btn btn-dark'>{isEdit === 'true' ? 'Update Customer' : 'Add Customer'}</button>

            </form>
        </div>
    );
}

export default CustomerAdd;