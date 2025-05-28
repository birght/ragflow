import { useLogin } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import authorizationUtil from '@/utils/authorization-util';
import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'umi';
import styles from './index.less';
import RightPanel from './right-panel';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLogin();

  const DEFAULT_EMAIL = 'yanshi@neusoft.com';
  const DEFAULT_PASSWORD = '1qaz!QAZ';

  const autoLogin = useCallback(async () => {
    if (authorizationUtil.getAuthorization()) {
      navigate('/knowledge', { replace: true });
      return;
    }
    try {
      const rsaPassWord = rsaPsw(DEFAULT_PASSWORD) as string;
      const code = await login({
        email: DEFAULT_EMAIL.trim(),
        password: rsaPassWord,
      });
      if (code === 0) {
        navigate('/knowledge', { replace: true });
      } else {
        console.error('Login failed with code:', code);
      }
    } catch (error) {
      console.error('Auto login failed:', error);
    }
  }, [login, navigate]);

  useEffect(() => {
    const existingAuth = authorizationUtil.getAuthorization();
    if (existingAuth) {
      navigate('/knowledge', { replace: true });
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      const isJWT = token.split('.').length === 3;
      const authValue = isJWT ? token : `Bearer ${token}`;
      const tokenId = token.split('.')[0].replace(/^"|"$/g, '');
      authorizationUtil.setItems({
        Authorization: authValue,
        Token: tokenId,
        userInfo: JSON.stringify({
          email: 'yanshi@neusoft.com',
          name: '演示用户',
          avatar: '',
        }),
      });
      navigate('/knowledge', { replace: true });
    } else {
      autoLogin();
    }
  }, [autoLogin, location.search, navigate]);

  return (
    <div className={styles.loginPage}>
      <div>Logging in...</div>
      <div className={styles.loginRight}>
        <RightPanel />
      </div>
    </div>
  );
};

export default Login;
