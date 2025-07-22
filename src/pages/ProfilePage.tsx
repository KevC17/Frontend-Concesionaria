import { useEffect, useState } from 'react'
import { Card, Spin, Alert } from 'antd'
import axios from '../api/axios'

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    axios
      .get(`/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spin />
  if (error) return <Alert message="Failed to load profile" type="error" />

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="My Profile">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
      </Card>
    </div>
  )
}

export default ProfilePage
