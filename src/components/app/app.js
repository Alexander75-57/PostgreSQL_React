import './app.css';
import { useForm } from 'react-hook-form';

const App = () => {
    return (
        <div className="app-add-form">
            <h3>REGISTRASTION</h3>
            <form className="add-form d-flex">
                <input
                    id="email"
                    type="text"
                    className="form-control new-post-label"
                    placeholder="email"
                />
                <input
                    id="password"
                    type="password"
                    className="form-control new-post-label"
                    placeholder="password"
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

/* 
import { observer } from 'mobx-react-lite';
import store from '../counter/counter.store';
import './app.css';

const App = observer(() => {
    const { count, inc, dec, double } = store;
    return (
        <>
            <button onClick={() => inc(1)}>+</button>
            <span>{count}</span>
            <button onClick={() => dec(1)}>-</button>
            <span>{double}</span>
        </>
    );
});
export default App;
*/
