// src/pages/login/index.tsx
import { Domain } from '@/constants/common';
import { useLogin, useRegister } from '@/hooks/login-hooks';
import { useSystemConfig } from '@/hooks/system-hooks';
import { rsaPsw } from '@/utils';
import authorizationUtil from '@/utils/authorization-util';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, useLocation, useNavigate } from 'umi';
import styles from './index.less';
import RightPanel from './right-panel';

const Login = () => {
  const [title, setTitle] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const loading = signLoading || registerLoading;
  const { config } = useSystemConfig();
  const registerEnabled = config?.registerEnabled !== 0;

  const changeTitle = () => {
    if (title === 'login' && !registerEnabled) return;
    setTitle((title) => (title === 'login' ? 'register' : 'login'));
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields(['nickname']);
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      console.log('Token detected:', token);
      // 判断 token 是否已是 JWT 格式
      const isJWT = token.split('.').length === 3;
      const authValue = isJWT ? token : `Bearer ${token}`; // 如果不是 JWT，添加 Bearer 前缀
      authorizationUtil.setItems({
        Authorization: authValue,
        Token: token, // 保留原始 token
        userInfo: JSON.stringify({
          email: 'hero@shiwanyu.com',
          name: 'Hero',
          avatar: '',
        }),
      });
      console.log(
        'Stored Authorization:',
        authorizationUtil.getAuthorization(),
      );
      navigate('/knowledge', { replace: true });
    }
  }, [form, location.search, navigate]);

  const onCheck = async () => {
    try {
      const params = await form.validateFields();
      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          console.log(
            'Login successful, Authorization:',
            authorizationUtil.getAuthorization(),
          );
          navigate('/knowledge');
        }
      } else {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const toGoogle = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?scope=user:email&client_id=302129228f0d96055bee';
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLeft}>
        <div className={styles.leftContainer}>
          <div className={styles.loginTitle}>
            <div>{title === 'login' ? t('login') : t('register')}</div>
            <span>
              {title === 'login'
                ? t('loginDescription')
                : t('registerDescription')}
            </span>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="dynamic_rule"
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="email"
              label={t('emailLabel')}
              rules={[{ required: true, message: t('emailPlaceholder') }]}
            >
              <Input size="large" placeholder={t('emailPlaceholder')} />
            </Form.Item>
            {title === 'register' && (
              <Form.Item
                name="nickname"
                label={t('nicknameLabel')}
                rules={[{ required: true, message: t('nicknamePlaceholder') }]}
              >
                <Input size="large" placeholder={t('nicknamePlaceholder')} />
              </Form.Item>
            )}
            <Form.Item
              name="password"
              label={t('passwordLabel')}
              rules={[{ required: true, message: t('passwordPlaceholder') }]}
            >
              <Input.Password
                size="large"
                placeholder={t('passwordPlaceholder')}
                onPressEnter={onCheck}
              />
            </Form.Item>
            {title === 'login' && (
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>{t('rememberMe')}</Checkbox>
              </Form.Item>
            )}
            <div>
              {title === 'login' && registerEnabled && (
                <div>
                  {t('signInTip')}
                  <Button type="link" onClick={changeTitle}>
                    {t('signUp')}
                  </Button>
                </div>
              )}
              {title === 'register' && (
                <div>
                  {t('signUpTip')}
                  <Button type="link" onClick={changeTitle}>
                    {t('login')}
                  </Button>
                </div>
              )}
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={onCheck}
              loading={loading}
            >
              {title === 'login' ? t('login') : t('continue')}
            </Button>
            {title === 'login' && (
              <>
                {window.location.host === Domain && (
                  <Button
                    block
                    size="large"
                    onClick={toGoogle}
                    style={{ marginTop: 15 }}
                  >
                    <div className="flex items-center">
                      <Icon
                        icon="local:github"
                        style={{ verticalAlign: 'middle', marginRight: 5 }}
                      />
                      Sign in with Github
                    </div>
                  </Button>
                )}
              </>
            )}
          </Form>
        </div>
      </div>
      <div className={styles.loginRight}>
        <RightPanel />
      </div>
    </div>
  );
};

export default Login;
