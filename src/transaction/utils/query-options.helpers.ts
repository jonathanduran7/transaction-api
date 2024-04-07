import { FindManyOptions, Raw } from "typeorm";

export default function buildQueryOptions(userId: number, fromDate?: Date, toDate?: Date, accountFromId?: number): FindManyOptions {
    const options: FindManyOptions = {
        relations: ['accountFrom', 'accountFrom.currency', 'accountTo', 'accountTo.currency'],
        select: {
            id: true,
            amount: true,
            date: true,
            description: true,
            accountFrom: {
                id: true,
                currency: {
                    currencyName: true
                }
            },
            accountTo: {
                id: true,
                currency: {
                    currencyName: true
                }
            }
        },
        where: {
            accountFrom: {
                user: {
                    id: userId
                }
            }
        }
    };

    if (accountFromId) {
        options.where = {
            ...options.where,
            accountFrom: {
                id: accountFromId
            }
        }
    }

    if (fromDate.getTime() || toDate.getTime()) {
        const filterDate = buildQueryFilterDate(fromDate, toDate);
        options.where = {
            ...options.where,
            date: Raw(_ => filterDate)
        };
    }

    return options;
}

function buildQueryFilterDate(fromDate: Date, toDate: Date): string {
    if (fromDate.getTime() && toDate.getTime()) {
        return `date >= '${fromDate.toISOString()}' AND date <= '${toDate.toISOString()}'`
    }

    if (fromDate.getTime() && !toDate.getTime()) {
        return `date >= '${fromDate.toISOString()}'`
    }

    if (!fromDate.getTime() && toDate.getTime()) {
        return `date <= '${toDate.toISOString()}'`
    }
}