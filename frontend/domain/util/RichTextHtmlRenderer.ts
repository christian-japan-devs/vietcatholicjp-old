import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { Asset } from '../models/Asset'
import { escape } from 'html-escaper';



/*
 * richText object must have these fields.
 */
export const CONTENT_SCHEMA =
  `content {
    json,
    links {
      assets {
        block {
          sys {
            id
          },
          contentType,
          url
          title,
          description,
        }
      }
    }
  }`

export const render = (richText: any): string => {
  // Map the assets
  let assetMap = new Map<string, Asset>()
  const assetBlocks = richText.links.assets.block as any[]
  assetBlocks.forEach(block => assetMap.set(
    block.sys.id,
    {
      id: block.sys.id,
      url: block.url,
      title: block.title,
      description: block.description,
      contentType: block.contentType,
    }
  ))

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = assetMap.get(node.data.target.sys.id)

        if (asset && asset.contentType.startsWith('image')) {
          return `<img src="${ escape(asset.url) }" alt="${ escape(asset.description) }"/>`
        }

        return ''
      }
    }
  } as Options

  return documentToHtmlString(richText.json, options)
}
