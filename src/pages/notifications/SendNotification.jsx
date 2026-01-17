import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message, Radio } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

export default function SendNotification() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendType, setSendType] = useState('all');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const endpoint = sendType === 'all' 
        ? '/notifications/send-to-all'
        : '/notifications/send-to-user';
      
      await api.post(endpoint, values);
      message.success('Notification sent successfully');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<><BellOutlined /> Send Push Notification</>}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Send To">
            <Radio.Group value={sendType} onChange={(e) => setSendType(e.target.value)}>
              <Radio value="all">All Users</Radio>
              <Radio value="specific">Specific User</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="user_type"
            label="User Type"
            rules={[{ required: true, message: 'Please select user type' }]}
          >
            <Select placeholder="Select user type">
              <Option value="owner">Turf Owners</Option>
              <Option value="player">Players</Option>
            </Select>
          </Form.Item>

          {sendType === 'specific' && (
            <Form.Item
              name="user_id"
              label="User ID"
              rules={[{ required: true, message: 'Please enter user ID' }]}
            >
              <Input type="number" placeholder="Enter user ID" />
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Notification title" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="body"
            label="Message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <TextArea rows={4} placeholder="Notification message" maxLength={500} />
          </Form.Item>

          <Form.Item name="type" label="Type">
            <Select placeholder="Select notification type">
              <Option value="general">General</Option>
              <Option value="booking">Booking</Option>
              <Option value="payment">Payment</Option>
              <Option value="promotional">Promotional</Option>
              <Option value="reminder">Reminder</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<BellOutlined />}>
              Send Notification
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
