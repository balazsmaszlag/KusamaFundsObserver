import { ApiPromise, WsProvider } from '@polkadot/api';
import {getConfig} from './config';
import {Config} from './models/config-model'
import * as promClient from 'prom-client';


const statusNormal: number = 0;
const statusCritical: number = 1;
// TODO: using logger
export default class KusamaObserver{

    unsub: any[] = [];
    readonly config: Config = getConfig();
    readonly wsProvider = new WsProvider(this.config.wss);

    async observeFounds () {    
        const gauge = new promClient.Gauge({ name: 'fund_metrics', help: 'some help', labelNames: ['userName', 'accountID', 'status'] });
        const api = await ApiPromise.create({ provider: this.wsProvider });
        const unsub = [];
        for (const account of this.config.accounts) {

            let { data: { free: previousFree }, nonce: previousNonce }: any = await api.query.system.account(account.accountID);

            // FIXME:  a JS number (limited to 2^53 - 1). This does mean that for large values, e.g. Balance (a u128 extension), this can cause overflows
            gauge.labels({userName: account.name, accountID: account.accountID, status: this.getStatus(previousFree)}).set(previousFree.toNumber());

            const a = api.query.system.account(account.accountID, ({ data: { free: currentFree }, nonce: currentNonce }: any) => {
                // Calculate the delta
                const change = currentFree.sub(previousFree);

                // Only display positive value changes (Since we are pulling `previous` above already,
                // the initial balance change will also be zero)
                if (!change.isZero()) {
                    console.log(`New balance change of ${change}, nonce ${currentNonce}`);
                    if(change < 0) {
                        gauge.labels({userName: account.name, accountID: account.accountID,status: this.getStatus(currentFree)}).dec(change.toNumber());
                    } else {
                        gauge.labels({userName: account.name, accountID: account.accountID,status: this.getStatus(currentFree)}).inc(change.toNumber());
                    }
                    previousFree = currentFree;
                    previousNonce = currentNonce;
                }
            });

            this.unsub.push(a);
        }
    }

    getStatus(freeFunds: number): number{
        return freeFunds < this.config.minFunds ? statusCritical : statusNormal;
    }

}

