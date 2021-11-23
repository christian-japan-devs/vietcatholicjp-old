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

    isProduction (): boolean {
        return this.productionFalg
    }
}
