import { NavLink } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import EditProfileModal from '../EditProfileModal/index';
import './menu.css';

function Menu({setShowModal, socket}) {

    return (
        <div id='menu-modal'>
            <button id='close-modal' onClick={() => setShowModal(false)}><i className="fas fa-times fa-2x"/></button>
            <NavLink className='links' to='/' activeClassName='active'>Anarchy</NavLink>
            <NavLink className='logout' to='/about' activeClassName='active'>About</NavLink>
            <EditProfileModal socket={socket} />
            <LogoutButton />
        </div>
    )
}

export default Menu;