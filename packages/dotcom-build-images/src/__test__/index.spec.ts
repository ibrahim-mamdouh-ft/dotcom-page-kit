import { PageKitImagesPlugin } from '../index'
import webpack from 'webpack'
import path from 'path'

describe('dotcom-build-images', () => {
  it('build images', async () => {
    await new Promise((resolve) =>
      webpack(
        {
          mode: 'none',
          entry: {
            // adding an example entry as webpack 4 doesnt support an empty object
            scripts: path.join(__dirname, '/__fixtures__', 'entry-point.js')
          },
          output: {
            filename: '[name].js',
            path: path.join(__dirname, '/tmp')
          },
          plugins: [new PageKitImagesPlugin({ basePath: path.join(__dirname, '/__fixtures__', '/images') })]
        },
        function (error, stats) {
          if (error) {
            throw error
          } else if (stats.hasErrors()) {
            throw stats.toString()
          }

          const files = stats.toJson().assets.map((asset) => asset.name)

          expect(files).toEqual(
            expect.arrayContaining(['scripts.js', '__images__.js', 'vectors/square.469177db7c8b.svg'])
          )

          resolve()
        }
      )
    )
  })
})
