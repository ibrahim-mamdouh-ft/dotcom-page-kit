import path from 'path'
import { loadFile } from './helpers/loadFile'
import { loadManifest } from './helpers/loadManifest'

export interface AssetLoaderOptions {
  /**
   * The name of the asset manifest file
   * @default "manifest.json"
   */
  manifestFileName?: string

  /**
   * The public-facing URL for the static assets
   */
  publicPath?: string

  /**
   * The absolute path to the directory of static assets
   * @default path.resolve('./public')
   */
  fileSystemPath?: string

  /**
   * Store files in memory when accessed
   * @default false
   */
  cacheFileContents?: boolean
}

const defaultOptions: AssetLoaderOptions = {
  publicPath: '',
  manifestFileName: 'manifest.json',
  fileSystemPath: path.resolve('./public'),
  cacheFileContents: false
}

class AssetLoader {
  public options: AssetLoaderOptions
  public manifest: object

  constructor(userOptions: AssetLoaderOptions) {
    this.options = { ...defaultOptions, ...userOptions }
    this.manifest = loadManifest(path.resolve(this.options.fileSystemPath, this.options.manifestFileName))
  }

  matchAssets(pattern: string | RegExp | Function): string[] {
    return Object.keys(this.manifest).reduce((matches: string[], key: string) => {
      if (typeof pattern === 'string' && key.includes(pattern)) {
        matches.push(key)
      }

      if (pattern instanceof RegExp && pattern.test(key)) {
        matches.push(key)
      }

      if (pattern instanceof Function && pattern(key)) {
        matches.push(key)
      }

      return matches
    }, [])
  }

  getHashedAsset(asset: string): string {
    if (this.manifest.hasOwnProperty(asset)) {
      return this.manifest[asset]
    } else {
      throw Error(`Couldn't find asset "${asset}" in manifest`)
    }
  }

  getFileContents(asset: string): string {
    return loadFile(this.getFileSystemPath(asset), this.options.cacheFileContents)
  }

  getFileSystemPath(asset: string): string {
    const hashedAsset = this.getHashedAsset(asset)
    return path.join(this.options.fileSystemPath, hashedAsset)
  }

  getPublicURL(asset: string): string {
    const hashedAsset = this.getHashedAsset(asset)
    // Do not use path.join() as separator is platform specific
    return `${this.options.publicPath}/${hashedAsset}`
  }
}

export default AssetLoader
