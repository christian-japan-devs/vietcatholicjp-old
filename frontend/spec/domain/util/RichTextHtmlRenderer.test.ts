import { render } from '../../../domain/util/RichTextHtmlRenderer'
import { Asset } from '../../../domain/models/Asset'

describe('RichTextHtmlRendererTest', () => {
  it('should render text and image assets to HTML correctly', () => {
    const richText = {
      "json": {
        "nodeType": "document",
        "data": {},
        "content": [
          {
            "nodeType": "paragraph",
            "data": {},
            "content": [
              {
                "nodeType": "text",
                "value": "Testing 1234",
                "marks": [],
                "data": {}
              }
            ]
          },
          {
            "nodeType": "embedded-asset-block",
            "data": {
              "target": {
                "sys": {
                  "id": "1gT149hDrm5bRGUPS6OYM4",
                  "type": "Link",
                  "linkType": "Asset"
                }
              }
            },
            "content": []
          },
          {
            "nodeType": "paragraph",
            "data": {},
            "content": [
              {
                "nodeType": "text",
                "value": "Here is a big bird",
                "marks": [
                  {
                    "type": "bold"
                  }
                ],
                "data": {}
              }
            ]
          },
          {
            "nodeType": "embedded-asset-block",
            "data": {
              "target": {
                "sys": {
                  "id": "9t4jDQQwt1his5LRMkDQV",
                  "type": "Link",
                  "linkType": "Asset"
                }
              }
            },
            "content": []
          },
          {
            "nodeType": "paragraph",
            "data": {},
            "content": [
              {
                "nodeType": "text",
                "value": "",
                "marks": [],
                "data": {}
              }
            ]
          }
        ]
      },
      "links": {
        "assets": {
          "block": [
            {
              "sys": {
                "id": "1gT149hDrm5bRGUPS6OYM4"
              },
              "contentType": "image/jpeg",
              "url": "https://images.ctfassets.net/cc0hz5irnide/1gT149hDrm5bRGUPS6OYM4/5669deea09256babebec1b4f22e86cb7/Cassini_team_Abbey_road.jpg",
              "title": "Cassini team Abbey road",
              "description": ""
            },
            {
              "sys": {
                "id": "9t4jDQQwt1his5LRMkDQV"
              },
              "contentType": "image/jpeg",
              "url": "https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg",
              "title": "Sample",
              "description": ""
            }
          ]
        }
      }
    }

    const html = render(richText)
    expect(html).toEqual('<p>Testing 1234</p><img src="https://images.ctfassets.net/cc0hz5irnide/1gT149hDrm5bRGUPS6OYM4/5669deea09256babebec1b4f22e86cb7/Cassini_team_Abbey_road.jpg" alt=""/><p><b>Here is a big bird</b></p><img src="https://images.ctfassets.net/cc0hz5irnide/9t4jDQQwt1his5LRMkDQV/0dcc58542989e4e2b861b403f607b75f/000107506.jpg" alt=""/><p></p>')
  })
})