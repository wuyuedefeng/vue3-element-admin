import type { ComputedRef } from 'vue'
import { reactive, computed } from 'vue'

export const useList = (options: ListOptions) => {
  let self: any = null
  const state = reactive<List>({
    fetchCount: 0,
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isError: computed<boolean>(() => !!self?.errorInfo),
    // isError: false,
    errorInfo: null,
    query: { ...options.query },
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
          ...self.state.pagination,
          pageNo: 1,
          pageSize: 20,
          totalPage: 1,
          totalCount: 0,
          ...options.pagination
        }
      })
    },
    async onRefresh() {
      // 清空列表数据
      state.records = []
      state.isFinished = false
      state.isRefreshing = true
      await state.onLoad()
    },
    async onLoad(defaultQuery: ListQuery = {}, shouldReset = false) {
      const { pageNo, pageSize, ...otherQuery } = defaultQuery
      if (shouldReset) {
        this.query = otherQuery
        state.pagination.pageNo = 1
        state.pagination.pageSize = 10
      }
      if (Object.prototype.hasOwnProperty.call(defaultQuery, 'pageNo')) {
        state.pagination.pageNo = pageNo as number
      }
      if (Object.prototype.hasOwnProperty.call(defaultQuery, 'pageSize')) {
        state.pagination.pageSize = pageSize as number
      }
      state.isLoading = true
      state.fetchCount++
      if (state.isRefreshing) {
        state.records = []
        state.isRefreshing = false
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
    }
  })
  self = state
  return state
}

export interface ListOptions {
  tableColumns?: TableColumn[]
  onLoad: (query: any) => Promise<void>
  query?: ListQuery
  pagination?: ListPagination
}

export interface TableColumn {
  type?: 'selection' | 'index' | 'expand'
  index?: number | ((index: number) => number)
  label: string
  columnKey?: string
  prop: string
  width?: string | number
  fixed?: true | 'left' | 'right'
  renderHeader?: (param: { column: TableColumn; $index: number }) => JSX.Element
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
}
