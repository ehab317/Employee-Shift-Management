import Header from "../components/Header"
import {useState} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'

const EditEmployee = () => {

    const {id} = useParams()
    const [employee, setEmployee] = useState({})
    const [message, setMessage] = useState('')
    const [deps, setDeps] = useState([])
    const [shifts, setShifts] = useState([])
    const [empShifts, setEmpShifts] = useState([])
    const [shiftToAddTo, setShiftToAddTo] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const api = process.env.REACT_APP_API_URL

    useEffect( () => {
        getEmployee(id)
        getDepartments()
        getEmployeeShifts()
    }, [])

    const getEmployeeShifts = async () => {
        try {
            const {data} = await axios.get(`${api}/shifts`, {withCredentials: false})
            let allShifts = []
            data.forEach(shift => {
                if (!shift.Employees.includes(id)) {
                    allShifts.push(shift)
                }
            })
            setShifts(allShifts)
            let employeeShifts = []
            data.forEach(shift => {
                if (shift.Employees.includes(id)) {
                    employeeShifts.push(shift)
                }
            })
            setEmpShifts(employeeShifts)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const getDepartments = async () => {
        try {
            const {data} = await axios.get(`${api}/departments`, {withCredentials: false})
            setDeps(data)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const getEmployee = async (id) => {
        try {
            const {data} =  await axios.get(`${api}/employees/${id}`, {withCredentials: true})
            setEmployee(data.employee)
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
        setEmployee({...employee, [e.target.name]: e.target.value})    
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${api}/employees/editemployee`, employee, {withCredentials: true})
            if (data.employee) {
                setMessage('Employee updated successfully')
            }
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        const id = employee._id
        try {
            const {data} = await axios.delete(`${api}/employees/deleteemployee/${id}`, {withCredentials: true})
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

    function numberToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = mins.toString().padStart(2, '0');
      
        return `${paddedHours}:${paddedMinutes}`;
      }

      const addToShift = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${api}/shifts/addEmp`, {id: shiftToAddTo, empId: id}, {withCredentials: true})
            setShifts(shifts.filter(shift => shift._id !== data.shift._id))
            setEmpShifts([...empShifts, data.shift])
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

    return (
        <>
        <Header />
            <h1>Edit Employee</h1>
            <form>
                <input type="text" placeholder ="first name" name="FirstName" onChange={(e) => handleChange(e)} defaultValue={employee.FirstName}/><br/>
                <input type="text" placeholder ="last name" name="LastName" onChange={(e) => handleChange(e)} defaultValue={employee.LastName}/><br/>
                <input type="number" placeholder ="start work year" name="StartWorkYear" onChange={(e) => handleChange(e)} defaultValue={employee.StartWorkYear}/><br/>
                <select name="DepartmentID" onChange={(e) => handleChange(e)}  value={employee.DepartmentID}>
                    <option value="">Select Department</option>
                    {
                        deps.map((dep) => {
                            return (
                                <option key={dep._id} value={dep._id}>{dep.Name}</option>
                            )
                        })
                    }
                </select>
                <button onClick={(e) => handleUpdate(e)}>Update</button> <button onClick={(e) => handleDelete(e)}>Delete Employee</button>
            </form>
            {message && <p>{message}</p>}
            <br/>
            <h2>Add To Shift</h2>
            <br/>
            <form>
                <select onChange={(e) => setShiftToAddTo(e.target.value)}>
                    <option value="">Select Shift</option>
                    {
                        shifts.map((shift) => {
                            return (
                                <option key={shift._id} value={shift._id}>{shift.Date.slice(0,10)} {numberToTimeString(shift.StartHour)} - {numberToTimeString(shift.EndHour)}</option>
                            )
                        })
                    }
                </select>
                <button onClick={(e) => addToShift(e)}>Add</button>
            </form>
            <Link to='/employees'>Back</Link>
            <br/>
            <h2>Shifts</h2>
            { shifts.length === 0 ? <p>No shifts yet</p> 
            :
            <table border={1} style={{margin: 'auto'}}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Hour</th>
                        <th>End Hour</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        empShifts.map((shift) => {
                            return (
                                <tr key={shift._id}>
                                    <td>{shift.Date.slice(0,10)}</td>
                                    <td>{numberToTimeString(shift.StartHour)}</td>
                                    <td>{numberToTimeString(shift.EndHour)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
}
        </>
    )
}

export default EditEmployee