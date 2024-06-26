import { GridPaginationModel } from '@mui/x-data-grid'
import { Pagination, PaginationModel } from './useServerPagination'

export interface UseGridPaginationFieldsOptions {
  load: (modal: Partial<PaginationModel>) => Promise<void>
  pagination: Pagination
}

export function useGridPaginationFields(options: UseGridPaginationFieldsOptions) {
  return {
    paginationMode: 'server' as const,
    paginationModel: {
      page: options.pagination.page - 1,
      pageSize: options.pagination.limit,
    },
    hideFooterSelectedRowCount: true,
    rowCount: options.pagination.total,
    onPaginationModelChange: (model: GridPaginationModel) => {
      options.load({ page: model.page + 1, limit: model.pageSize })
    },
  }
}
