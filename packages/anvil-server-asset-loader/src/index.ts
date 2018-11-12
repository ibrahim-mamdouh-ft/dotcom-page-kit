import fs from 'fs'
import { loadManifest } from './asset-helpers'

class AssetLoader {
  private manifest: object

  constructor(path: string) {
    this.manifest = loadManifest(path)
  }

  getAssetPath(asset: string) {
    if (asset && this.manifest.hasOwnProperty(asset)) {
      return this.manifest[asset]
    } else {
      throw Error(`Couldn't find asset "${asset}" in manifest`)
    }
  }

  getStylesheetInline(stylesheet: string): string {
    const styles = fs.readFileSync(this.getAssetPath(stylesheet))
    return `<style>${styles.toString()}</style>`
  }

  getJavascriptInline(javascript: string): string {
    const scripts = fs.readFileSync(this.getAssetPath(javascript))
    return `<script>${scripts.toString()}</script>`
  }

  createStylesheetLink(stylesheet: string): string {
    // TODO: support production URLs
    return `<link rel="stylesheet" href="/${this.getAssetPath(stylesheet)}">`
  }

  createJavascriptLink(javascript: string): string {
    // TODO: support production URLs
    return `<script rel="text/javascript" src="/${this.getAssetPath(javascript)}"></script>`
  }
}

export default AssetLoader