import ReactDOM from 'react-dom/client';
import { App } from './App';
import { CompassStoreProvider } from './store/CompassStore';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CompassStoreProvider>
    <App />
  </CompassStoreProvider>,
);
