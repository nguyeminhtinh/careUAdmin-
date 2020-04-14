const userReducer = (state = [], action) => {
    // console.log('action datauser reducer', action);

    switch(action.type) {
        case 'GET_USER':
            return  state.concat([action.data]);
        case 'UPDATE_PROFILE':
            return state.map((user)=>user.id === action.id ? {...user,editing:!user.editing}:user)
        default: 
            return state;
    }
}

export default userReducer;