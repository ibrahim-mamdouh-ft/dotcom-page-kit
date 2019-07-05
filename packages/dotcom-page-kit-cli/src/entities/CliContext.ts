import { CliPrompt } from './CliPrompt'
import { AnyObject } from '@financial-times/dotcom-types-generic'
import { PageKitConfig } from '../types/PageKitConfig'
import { Pluggable, Plugin } from '@financial-times/dotcom-page-kit-pluggable'

interface ConstructorArgs {
  config: PageKitConfig
  plugins: Plugin[]
  prompt?: CliPrompt
  workingDir: string
}

export class CliContext extends Pluggable {
  cli = this
  args: AnyObject = {}
  prompt: CliPrompt
  config: PageKitConfig
  options: AnyObject = {}
  workingDir: string

  constructor({ prompt = new CliPrompt(), workingDir, plugins, config }: ConstructorArgs) {
    super({ alias: 'cli', plugins })

    this.prompt = prompt
    this.workingDir = workingDir
    this.config = normaliseConfig(config)
  }
}

function normaliseConfig(config: Partial<PageKitConfig> = {}) {
  return { plugins: [], settings: {}, ...config }
}