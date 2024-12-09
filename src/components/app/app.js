import { observable } from 'mobx';
import './app.css';
import axios from 'axios';

const App = () => {
    const store = observable({
        email: '',
        password: '',
        sendData: async () => {
            const data = {
                email: store.email,
                password: store.password,
            };
            console.log(data);
            try {
                const response = await axios.post({
                    url: 'http://localhost:4015/',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    //{query: data}
                    data: {
                        query: `mutation ($email: String!, $password: String!) {
                            addUser(email: $email, password: $password) {
                            email
                            password
                            }
                        }`,
                        variables: {
                            email: store.email,
                            password: store.password,
                        },
                    },
                });
                console.log('Success:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        handleSubmit: (e) => {
            e.preventDefault();
            store.sendData();
        },
    });

    return (
        <div className="app-add-form">
            <h3>REGISTRASTION</h3>
            <form className="add-form d-flex" onSubmit={store.handleSubmit}>
                <input
                    id="email"
                    type="text"
                    className="form-control new-post-label"
                    placeholder="email"
                    onChange={(e) => (store.email = e.target.value)}
                />
                <input
                    id="password"
                    type="password"
                    className="form-control new-post-label"
                    placeholder="password"
                    onChange={(e) => (store.password = e.target.value)}
                />
                <button type="submit" className="btn btn-outline-light">
                    Register
                </button>
            </form>
        </div>
    );
};
export default App;

/*
import { useForm } from 'react-hook-form';

const App = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        console.log('Registration Data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default App;
 */

// fetch('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
// })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log('Success:', data);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
/* 
{
    query: `
    mutation createUser($email: String!, $password: String!) {
        createUser(email: $email,  password: $password) {
            email
            password
        }
    }`,
},
{
    variables: {
        email: store.email,
        password: store.password,
    },
} 
*/
