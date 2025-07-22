import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Spin, Alert, message } from 'antd'
import axios from '../api/axios'

const ProfilePage = () => {
  const [form] = Form.useForm()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setUser(res.data)
        form.setFieldsValue({
          username: res.data.username,
          email: res.data.email || ''
        })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [form])

  const handleUpdate = async (values: any) => {
    const userId = localStorage.getItem('userId')
    setSubmitting(true)
    try {
      await axios.put(`/users/${userId}/profile`, {
        username: values.username,
        email: values.email
      })
      message.success('Profile updated successfully')
    } catch {
      message.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spin />
  if (error) return <Alert message="Failed to load profile" type="error" />

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px' }}>
      <Card title="My Profile">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            username: user?.username,
            email: user?.email || ''
          }}
        >
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfilePage
