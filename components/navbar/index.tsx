import Router from 'next/router';
import logout from '../../pages/api/authentication/logout'

function NavBar() {
    const handleLogout = () => {
        if(logout()) 
        {
            Router.push('/');
        }
        alert('Logout Success')
    }
    return (
        <div className='bg-slate-700'>
            <div className='flex justify-between p-16'>
                <p className='text-white'>SIMBA</p>
                <a className='text-white cursor-pointer' onClick={handleLogout}>Sign Out</a>
            </div>
        </div>
    )
}

export default NavBar
