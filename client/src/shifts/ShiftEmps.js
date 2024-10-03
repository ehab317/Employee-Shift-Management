import {Link, useParams, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { useDispatch } from 'react-redux'
const ShiftEmps = () => {

    const {id} = useParams()
    const api = process.env.REACT_APP_API_URL
    const [shift, setShift] = useState({})
    const [employees, setEmployees] = useState([])
    const [empId, setEmpId] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect( () => {
        getShift(id)
        getEmployees()
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

    const getShift = async (id) => {
        try {
            const {data} = await axios.get(`${api}/shifts/${id}`, {withCredentials: false})
            setShift(data.shift)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
        
    }

    function numberToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        // Pad with leading zeros if necessary
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = mins.toString().padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}`;
      }

      const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${api}/shifts/addEmp`, {id: shift._id, empId}, {withCredentials: true})
            setShift(data.shift)
            setMessage(data.message)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
      }

      const removeEmp = async (e, employeeId) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${api}/shifts/removeEmp`, {id: shift._id, employeeId}, {withCredentials: true})
            setShift(data.shift)
            setMessage(data.message)
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
        setEmpId(e.target.value)
      }
    
    return (
        <>
        <Header />
            <h1>Shift Employees</h1>
            <h3>Shift Date: {shift.Date && shift.Date.slice(0, 10)}</h3>
            <h3>Start Hour: {shift.StartHour && numberToTimeString(shift.StartHour)} </h3>
            <h3>Ending Hour: {shift.EndHour && numberToTimeString(shift.EndHour)}</h3>
            <br/>
            <h2>Add Employee</h2>
            <form>
                <select onChange={(e) => handleChange(e)}>
                    <option value=''>Select Employee</option>
                    {
                        employees.map( emp => {
                            return <option key={emp._id} value={emp._id}>{`${emp.FirstName} ${emp.LastName}`}</option>
                        })
                    }
                </select>
                <button onClick={ (e) => handleClick(e)}>Add</button>
            </form>
            <br/>
            <table border={1} style={{margin:'auto'}}>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Start Work Year</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shift.Employees && shift.Employees.map( emp => {
                            return <tr key={emp}>
                                <td>{employees.length && employees.find( e => e._id === emp)?.FirstName} {employees.length && employees.find( e => e._id === emp)?.LastName}</td>
                                <td>{employees.length && employees.find( e => e._id === emp)?.Department.Name}</td>
                                <td>{employees.length && employees.find( e => e._id === emp)?.StartWorkYear}</td>
                                <td><button onClick={(e) => removeEmp(e, emp)}>Remove</button></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <p>{message}</p>
            <Link to='/shifts'>Back</Link>
        </>
    )
}

export default ShiftEmps