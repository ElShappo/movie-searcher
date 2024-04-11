import LoginIcon from "@mui/icons-material/Login";
import { Button, ConfigProvider, FloatButton, Form, FormProps, Input, Modal, notification, theme } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { observer } from "mobx-react-lite";
import authorization from "./store/authorization";
import { PASSWORD, USERNAME } from "./constants";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const App = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { username, password } = values;
    if (username === USERNAME && password === PASSWORD) {
      console.log("Success:", values);
      authorization.authorize();

      notificationApi.success({
        message: "Авторизация прошла успешно!",
        duration: 4,
      });
      setIsModalOpen(false);
    } else {
      console.error("Invalid username or password");

      notificationApi.error({
        message: "Неправильное имя пользователя или пароль",
        duration: 4,
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      {contextHolder}
      <Header />
      <Outlet />
      {!authorization.get() ? (
        <FloatButton
          type="primary"
          icon={
            <div className="flex items-center justify-center">
              <LoginIcon />
            </div>
          }
          onClick={showModal}
          className="fixed bottom-4 right-4"
        ></FloatButton>
      ) : null}
      <Modal title="Авторизация" open={isModalOpen} centered footer={null} onCancel={handleCancel}>
        <div className="flex items-center justify-center pt-2">
          <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
            <Form.Item<FieldType>
              label="Имя"
              name="username"
              rules={[{ required: true, message: "Пожалуйста, введите имя!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Подтвердить
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
});

export default App;
