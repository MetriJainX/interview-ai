/**
 * protected components: sometimes we want ki user bina login or register kre home page access na kr paye so we need to create protected 
 * but how do we see ki login h ya nhi user via auth.context me agr const[user] ki value null h mtlb user ni h 
 */

import {useAuth} from '../hooks/useAuth.js'
import React from 'react'
import{Navigate} from 'react-router'


const Protected = ({children}) => {    
    // use auth se user or loading nikal lia 
    const {user,loading} = useAuth()
    /** first chck ki loading horhi ya ni agr horhi then rturn loading else 
     * !user mtlb user logged in nhi to use navigate krdo login page pr
     */

    if(loading){
        return <main><h1>Loading...</h1></main>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return children
}
export default Protected
// now protect jis bhi component ko krna h use wrap krdia protected me insisde approutes