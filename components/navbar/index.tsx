import Image from 'next/image';
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
        <div className='bg-slate-900'>
            <div className='flex justify-between py-3 px-24'>
                <Image
                  priority
                  src="/images/logo.png"
                  height={70}
                  width={160}
                />
                <button
                onClick={handleLogout}
                  className="border border-solid border-emerald-400 my-auto mx-0 px-6 py-3 w-40 text-white rounded-full hover:text-emerald-400"
                >
                  Sign Out
                </button>
            </div>
        </div>
    )
}

export default NavBar
