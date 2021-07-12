import React from 'react'
import { Auth, } from 'aws-amplify';

export const useUser = () => {
  const [user, setUser] = React.useState({})
  React.useEffect(() => {
    const call = async () => {
      const authUser = await Auth.currentAuthenticatedUser()
      setUser(authUser)
    }
    call()
  }, [])
    return [user]
}