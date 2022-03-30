import { ref, ComputedRef, unref, computed, onMounted, watchEffect, watch } from 'vue';
import { set } from 'lodash-es';
import type { BasicTableProps } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import { isBoolean } from '@/utils/is';
import { APISETTING } from '../const';

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, tableData },
  emit: any
) {
  const dataSourceRef = ref([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource }: any = unref(propsRef);
      dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(propsRef);
    return rowKey
      ? rowKey
      : () => {
        return 'key';
      };
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt?: any) {
    try {
      setLoading(true);
      const { request, pagination }: any = unref(propsRef);
      //组装分页信息
      const pageField = APISETTING.pageField;
      const sizeField = APISETTING.sizeField;
      const totalField = APISETTING.totalField;
      const listField = APISETTING.listField;

      let pageParams = {};
      const { page = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps;

      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt[pageField]) || page;
        pageParams[sizeField] = pageSize;
      }

      const params = {
        ...pageParams,
      };
      const res = await request(params);

      const resultTotal = res[totalField] || 0;
      const currentPage = res[pageField];

      // 如果数据异常，需获取正确的页码再次执行
      if (resultTotal) {
        if (page > resultTotal) {
          setPagination({
            [pageField]: resultTotal,
          });
          fetch(opt);
        }
      }
      const resultInfo = res[listField] ? res[listField] : [];
      dataSourceRef.value = resultInfo;
      setPagination({
        [pageField]: currentPage,
        [totalField]: resultTotal,
      });
      if (opt && opt[pageField]) {
        setPagination({
          [pageField]: opt[pageField] || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultInfo),
        resultTotal,
      });
    } catch (error) {
      console.error(error);
      emit('fetch-error', error);
      dataSourceRef.value = [];
      // setPagination({
      //   pageCount: 0,
      // });
    } finally {
      setLoading(false);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  function setTableData(values: never[]) {
    dataSourceRef.value = values;
  }

  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  function getRecord(index: number) {
    return getDataSourceRef.value[index]
  }

  function updateValue(index: number, key: string, val: any) {
    let record = dataSourceRef.value[index]
    set(record, key, val)
    dataSourceRef.value[index] = record
  }

  function addRecord(record: never) {
    dataSourceRef.value.push(record)
  }

  async function reload(opt?: any) {
    await fetch(opt);
  }

  return {
    fetch,
    getRowKey,
    getDataSourceRef,
    getDataSource,
    setTableData,
    getRecord,
    updateValue,
    addRecord,
    reload,
  };
}
