import { Route, Switch, Link } from 'react-router-dom';
import OnlineFriends from './onlineFriends';
import PendingFriends from './pending-friends';

function Friends({ socket }) {

    return (
        <div className='friends-container'>
            <div className='friends-nav'>
                <Link className='links' to='/friends/online'>Friends</Link>
                <p> | </p>
                <Link className='links' to='/friends/pending'>Pending</Link>
            </div>
            <Switch>
                <Route exact path='/friends/online'>
                    <OnlineFriends socket={socket} />
                </Route>
                <Route exact path='/friends/pending'>
                    <PendingFriends />
                </Route>
            </Switch>
        </div>
    )
}

export default Friends;