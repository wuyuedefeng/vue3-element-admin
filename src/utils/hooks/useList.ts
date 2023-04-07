import type { ComputedRef } from 'vue'
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useList = (options: ListOptions) => {
  const router = useRouter()
  const route = useRoute()
  let self: any = null
  let routeQ = {}
  try {
    routeQ = route.query?.q ? JSON.parse(route.query.q as string) : {}
  } catch (e) {
    routeQ = {}
  }
  const state = reactive<List>({
    supportUrlQuery: options.supportUrlQuery || true,
    fetchCount: 0,
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isError: computed<boolean>(() => !!self?.errorInfo),
    // isError: false,
    errorInfo: null,
    query: { ...options.query, ...routeQ },
    records: [],
    tableColumns: options.tableColumns ? [...options.tableColumns] : [],
    pagination: {
      pageNo: 1,
      pageSize: 20,
      totalPage: 1,
      totalCount: 0,
      onCurrentChange(pageNo: number) {
        self.pagination.pageNo = pageNo
        self.onLoad()
      },
      onSizeChange(pageSize: number) {
        self.pagination.pageSize = pageSize
        self.onLoad()
      },
      ...options.pagination
    },
    initState() {
      Object.assign(self, {
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
          ...self.pagination,
          pageNo: 1,
          pageSize: 20,
          totalPage: 1,
          totalCount: 0,
          ...options.pagination
        }
      })
    },
    async onRefresh(defaultQuery: ListQuery = {}) {
      // 清空列表数据
      state.records = []
      state.isFinished = false
      state.isRefreshing = true
      await state.onLoad(defaultQuery)
    },
    async onLoad(defaultQuery: ListQuery = {}, shouldReset = false) {
      const { pageNo, pageSize, ...otherQuery } = defaultQuery
      if (shouldReset) {
        state.query = otherQuery
        state.pagination.pageNo = 1
        state.pagination.pageSize = 10
      }
      if (Object.prototype.hasOwnProperty.call(defaultQuery, 'pageNo')) {
        state.pagination.pageNo = pageNo as number
        state.query.pageNo = state.pagination.pageNo
      }
      if (Object.prototype.hasOwnProperty.call(defaultQuery, 'pageSize')) {
        state.pagination.pageSize = pageSize as number
        state.query.pageSize = state.pagination.pageSize
      }
      state.isLoading = true
      state.fetchCount++
      if (state.isRefreshing) {
        state.records = []
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
        .onLoad(state)
        .then((data: any) => {
          // state.isError = false
          state.errorInfo = null
          return data
        })
        .catch((err: Error) => {
          // state.isError = true
          state.errorInfo = err
        })
        .finally(() => {
          state.isLoading = false
        })
    },
    async onReset(defaultQuery: ListQuery = {}) {
      state.initState()
      state.onLoad(defaultQuery, true)
    }
  })
  self = state
  return state
}

export interface ListOptions {
  supportUrlQuery?: boolean
  tableColumns?: TableColumn[]
  onLoad: (query: any) => Promise<void>
  query?: ListQuery
  pagination?: ListPagination
}

export interface TableColumn {
  type?: 'selection' | 'index' | 'expand'
  index?: number | ((index: number) => number)
  label?: string
  columnKey?: string
  prop: string
  slot?: string
  width?: string | number
  fixed?: true | 'left' | 'right'
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
  onRefresh: () => void
  onLoad: (query?: ListQuery, shouldReset?: boolean) => void
  onReset: (query?: ListQuery) => void
}
