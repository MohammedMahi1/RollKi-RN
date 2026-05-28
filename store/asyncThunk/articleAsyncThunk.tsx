import { createAsyncThunk } from "@reduxjs/toolkit";
import { AXIOS } from "api/AXIOS";
import { WikiApiResponse } from "types";

export const articleAsyncThunk = createAsyncThunk(
    "articleAsyncThunk",
    async(params:any,{rejectWithValue})=>{
        try {
            const res = await AXIOS.get("/w/api.php",{
                params:params
            })
            console.log(res);
            
            return res.data as WikiApiResponse
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
