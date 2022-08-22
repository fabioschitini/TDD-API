import {BrowserRouter as Router,Routes ,Route,Link,useLocation} from 'react-router-dom'
import Nav from './components/Nav'
import List from './components/showList'
import Submit from './components/SubmitGame'
import Login from './components/LogIn'

export const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{location.pathname}</div>
}
export const App=()=> {
  return (
    <div className="App">

    <Link to="/">Home</Link>
<Link to="/login">Login</Link>
<Link to="/submit">Submit</Link>
        <Routes>
        <Route exact path='/' element={<List/>} /> 
        <Route exact path='/submit' element={<Submit/>} />
        <Route exact path='/login' element={<Login/>} />
        </Routes>
      <LocationDisplay/>
    </div>
  );
}
