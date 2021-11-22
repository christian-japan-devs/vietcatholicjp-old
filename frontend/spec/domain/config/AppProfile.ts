import { singleton } from 'tsyringe'

export interface AppProfile {
    isProduction (): boolean
}

/**
 * Simple implementation of AppProfile using environment variables.
 */
@singleton()
export class EnvVarProfile implements AppProfile{
    private readonly productionFalg = (process.env.NODE_ENV === 'production')

    constructor () {
        if (!this.isProduction()){
            console.log('NOTE: Non-production environment')
        }
    }

    isProduction (): boolean {
        return this.productionFalg
    }
}