import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Header from '../components/Header'
import {useDispatch} from 'react-redux'

const EditShift = () => {

    const api = process.env.REACT_APP_API_URL
    const {id} = useParams()
    const [shift, setShift] = useState({})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect( () => {
        getShift(id)
    }, [])

    const getShift = async (id) => {
        try {
            const {data} = await axios.get(`${api}/shifts/${id}`, {withCredentials: true})
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

    const handleChange = (e) => {
        setShift({...shift, [e.target.name]: e.target.value})
    }

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.put(`${api}/shifts/editShift`, {shift}, {withCredentials: true})
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

    const handleTime = (e) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        setShift({...shift, [e.target.name]: hours * 60 + minutes})
    }

    function numberToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        // Pad with leading zeros if necessary
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = mins.toString().padStart(2, '0');
      
        return `${paddedHours}:${paddedMinutes}`;
      }

    return (
        <>
        <Header />
            <h1>Edit Shift</h1>
            <form>
                <input type="date" placeholder="date" name="Date" onChange={(e) => handleChange(e)} defaultValue={shift.Date && shift.Date.slice(0, 10)}/><br/>
                <input type="time" placeholder="start hour" name="StartHour" onChange={(e) => handleTime(e)} defaultValue={shift.StartHour && numberToTimeString(shift.StartHour)} /><br/>
                <input type="time" placeholder="end hour" name="EndHour" onChange={(e) => handleTime(e)} defaultValue={shift.EndHour &&numberToTimeString(shift.EndHour)} /><br/>
                <button onClick={(e) => handleClick(e)}>Save</button>
            </form>
            <br/>
            <br/>
            <Link to="/shifts">Cancel</Link>
            <p>{message}</p>
        </>
    )
}

export default EditShift