import '../css/Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
const App = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Login');
    const navigate = useNavigate();
    
    const navigateToRegister =  ()=>{
        navigate('/register')
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('trying to fetch inside login')
            const res = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                credentials: 'include',
            });
            console.log('fetch done')
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || 'Login failed')
                return
            }
            setMessage(data.message || 'Login Successful');
            navigate('/home')
        }
        catch (err) {
            console.log(err.message);
        }
    };

    return (
        <>
            <div className="login-page">
                <nav className='login-nav'>
                    <div className='left-nav'>
                        <div className='project-name'>
                            TourDay
                        </div>
                    </div>
                    <div className="login-right-nav" onClick={navigateToRegister}>
                        Register
                    </div>
                </nav>
                <main>
                    <div className='hero-text'>{message}</div>
                    {/* <video className='hero-video' src="https://cdn.pixabay.com/video/2020/07/25/45569-443244046_large.mp4" autoPlay muted loop playsInline></video> */}
                    <div className="login-form">
                        <form onSubmit={handleLogin}>

                            <div className='form-username'>
                                <label htmlFor="username">USERNAME</label>
                                <input type="text" id="username" name="username" required onChange={e => setUsername(e.target.value)} />
                            </div>

                            <div className='form-password'>
                                <label htmlFor="password">PASSWORD</label>
                                <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
                            </div>

                            <button type="submit" >Submit</button>
                        </form>

                    </div>
                </main>
            </div>
        </>

    )
}

export default App;