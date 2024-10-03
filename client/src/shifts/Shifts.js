import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import { useSelector, useDispatch } from "react-redux"


const Shifts = () => {

    const {user} = useSelector( state => state.user )
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const [shifts, setShifts] = useState([])
    const api = process.env.REACT_APP_API_URL
    const [employees, setEmployees] = useState([])

    useEffect( () => {

        if(!user) {
            navigate('/login')
        }
        const getShifts = async () => {
            try {
                const {data} = await axios.get(`${api}/shifts`, {withCredentials: true})
                setShifts(data)
            } catch (error) {
                if(error.status === 403) {
                    setMessage(error.response.data.message)
                    localStorage.removeItem('token')
                    dispatch({type: 'USER_LOGOUT'})
                    setTimeout(() => navigate('/'), 3000)
                }
            }
        }
        getShifts()
        getEmployees()
    }, [])

    const getEmployees = async () => {
        try {
            const {data} = await axios.get(`${api}/employees`, {withCredentials: false})
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

    function numberToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = mins.toString().padStart(2, '0');
      
        return `${paddedHours}:${paddedMinutes}`;
      }

    return(
        <>
        <Header />
            <h1>Shifts</h1>
            <br/>
            <Link to='/shifts/addshift'>Add Shift</Link>
            <br/>
            <br/>   
            <table style={{margin:'auto'}} border={1}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Hour</th>
                        <th>End Hour</th>
                        <th>Employees</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map(shift => (
                        <tr key={shift._id}>
                            <td>{shift.Date.slice(0,10)}</td>
                            <td>{numberToTimeString(shift.StartHour)}</td>
                            <td>{numberToTimeString(shift.EndHour)}</td>
                            <td>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {shift.Employees.map(employee => (
                                        <tr key={employee}>
                                            <td>{employee && employees.length && employees.find( emp => emp._id === employee)?.FirstName}  {employees.length && employees.find( emp => emp._id === employee)?.LastName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </td>
                            <td><Link to={`/shifts/${shift._id}`}>Edit</Link></td>
                            <td><Link to={`/shift/${shift._id}/employees`}>Employees</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <Link to='/'>Back</Link>
            <br/>
            <p>{message}</p>
        </>
    )
}

export default Shifts