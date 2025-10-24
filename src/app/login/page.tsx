'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Form, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.css'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log('Login attempt:', values) // Debug log
    setLoading(true)
    try {
      const success = await login(values.email, values.password)
      console.log('Login result:', success) // Debug log
      if (success) {
        notification.success({
          message: 'Login Successful',
          description: 'Welcome back!',
          placement: 'topRight',
        })
        router.push('/')
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Invalid email or password',
          placement: 'topRight',
        })
      }
    } catch (error) {
      console.error('Login error:', error) // Debug log
      notification.error({
        message: 'Login Error',
        description: 'Something went wrong. Please try again.',
        placement: 'topRight',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>GetMyTasks</h1>
          <p>Sign in to manage your todos</p>
        </div>
        
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="login-button"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="login-demo">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  )
}
