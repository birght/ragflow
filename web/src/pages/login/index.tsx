import { useLogin } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import authorizationUtil from '@/utils/authorization-util';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'umi';
import styles from './index.less';
import RightPanel from './right-panel';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLogin();

  // 定义默认的账号密码
  const DEFAULT_EMAIL = 'hero@shiwanyu.com'; // 替换为你的邮箱
  const DEFAULT_PASSWORD = '1qaz!QAZ'; // 替换为你的密码

  // 自动登录函数
  const autoLogin = async () => {
    try {
      const rsaPassWord = rsaPsw(DEFAULT_PASSWORD) as string;
      const code = await login({
        email: DEFAULT_EMAIL.trim(),
        password: rsaPassWord,
      });

      if (code === 0) {
        console.log(
          'Auto login successful, Authorization:',
          authorizationUtil.getAuthorization(),
        );
        navigate('/knowledge', { replace: true });
      }
    } catch (error) {
      console.error('Auto login failed:', error);
    }
  };

  useEffect(() => {
    // 检查是否已有授权
    if (authorizationUtil.getAuthorization()) {
      navigate('/knowledge', { replace: true });
      return;
    }

    // 处理URL中的token
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      const isJWT = token.split('.').length === 3;
      const authValue = isJWT ? token : `Bearer ${token}`;
      authorizationUtil.setItems({
        Authorization: authValue,
        Token: token,
        userInfo: JSON.stringify({
          email: 'hero@shiwanyu.com',
          name: 'Hero',
          avatar: '',
        }),
      });
      navigate('/knowledge', { replace: true });
    } else {
      // 没有token时自动登录
      autoLogin();
    }
  }, [location.search, navigate]);

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
