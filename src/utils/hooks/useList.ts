import type { ComputedRef, Ref, VNodeRef } from 'vue'
import type { FormInstance } from 'element-plus'
import { reactive, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { trimQuery } from '@/utils/libs'

const DEFAULT_PAGE_SIZE = 10
export const useList = (options: ListOptions): List => {
  const router = useRouter()
  const route = useRoute()
  // let self: any = null
  let routeQ = {}
  if (options.supportUrlQuery !== false) {
    try {
      routeQ = route.query?.q ? JSON.parse(route.query.q as string) : {}
    } catch (e) {
      routeQ = {}
    }
  }
  // @ts-ignore
  const state = reactive<List>({
    setListRef: (listRef: Ref<VNodeRef>) => {
      state.listRef = listRef
    },
    listRef: null,
    setFormRef: (formRef: Ref<FormInstance>) => {
      state.formRef = formRef
    },
    formRef: null,
    supportUrlQuery: options.supportUrlQuery === false ? false : true,
    fetchCount: 0,
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isError: computed<boolean>(() => !!state.errorInfo),
    // isError: false,
    errorInfo: null,
    query: { ...options.query, ...routeQ },
    records: [],
    tableColumns: options.tableColumns ? [...options.tableColumns] : [],
    pagination: {
      pageNo: (routeQ as any).pageNo || 1,
      pageSize: (routeQ as any).pageSize || DEFAULT_PAGE_SIZE,
      totalPage: 1,
      totalCount: 0,
      onCurrentChange(pageNo: number) {
        state.pagination.pageNo = pageNo
        state.onLoad()
      },
      onSizeChange(pageSize: number) {
        state.pagination.pageSize = pageSize
        state.onLoad()
      },
      ...options.pagination
    },
    initState() {
      Object.assign(state, {
        fetchCount: 0,
        isRefreshing: false,
        isLoading: false,
        isFinished: false,
        // isError: false,
        errorInfo: null,
        query: { ...options.query },
        records: [],
        tableColumns: options.tableColumns ? [...options.tableColumns] : [],
        pagination: {
          ...state.pagination,
          pageNo: (routeQ as any).pageNo || 1,
          pageSize: (routeQ as any).pageSize || DEFAULT_PAGE_SIZE,
          totalPage: 1,
          totalCount: 0,
          ...options.pagination
        }
      })
    },
    async onRefresh(moreQuery: ListQuery = {}) {
      state.records = [] // 清空列表数据
      state.isFinished = false
      state.isRefreshing = true
      return await state.onLoad(moreQuery)
    },
    async onLoad(moreQuery: ListQuery = {}, shouldReset = false) {
      if (state.formRef) {
        await new Promise((resolve, reject) => {
          state.formRef.validate((valid: boolean, fields: any[]) => {
            if (valid) {
              resolve(valid)
            } else {
              reject(fields)
            }
          })
        })
      }
      if (moreQuery instanceof Event) {
        moreQuery = {}
      }
      const { pageNo, pageSize, ...otherCustomQuery } = moreQuery
      if (shouldReset) {
        state.query = { ...options.query, ...otherCustomQuery }
        state.pagination.pageNo = 1
        state.pagination.pageSize = pageSize || DEFAULT_PAGE_SIZE
      }
      if (Object.prototype.hasOwnProperty.call(moreQuery, 'pageNo')) {
        state.pagination.pageNo = pageNo as number
      }
      if (Object.prototype.hasOwnProperty.call(moreQuery, 'pageSize')) {
        state.pagination.pageSize = pageSize as number
      }
      if (Object.prototype.hasOwnProperty.call(state.query, 'pageNo')) {
        state.query.pageNo = state.pagination.pageNo
      }
      if (Object.prototype.hasOwnProperty.call(state.query, 'pageSize')) {
        state.query.pageSize = state.pagination.pageSize
      }
      state.isLoading = true
      state.fetchCount++
      if (state.isRefreshing) {
        state.records = [] // 清空列表数据
        state.isRefreshing = false
      }
      if (state.supportUrlQuery) {
        if (Object.keys(state.query).length) {
          router.replace({ query: { q: JSON.stringify(state.query) } })
        } else {
          router.replace({ query: {} })
        }
      }
      await options
        .onLoad(trimQuery(state.query))
        .then((data: any) => {
          // state.isError = false
          state.errorInfo = null
          return data
        })
        .catch((err: Error) => {
          // state.isError = true
          state.errorInfo = err
          state.records = []
          throw err
        })
        .finally(() => {
          state.isLoading = false
        })
    },
    async onReset(customQuery: ListQuery = {}) {
      if (customQuery instanceof Event) {
        customQuery = {}
      }
      state.initState()
      return state.formRef
        ? await nextTick(async () => {
            return await state.onLoad(customQuery, true)
          })
        : await state.onLoad(customQuery, true)
    }
  })
  // self = state
  return state
}

export interface ListOptions {
  supportUrlQuery?: boolean
  tableColumns?: TableColumn[]
  onLoad: (query: any) => Promise<void>
  query?: ListQuery
  pagination?: ListPagination
}

export interface TableColumn extends Record<string, any> {
  type?: 'selection' | 'index' | 'expand'
  index?: number | ((index: number) => number)
  label?: string
  columnKey?: string
  prop?: string
  slot?: string
  width?: string | number
  minWidth?: string | number
  fixed?: true | 'left' | 'right'
  showOverflowTooltip?: boolean
  renderHeader?: (param: { column: TableColumn; $index: number }) => JSX.Element
  render?: (scope: { row: any; column: TableColumn; $index: number }) => JSX.Element
}

export interface ListQuery extends Record<string, any> {
  pageNo?: number
  pageSize?: number
}

export interface ListPagination {
  pageNo: number
  pageSize: number
  totalPage: number
  totalCount: number
  onCurrentChange?: (pageNo: number) => void
  onSizeChange?: (pageSize: number) => void
}

export interface List {
  setListRef: (formRef: Ref<VNodeRef>) => void
  listRef: Ref<VNodeRef> | null
  setFormRef: (formRef: Ref<FormInstance>) => void
  formRef: Ref<FormInstance> | null
  supportUrlQuery: boolean
  fetchCount: number
  isRefreshing: boolean
  isLoading: boolean
  isFinished: boolean
  isError: ComputedRef<boolean>
  errorInfo: Error | null
  query: ListQuery
  records: any[]
  tableColumns: TableColumn[]
  pagination: ListPagination
  initState: () => void
  onRefresh: () => Promise<void>
  onLoad: (query?: ListQuery, shouldReset?: boolean) => Promise<void>
  onReset: (query?: ListQuery) => Promise<void>
}
