
// this is the state layer
import {createContext,useState} from "react";

export const AuthContext = createContext() 
export const AuthProvider = ({children}) => {
    // this is a use state snippet jaha user ki initial value =useState(null) hai
  const [user, setUser] = useState(null)
//   initial dev me loading null hota h badme production me true set hota h
  const [loading, setLoading] = useState(true)

return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}