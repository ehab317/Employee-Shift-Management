import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Header = () => {

    const {user} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        dispatch({type: 'USER_LOGOUT'})
        navigate('/login')
    }
    return (
        <>
        {user ? <div><h2>hello {user.name}</h2> <button onClick={(e) => handleClick(e)}>Logout</button></div> :
         <div><h2>hello guest</h2><Link to='/login'>Login</Link></div>}
        </>
    )
}

export default Header