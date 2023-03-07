import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`/api/users`);
        
        return {
            isError: false,
            data: response.data.users
        }
    } catch (err) {
        return {
            data: err.response.data.message,
            isError: true
        }
    }
})


const initState = {
    users: [],
    usersStatus: 'idle',
    error: null
}


const usersSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.pending, (state, action) => {
            state.usersStatus = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            const {isError, data} = action.payload;
            if(isError) {
                state.error = data;
            } else {
                state.users = data;
            }
            state.usersStatus = 'success'
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.usersStatus = 'success';
            state.error = action.payload?.data;
        })
    }
})

export const selectAllUsers = state => state.users.users;
export const selectUsersStatus = state => state.users.usersStatus;
export const selectUsersError = state => state.users.error;

export default usersSlice.reducer;