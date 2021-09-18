
// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const EDIT_USER = 'session/EDIT_USER';

const editUser = (data) => ({
	type: EDIT_USER,
	payload: data 
})

const setUser = (data) => ({
	type: SET_USER,
	payload: data,
});

const removeUser = () => ({
	type: REMOVE_USER,
});


export const authenticate = () => async (dispatch) => {
	const response = await fetch('/api/auth/', {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ['An error occurred. Please try again.'];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch('/api/auth/logout', {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const editUserProfile = (username, email, password, file) => async (dispatch) => {

	// const form = new FormData();
	// form.append('username', username);
	// form.append('email', email);
	// form.append('password', password);
	// form.append('file', file);
	const data = {
		username,
		email,
		password,
		file
	}

	const response = await fetch('/api/auth/edit', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: data,
	});
	if (response.ok) {
		const data = await response.json();

		if (data.errors) {
			return;
		}

		dispatch(editUser(data));
	}
}

export const signUp = (username, email, password, file) => async (dispatch) => {
	const form = new FormData();
	form.append('username', username);
	form.append('email', email);
	form.append('password', password);
	form.append('file', file);
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: form,
	});

	if (response.ok) {
		const data = await response.json();
		if (data.servers) {
			dispatch(setUser(data));
		} else {
			dispatch(editUser(data))
		}
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ['An error occurred. Please try again.'];
	}
};

const initialState = { user: null };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { 
				user: action.payload.user, 
				servers: action.payload.servers, 
				friends: action.payload.friends 
			};
		case EDIT_USER:
			const newState = { ...state }
			newState.user = action.payload.user
			return newState;
		case REMOVE_USER:
			return { user: null };
		default:
			return state;
	}
}
