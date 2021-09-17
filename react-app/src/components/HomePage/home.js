import { Link, useHistory } from 'react-router-dom';
import './home.css';

function Home() {
    const history = useHistory();

    return (
        <div className='home'>
            <div className='splash'>
                <div onClick={() => history.push('/')} className='return-button'>
                    <Link className='return-header' to='/'>Return to Anarchy!</Link>
                    <p>Click me!</p>
                </div>
                <p>This app is loosely based off of great sites like Discord, 
                    Slack and Zoom to demonstrate a working knowledge of Full-Stack Applications!
                    The tech stack for this application uses Python/Flask on the back end, Javascript/React 
                    on the front end and is deployed on Heroku creating environments with Docker. We had 1 week
                    to build out the application. In the meantime we taught ourselves how to implement Web Sockets
                    and Video Chat using WebRTC on top of meeting our minimum viable product. Enjoy the demo of the site, if you have any questions reach out to 
                    us at one of the links below!
                </p>
                <div className='dev-team'>
                    <div className='dev'>
                        <h2>Walker Williams</h2>
                        <div className='dev-links'>
                            <a className='links' href='https://github.com/walkerwilliamsx'><i className="fab fa-github fa-2x"/></a>
                        </div>

                    </div>
                    <div className='dev'>
                        <h2>Gerryl Esparacion</h2>
                        <div className='dev-links'>
                            <a className='links' href='https://www.linkedin.com/in/gerryle/'><i className="fab fa-linkedin fa-2x" /></a>
                            <a className='links' href='https://github.com/jurrel'><i className="fab fa-github fa-2x"/></a>
                        </div>

                    </div>
                    <div className='dev'>
                        <h2>Sean Cotter</h2>
                        <div className='dev-links'>
                            <a className='links' href='https://www.linkedin.com/in/sean-cotter-43572417/'><i className="fab fa-linkedin fa-2x" /></a>
                            <a className='links' href='https://github.com/Cotter45'><i className="fab fa-github fa-2x"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;