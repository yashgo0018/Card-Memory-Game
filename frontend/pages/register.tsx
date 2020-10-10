import { Component } from 'react';
import Layout from '../components/layout';
import { register } from '../services/game';
import Router from 'next/router'
import Link from 'next/link';
const validateForm = (errors: any) => {
    let valid = true;
    Object.values(errors).forEach((val: string) => val.length > 0 && (valid = false));
    return valid;
};

class LoginPage extends Component {
    state = {
        name: "",
        username: "",
        password: "",
        password2: "",
        errors: {
            name: "",
            username: "",
            password: "",
            password2: "",
            cred: ""
        }
    }

    handleChange = (event) => {
        console.log("Hello");

        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        console.log(name);
        errors.cred = '';
        switch (name) {
            case 'name':
                errors.name = value == ''
                    ? 'Name is required'
                    : '';
                break;
            case 'username':
                errors.username = value == ''
                    ? 'Username is required'
                    : '';
                break;
            case 'password':
                errors.password = value == ''
                    ? 'Password is required'
                    : '';
                errors.password2 = (this.state.password2 != value)
                    ? 'Password must match Confirm Password'
                    : '';
                break;
            case 'password2':
                errors.password2 = (this.state.password != value)
                    ? 'Password must match Confirm Password'
                    : '';
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
    }

    handleSubmit = async () => {
        const { name, username, password, errors } = this.state;
        if (validateForm(errors)) {
            const registered = await register(name, username, password);
            if (!registered) {
                errors.cred = "Username Already in use";
                this.setState({ errors });
            }
            else {
                Router.push("/");
            }
        }
    }

    render() {
        const {
            name,
            username,
            password,
            password2,
            errors: {
                name: nameE,
                username: usernameE,
                password: passwordE,
                password2: password2E,
                cred: credE
            }
        } = this.state;
        return <Layout style={{ height: '100%', padding: "auto 0" }}>
            <div className="w-full max-w-xs mx-auto py-auto mt-5">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Name
                        </label>
                        <input
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                            className={`shadow appearance-none border ${nameE != "" && "border-red-500 mb-3"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="name"
                            type="text"
                            placeholder="Name" />
                        <p className="text-red-500 text-xs italic">{nameE}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            name="username"
                            value={username}
                            onChange={this.handleChange}
                            className={`shadow appearance-none border ${usernameE != "" && "border-red-500 mb-3"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="username"
                            type="text"
                            placeholder="Username" />
                        <p className="text-red-500 text-xs italic">{usernameE}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            className={`shadow appearance-none border ${passwordE != "" && "border-red-500 mb-3"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="password"
                            type="password"
                            placeholder="******************" />
                        <p className="text-red-500 text-xs italic">{passwordE}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                            Confirm Password
                        </label>
                        <input
                            name="password2"
                            value={password2}
                            onChange={this.handleChange}
                            className={`shadow appearance-none border ${password2E != "" && "border-red-500 mb-3"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            id="password2"
                            type="password"
                            placeholder="******************" />
                        <p className="text-red-500 text-xs italic">{password2E}</p>
                        <p className="text-red-500 text-xs italic mt-4">{credE}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={this.handleSubmit}>
                            Sign Up
                        </button>
                        <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" >
                            <Link href="/login">
                                Login?
                            </Link>
                        </span>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2020 Acme Corp. All rights reserved.
                </p>
            </div>
        </Layout>
    }
}

export default LoginPage;