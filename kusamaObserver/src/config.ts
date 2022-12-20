import { Config } from './models/config-model';
import envConfig from '../env-config.json'; 

export function getConfig(): Config {
    const config = envConfig as Config;

    for(let c of config.accounts) {
        if(!('name' in c)) {
            c['name'] = c.accountID;
        }
    }
    return config;
}