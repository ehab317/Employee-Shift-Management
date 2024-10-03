import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from 'axios'
import Header from "../components/Header"
import { useSelector, useDispatch } from "react-redux"

const Employees = () => {

    const {user} = useSelector( state => state.user )
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [dep, setDep] = useState('')
    const api = process.env.REACT_APP_API_URL

    useEffect( () => {
        if(!user) {
            navigate('/login')
        }
        getEmployees()
        getDepartmentNames()
    }, [])

    const getEmployees = async () => {
        try {
            const {data} = await axios.get(`${api}/employees`, {withCredentials: true})
            setEmployees(data)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const getDepartmentNames = async () => {
        try {
            const {data} = await axios.get(`${api}/departments/names`, {withCredentials: false})
            setDepartments(data)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }    
    }

    const handleChange = (e) => {
        setDep(e.target.value)
    }

    function numberToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = mins.toString().padStart(2, '0');
      
        return `${paddedHours}:${paddedMinutes}`;
      }

    return (
        <>
        <Header />
            <h1>Employees</h1>
            <Link to='/employees/newemployee'>New Employee</Link>
            <br/>
            <br/>
            <select onChange={(e) => handleChange(e)}>
                <option value="">All Departments</option>
                {
                    departments.map( dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))
                }
            </select>
            <br/>
            <br/>
            <table border={1} style={{margin:'auto'}}>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Start Work Year</th>
                        <th>Department</th>
                        <th>Shifts</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employees.map( emp => (
                            (dep === '' || emp.Department.Name === dep) &&
                            <tr key={emp._id}>
                                <td><Link to={`/employees/${emp._id}`}>{emp.FirstName} {emp.LastName}</Link></td>
                                <td>{emp.StartWorkYear}</td>
                                <td>{emp.Department && <Link to={`/departments/${emp.Department._id}`}>{emp.Department.Name}</Link>}</td>
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Date</th>
                                                <th>Start Hour</th>
                                                <th>End Hour</th>
                                            </tr>
                                            {
                                                emp.shifts.map( shift => (
                                                    <tr key={shift._id}>
                                                        <td>{shift.Date.slice(0,10)}</td>
                                                        <td>{numberToTimeString(shift.StartHour)}</td>
                                                        <td>{numberToTimeString(shift.EndHour)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <br/>
            <Link to='/'>Back</Link>
            <br/>
            <p>{message}</p>
        </>
    )
}

export default Employees