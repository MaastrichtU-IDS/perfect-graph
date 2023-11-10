import React from 'react'
import {Auth} from 'aws-amplify'

export const useUser = () => {
  const [user, setUser] = React.useState({})
  React.useEffect(() => {
    const call = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser()
        setUser(authUser)
      } catch (error) {
        console.log(error)
      }
    }
    call()
  }, [])
  return [user]
}
