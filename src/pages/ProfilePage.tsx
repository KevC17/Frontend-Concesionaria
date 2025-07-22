import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Spin, Alert, message } from 'antd'
import axios from '../api/axios'

const ProfilePage = () => {
  const [form] = Form.useForm()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(false)

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId')
    try {
      const res = await axios.get(`/users/${userId}`)
      setUser(res.data)
      form.setFieldsValue({
        username: res.data.username,
        email: res.data.email || ''
      })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleUpdate = async (values: any) => {
    const userId = localStorage.getItem('userId')
    setSubmitting(true)
    try {
      await axios.put(`/users/${userId}/profile`, {
        username: values.username,
        email: values.email
      })
      message.success('Perfil actualizado correctamente')
      setEditing(false)
      fetchUserData()
    } catch {
      message.error('No se pudo actualizar el perfil')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spin />
  if (error) return <Alert message="No se pudo cargar el perfil" type="error" />

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px' }}>
      <Card title="Mi perfil">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            username: user?.username,
            email: user?.email || ''
          }}
        >
          <Form.Item label="Nombre de usuario" name="username" rules={[{ required: true }]}>
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item label="Correo electrónico" name="email">
            <Input type="email" disabled={!editing} />
          </Form.Item>
          {editing ? (
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                Guardar cambios
              </Button>
            </Form.Item>
          ) : (
            <Form.Item>
              <Button type="default" onClick={() => setEditing(true)} block>
                Cambiar datos
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  )
}

export default ProfilePage
