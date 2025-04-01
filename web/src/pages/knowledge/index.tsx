// src/pages/knowledge/index.tsx
import { useInfiniteFetchKnowledgeList } from '@/hooks/knowledge-hooks';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import authorizationUtil from '@/utils/authorization-util';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Empty,
  Flex,
  Input,
  Skeleton,
  Space,
  Spin,
} from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'umi';
import { useSaveKnowledge } from './hooks';
import styles from './index.less';
import KnowledgeCard from './knowledge-card';
import KnowledgeCreatingModal from './knowledge-creating-modal';

const KnowledgeList = () => {
  const { data: userInfo, error: userInfoError } = useFetchUserInfo();
  const { t } = useTranslation('translation', { keyPrefix: 'knowledgeList' });
  const {
    visible,
    hideModal,
    showModal,
    onCreateOk,
    loading: creatingLoading,
  } = useSaveKnowledge();
  const {
    fetchNextPage,
    data,
    hasNextPage,
    searchString,
    handleInputChange,
    loading,
    error: knowledgeError,
  } = useInfiniteFetchKnowledgeList();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = authorizationUtil.getAuthorization(); // 检查 Authorization
    if (!auth) {
      console.log('No authorization found, redirecting to login');
      // navigate('/login');
    } else {
      console.log('Authorization found in Knowledge page:', auth);
    }
    if (userInfoError || knowledgeError) {
      console.log('Data fetch error:', userInfoError || knowledgeError);
    }
  }, [navigate, userInfoError, knowledgeError]);

  const nextList =
    data?.pages?.flatMap((x) => (Array.isArray(x.kbs) ? x.kbs : [])) ?? [];
  const total = data?.pages?.at(-1)?.total ?? 0;

  return (
    <Flex className={styles.knowledge} vertical flex={1} id="scrollableDiv">
      <div className={styles.topWrapper}>
        <div>
          <span className={styles.title}>
            {t('welcome')}, {userInfo?.nickname || 'User'}
          </span>
          <p className={styles.description}>{t('description')}</p>
        </div>
        <Space size={'large'}>
          <Input
            placeholder={t('searchKnowledgePlaceholder')}
            value={searchString}
            style={{ width: 220 }}
            allowClear
            onChange={handleInputChange}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={styles.topButton}
          >
            {t('createKnowledgeBase')}
          </Button>
        </Space>
      </div>
      <Spin spinning={loading}>
        <InfiniteScroll
          dataLength={nextList?.length ?? 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={!!total && <Divider plain>{t('noMoreData')} 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <Flex
            gap={'large'}
            wrap="wrap"
            className={styles.knowledgeCardContainer}
          >
            {nextList?.length > 0 ? (
              nextList.map((item: any, index: number) => (
                <KnowledgeCard item={item} key={`${item?.name}-${index}`} />
              ))
            ) : (
              <Empty
                className={styles.knowledgeEmpty}
                description="No data available"
              />
            )}
          </Flex>
        </InfiniteScroll>
      </Spin>
      <KnowledgeCreatingModal
        loading={creatingLoading}
        visible={visible}
        hideModal={hideModal}
        onOk={onCreateOk}
      />
    </Flex>
  );
};

export default KnowledgeList;
