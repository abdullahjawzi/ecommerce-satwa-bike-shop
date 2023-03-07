import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {toast} from 'react-toastify';



import '../../styles/employee_management/employeeAdd.css';



const EmployeeAdd = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const isEdit = searchParams.get('edit') === 'true' ? 'true' : null;
    const id = searchParams.get('id') !== null ? searchParams.get('id') : null;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState(0);
    const [salary, setSalary] = useState(0);
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Employee');

    useEffect(() => {
        if(isEdit === 'true' && id) {
            const getEmployee = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/users/employee/${id}`);
                    const emp = response.data.employee;
                    setFirstName(emp.employee?.firstName);
                    setLastName(emp.employee?.lastName);
                    setEmail(emp.employee?.email);
                    setPhone(emp.employee?.phone);
                    setAge(emp.employee?.age);
                    setSalary(emp.employee?.salary);
                    setAddress(emp.employee?.address);
                    setUsername(emp.username);
                } catch (err) {
                    navigate('/dash/admin/employee-management');
                }
            }
            getEmployee();
        }
    }, [isEdit, id, navigate, axiosPrivate]);

    const handleSubmit = async e => {
        e.preventDefault();

        const emp = {
            username: username.trim(),
            password: password.trim(),
            roles: role === 'Employee' ? ['Customer', 'Employee'] : ['Customer', 'Employee', 'Admin'],
            employee: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                age: +age,
                salary: +salary,
                address: address.trim()
            }
        }

        console.log(emp);

        if(
            !emp.username || 
            (!isEdit && !emp.password) || 
            (!isEdit && !confirmPassword.trim()) || 
            !emp.employee.firstName || 
            !emp.employee.lastName || 
            !emp.employee.email || 
            !emp.employee.phone ||
            !emp.employee.address ||
            age === 0 ||
            salary === 0
        ) {
            
            toast.error('All fields are required');
            return;
        }

        
        if(emp.password !== confirmPassword.trim()) {
            toast.error('Passwords are not match');
            return;
        }

        if(isEdit === 'true') {
            try {
                await axiosPrivate.put(`/api/users/employee/${id}`, JSON.stringify(emp), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                toast.success('Employee Updated');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAge(0);
                setSalary(0);
                setAddress('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                navigate('/dash/admin/employee-management');
            } catch (err) {
                toast.error(err.response.data.message);
            }
        } else {
            
            try {
                await axiosPrivate.post('/api/users/employee', JSON.stringify(emp) , {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Employee Added');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAge(0);
                setSalary(0);
                setAddress('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            } catch (err) {
                console.log(err);
                toast.error('Cannot add employee, try again');
            }
        }

    }
   
    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Employee' : 'Add New Employee'}</h1>
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
                    <div className='form-group form-group-wrapper-item'>
                        <label>Age</label>
                        <input type='number' step='1' min='1' value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div className='form-group form-group-wrapper-item'>
                        <label>Salary</label>
                        <input type='number' step='.01' min='1' value={salary} onChange={e => setSalary(e.target.value)} />
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

                 <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Employee Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>
              
                <button className='btn btn-dark'>{isEdit === 'true' ? 'Update Employee' : 'Add Employee'}</button>

            </form>
        </div>
    );
}

export default EmployeeAdd;