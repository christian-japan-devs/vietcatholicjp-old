import { singleton } from "tsyringe";

export interface Properties {
    cmsEnpoint (): string,
    cmsApiKey (): string,
}

@singleton()
export class HardcodedProperties {
    cmsEndpoint (): string {
        return 'https://graphql.contentful.com/content/v1/spaces/cc0hz5irnide/environments/master'
    }

    cmsApiKey (): string {
        return 'oUtS6XPuw3vCgMM0lqwE0MdnpQXsNQdihELidz09kWA'
    }
}