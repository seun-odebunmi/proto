import React from 'react'

import { setActiveUserId } from '../../actions'
import store from '../../store'
import './User.css'

const User = ({ user }) => {
  const { name } = user

  return (
    <div className="User" onClick={handleUserClick.bind(null, user)}>
      <div className="User__details">
        <p className="User__details-name">{name}</p>
      </div>
    </div>
  )
}

function handleUserClick({ user_id }) {
  store.dispatch(setActiveUserId(user_id))
}

export default User
