import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import { logout } from '../services/game';

class Navbar extends Component {
    state = {
        loggedIn: false
    };

    componentDidMount() {
        let loggedIn: boolean;
        if (localStorage.getItem("expiration")) {
            const exp = new Date(parseInt(localStorage.getItem("expiration")));
            loggedIn = exp > new Date();
        }
        else {
            loggedIn = false;
        }
        this.setState({ loggedIn });
    }
    render() {
        const { loggedIn } = this.state;
        return <header className="text-gray-700 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <span className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl cursor-pointer">Card Game</span>
                </span>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {
                        !loggedIn ? <>
                            <span className="mr-5 hover:text-gray-900">
                                <Link href="/login" >Login</Link>
                            </span>
                            <span className="mr-5 hover:text-gray-900">
                                <Link href="/register" >Register</Link>
                            </span>
                        </> :
                            <span className="mr-5 hover:text-gray-900">
                                <a href="#" onClick={() => { logout(); this.setState({ loggedIn: false }); Router.push('/login') }} >Logout</a>
                            </span>

                    }
                </nav>
            </div>
        </header>;
    }
}


export default Navbar;