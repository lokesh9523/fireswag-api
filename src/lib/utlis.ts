
import { AppConstants } from '../utils/app-constants';
import { Request } from 'express';

export const paginateQuery = (req: Request) => {
    const page = parseInt(req.query.page as string) || AppConstants.DEFAULT_SKIP;
    const limit = parseInt(req.query.rowsPerPage as string) || AppConstants.DEFAULT_LIMIT;
    const skip = page * limit;
    const sortKey = req.query.orderBy as string || AppConstants.DEFAULT_SORT_KEY;
    const sortValue = req.query.order === 'asc' ? 1 : -1 || AppConstants.DEFAULT_SORT_VALUE;
    const sort = { [sortKey]: sortValue };

    return { sort, skip, limit };
};