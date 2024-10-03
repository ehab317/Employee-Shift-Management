import axios from "axios"
import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import Header from "../components/Header"
import {useDispatch} from 'react-redux'

const NewShift = () => {

    const [shift, setShift] = useState({})
    const [message, setMessage] = useState('')
    const api = process.env.REACT_APP_API_URL
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setShift({...shift, [e.target.name]: e.target.value})
    }

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(`${api}/shifts/addShift`, {...shift}, {withCredentials: true})
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
    return (
        <>
        <Header />
            <h1>New Shift</h1>
            <form>
                <input type="date" placeholder="date" name="Date" onChange={(e) => handleChange(e)} /><br/>
                <input type="time" placeholder="start hour" name="StartHour" onChange={(e) => handleTime(e)} /><br/>
                <input type="time" placeholder="end hour" name="EndHour" onChange={(e) => handleTime(e)} /><br/>
                <button onClick={(e) => handleClick(e)}>Add Shift</button>
            </form>
            <br/>
            <p>{message}</p>
            <br/>
            <Link to="/shifts">Back</Link>
        </>
    )
}

export default NewShift