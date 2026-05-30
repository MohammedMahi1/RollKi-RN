import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookmarkInitialStateSlice = {
    source:string;
    title:string;
    description:string;
}


const initialState:BookmarkInitialStateSlice[]  = []
const bookmarkSlice = createSlice({
    name:"bookmarkSlice",
    initialState,
    reducers:{
        bookmarkSet:(state,{payload}:PayloadAction<BookmarkInitialStateSlice>)=>{
            state.push(payload)
        }
    }
})
export const {bookmarkSet} = bookmarkSlice.actions
export default bookmarkSlice.reducer