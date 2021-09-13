import { NavLink } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import './menu.css';

function Menu({setShowModal}) {

    return (
        <div className='menu-modal'>
            <button id='close-modal' onClick={() => setShowModal(false)}><i className="fas fa-times"/></button>
            <NavLink className='links' to='/' exact={true} activeClassName='active'>Home</NavLink>
            <NavLink className='links' to='/users' exact={true} activeClassName='active'>Users</NavLink>
            <LogoutButton />
        </div>
    )
}

export default Menu;