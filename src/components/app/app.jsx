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

// export const App = observer(() => {
//     return (
//         <div className="App">
//             <h1>{counterStore.count}</h1>
//             <h2>{counterStore.double}</h2>

//             <button onClick={counterStore.inc}>+</button>
//             <button onClick={counterStore.dec}>-</button>
//         </div>
//     );
// });
