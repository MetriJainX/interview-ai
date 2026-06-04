
// since hook layer ka kaam tha api or state layer ko manage krna 
// so hum user,setUser in sb ko le aye now next auth.api.js me se charo api nikal ke laege

import {useContext,useEffect} from 'react'
import {AuthContext} from '../auth.context.jsx' 
import {login,register,logout,getMe} from '../services/auth.api.js'

export const useAuth = () => {
    /**
     * this is written as const context=useContext(AuthContext)
     * const {user,setUser,loading,setLoading}=context
     *  but since apnko context me
     *  se user,setUser,loading,setLoading chahiye to apn direct usko destructure krke le aate h
     */
     const context=useContext(AuthContext)
const {user,setUser,loading,setLoading}=context
    // login ke time pr email,password dalne ke time api call hoti h or uska response ane tk user ko loading 
    // shor krna pdta thus we used handleLogin

    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }}


    const handleRegister = async ({username,email,password}) => {
            setLoading(true);
            try {
                const data = await register({username,email,password});
                setUser(data.user);
            } catch (error) {
                console.error('Registration failed:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleLogout = async () => {
            setLoading(true);   
try{
               const data= await logout();
                setUser(null);}
                catch(error){
                    console.error('Logout failed:', error);
                }finally{
                setLoading(false);
        }}

// wht we did here is jb apn login success krke home pr ate the and then reload krte the to puri state null hojati thi user ki usko thik krne we made this
//    getMe user ka current data leke aaega jisme token hoga or usko setUser me dal dega jisse reload krne pr bhi user ki state null na ho jaye
useEffect(()=>{
    const getAndSetUser = async () => {
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
}, []);

 return {user,loading,handleLogin,handleRegister,handleLogout}
}

// cors error se deal krne ke liye try catch state maintain krna zruri h
// jisse in case api aaye to try me jaye,error aaye to handle hojaye but finally loading wpas false hojaaye
