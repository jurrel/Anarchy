import { NavLink, Switch, Route } from 'react-router-dom';
import LoginForm from '../LoginForm';
import SignUpForm from '../SignUpForm';
import '../auth.css';

function LogInOut() {

    return (
        <div className='home'>
            <div className='splash-log'>
                <div className='logs'>
                    <NavLink to='/account/login' className='log-buttons'>Login</NavLink>
                    <NavLink to='/account/sign-up' className='log-buttons'>Sign Up</NavLink> 
                </div>
                <Switch>
                    <Route path='/account/login'>
                        <LoginForm />
                    </Route>
                    <Route path='/account/sign-up'>
                        <SignUpForm />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default LogInOut;