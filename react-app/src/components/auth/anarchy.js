import { NavLink } from 'react-router-dom';


function Anarchy() {

    return (
        <div className='anarchy'>
            <NavLink activeClassName='active' className='links' to='/account/login'>Anarchy</NavLink>
        </div>
    )
}

export default Anarchy;
