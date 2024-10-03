import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './Home'
import Login from './user/Login';
import  Employees from './employees/Employees'
import NewEmployee from './employees/NewEmployee'
import Deps from './departments/Deps'
import NewDep from './departments/NewDep'
import EditDep from './departments/EditDep';
import Shifts from './shifts/Shifts'
import AddShift from './shifts/AddShift'
import EditShift from './shifts/EditShift'
import ShiftEmps from './shifts/ShiftEmps';
import EditEmployee from './employees/EditEmployee';
import Users from './user/Users';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/users' element={<Users />} />
        <Route path='/employees' element={<Employees />} />
        <Route path='/employees/newemployee' element={<NewEmployee />} />
        <Route path='/employees/:id' element={<EditEmployee />} />
        <Route path='/Departments' element={<Deps />} />
        <Route path='/Departments/newdep' element={<NewDep />} />
        <Route path='/Departments/:id' element={<EditDep />} />
        <Route path='/shifts' element={<Shifts />} />
        <Route path='/shifts/addshift' element={<AddShift />} />
        <Route path='/shifts/:id' element={<EditShift />} />
        <Route path='/shift/:id/employees' element={<ShiftEmps />} />
      </Routes>
    </div>
  );
}

export default App;
