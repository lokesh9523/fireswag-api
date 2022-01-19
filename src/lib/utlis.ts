
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
export const getLookupQuery = (from: string, localField: string, foreignField: string, as: string) => {
    return {
        $lookup: {
            from,
            localField,
            foreignField,
            as
        }
    };
}
export const queryFieldsIn = (search_string: string, collection: 'Products') => {
    return getSearchFieldsFromCollectionName(collection).map(x => {
        console.log(x,"============================x")
        return { [x]: { $in: stringToRegex(search_string) } };
    });
};
export const stringToRegex = (string: string): RegExp[] => {
    return string.split(' ').map(x => {
        console.log(x.length,'============x.length')
        if (x.length)
        console.log(new RegExp(x,'i'),"=================")
            return new RegExp(x, 'i');
    });
};
export const getSearchFieldsFromCollectionName = (collection: 'Products'): string[] => {
    console.log(collection,"=================ssss")
    switch (collection) {
        case 'Products':
            return ['name'];

        default:
            return [];
    }
};