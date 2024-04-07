import { Inject, Injectable } from "@nestjs/common";
import { FixerResponse } from "../interfaces/fixer-api-response";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrencyConversionRecord } from "src/entities/currency-conversion-record.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CurrencyConversionService {

    constructor(
        @InjectRepository(CurrencyConversionRecord)
        private currencyConversionRepository: Repository<CurrencyConversionRecord>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService
    ) { }

    async convert({ to, from, amount, date }: { to: string, from: string, amount: number, date: string }): Promise<{ result: number }> {
        const finalAmount = await this.getRateFromDb({ to, from, amount, date });

        if (finalAmount) return finalAmount;

        const response = await this.getRateFromApi({ to, from, amount, date });
        await this.saveRate({ to, from, date, rate: response.info.rate });

        return { result: response.result };
    }


    async getRateFromApi({ to, from, amount, date }: { to: string, from: string, amount: number, date: string }): Promise<FixerResponse> {
        const myHeaders = new Headers();
        myHeaders.append("apikey", this.configService.get('API_KEY'));
        const response = await fetch(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}&date=${date}`,
            { headers: myHeaders, method: 'GET', redirect: 'follow' })

        return response.json();;
    }

    async getRateFromDb(
        { to, from, date, amount }: { to: string, from: string, date: string, amount: number }
    ): Promise<{ result: number }> {
        const cachedRate = await this.getCachedRate({ to, from, date });

        if (cachedRate) return { result: amount * cachedRate };

        const record = await this.currencyConversionRepository.findOne({ where: { to, from, date } });

        if (!record) return null;

        const duration = 6 * 60 * 60;

        await this.cacheManager.set(`${from}-${to}-${date}`, record.rate, duration)

        return { result: amount * record.rate };
    }

    async saveRate({ to, from, date, rate }: { to: string, from: string, date: string, rate: number }) {
        await this.currencyConversionRepository.save({ from: to, to: from, date, rate: 1 / rate })
        return this.currencyConversionRepository.save({ to, from, date, rate });
    }

    async getCachedRate({ to, from, date }: { to: string, from: string, date: string }): Promise<number> {
        return this.cacheManager.get(`${from}-${to}-${date}`);
    }
}