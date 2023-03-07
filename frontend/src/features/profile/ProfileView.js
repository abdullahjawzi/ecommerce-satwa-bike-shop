import {useState, useEffect} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';

import {toast} from 'react-toastify';

import '../../styles/profile.css';


const ProfileView = () => {

    const {roles} = useSelector(selectAuthUser);
    const axiosPrivate = useAxiosPrivate();

    const [displayData, setDisplayData] = useState({});

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axiosPrivate.get('/api/profile');
                const profile = response.data.profile;
                if(roles.indexOf('Employee') === -1) {
                    
                    setDisplayData({
                        ...profile.customer,
                        role: 'Customer'
                    })

                    setFirstName(profile.customer?.firstName);
                    setLastName(profile.customer?.lastName);
                    setAddress(profile.customer?.address);
                    setEmail(profile.customer?.email);
                    setPhone(profile.customer?.phone);
                } else {
                    
                    setDisplayData({
                        ...profile.employee,
                        role: roles.indexOf('Admin') === -1 ? 'Employee' : 'Admin'
                    });

                    setFirstName(profile.employee?.firstName);
                    setLastName(profile.employee?.lastName);
                    setAddress(profile.employee?.address);
                    setEmail(profile.employee?.email);
                    setPhone(profile.employee?.phone);
                    setAge(profile.employee?.age);
                }
                
            } catch (err) {
                console.log(err);
            }
        }
        getProfile();
    }, [axiosPrivate, roles]);

    const handleProfileUpdate = async () => {
        if(!firstName.trim() || !lastName.trim() || !address.trim() || !email.trim() || !phone.trim()) {
            toast.error('All fields are required');
            return;
        }

        if(roles.indexOf('Employee') >= 0 && (!age || +age <= 0)) {
            toast.error('Invalid age');
            return;
        }

        const data = {
            firstName,
            lastName,
            address,
            phone,
            email
        }

        if(roles.indexOf('Employee') >= 0) {
            data.age = +age;
        }

        try {
            const response = await axiosPrivate.put('/api/profile', JSON.stringify(data), {
                headers: {'Content-Type': 'application/json'}
            });

            const profile = response.data.profile;
                if(roles.indexOf('Employee') === -1) {
                    
                    setDisplayData({
                        ...profile.customer,
                        role: 'Customer'
                    })

                    setFirstName(profile.customer?.firstName);
                    setLastName(profile.customer?.lastName);
                    setAddress(profile.customer?.address);
                    setEmail(profile.customer?.email);
                    setPhone(profile.customer?.phone);
                } else {
                    
                    
                    setDisplayData({
                        ...profile.employee,
                        role: roles.indexOf('Admin') === -1 ? 'Employee' : 'Admin'
                    });

                    setFirstName(profile.employee?.firstName);
                    setLastName(profile.employee?.lastName);
                    setAddress(profile.employee?.address);
                    setEmail(profile.employee?.email);
                    setPhone(profile.employee?.phone);
                    setAge(profile.employee?.age);
                }
                toast.success('Profile Updated');

        } catch (err) {
            toast.error(err.response.data?.message);
        }   


    }

    return (
        displayData && displayData.firstName && (
            <>
                <div className="profile__main__container">
                    <div className="left__side">
                        <h2>{displayData.firstName} {displayData.lastName}</h2>
                        <h6>{displayData.email}</h6>

                        <div className="Personal__details__container">
                            <div className="label__side">
                                <label>Fisrt Name : </label>
                                <label>Last Name :</label>
                                <label>Title  :</label>
                                <label>Address :</label>
                                <label>Telephone  :</label>
                                {(displayData.role === 'Employee' || displayData.role === 'Admin') && <label>Age  :</label>}
                            </div>

                            
                            <div className="details__side">
                                <p>{displayData.firstName}</p>
                                <p>{displayData.lastName}</p>
                                <p>{displayData.role}</p>
                                <p>{displayData.address}</p>
                                <p>+94 {displayData.phone}</p>
                                {(displayData.role === 'Employee' || displayData.role === 'Admin') && <p>{displayData.age}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="right__side">
                        <h3>Update Your Details in Here!</h3>

                        <div className="form__inputs">
                            <label>
                                <input type="text" value={firstName} placeholder='Fisrt Name' onChange={e => setFirstName(e.target.value)}></input>
                            </label>

                            <label>
                                <input type="text" value={lastName} placeholder='Last Name' onChange={e => setLastName(e.target.value)}></input>
                            </label>

                            <label>
                                <input type="email" value={email} placeholder='Email' onChange={e => setEmail(e.target.value)}></input>
                            </label>

                            {/* <label>
                                <select>
                                    <option disabled>Title</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </label> */}

                            <label>
                                <input type="text" value={address} placeholder='Address' onChange={e => setAddress(e.target.value)}></input>
                            </label>

                            <label>
                                <input type="text" value={phone} placeholder='Mobile Number' onChange={e => setPhone(e.target.value)}></input>
                            </label>

                            {(displayData.role === 'Employee' || displayData.role === 'Admin') && (
                                <label>
                                    <input type="number" step='.00' min='1' value={age} placeholder='Enter age' onChange={e => setAge(e.target.value)}></input>
                                </label>
                            )}
                            

                            
                            <div className="button__area">
                                <button onClick={handleProfileUpdate}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default ProfileView;