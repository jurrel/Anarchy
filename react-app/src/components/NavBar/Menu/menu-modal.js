import { NavLink } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import './menu.css';

function Menu({setShowModal}) {

    return (
        <div className='menu-modal'>
            <button id='close-modal' onClick={() => setShowModal(false)}><i className="fas fa-times fa-2x"/></button>
            <NavLink className='links' to='/servers' exact={true} activeClassName='active'>Servers</NavLink>
            <NavLink className='links' to='/' exact={true} activeClassName='active'>About</NavLink>
            <LogoutButton />
        </div>
    )
}

export default Menu;