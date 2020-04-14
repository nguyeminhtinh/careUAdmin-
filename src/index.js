import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import store from './redux/store';

ReactDOM.render(
	<Provider store={store.store}>
		<PersistGate loading={null} persistor={store.persistor}>
			<App />
		</PersistGate>
	</Provider>
	, document.getElementById('content'));