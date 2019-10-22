import React from 'react'
import {
  Header as HeaderSimple,
  Header as HeaderLarge,
  LogoOnly,
  Drawer,
  THeaderOptions
} from '@financial-times/dotcom-ui-header/component'
import { TNavigationData } from '@financial-times/dotcom-types-navigation'
import { Footer, LegalFooter, TFooterOptions } from '@financial-times/dotcom-ui-footer/component'
import { loadCustomFontsJS } from '../font-loading'
import Template from './Template'

enum Headers {
  simple = HeaderSimple,
  // This is the same as above but removing the "simple" name will set
  // the logo to its default (large) size.
  'large-logo' = HeaderLarge,
  'logo-only' = LogoOnly
}

enum Footers {
  simple = Footer,
  legal = LegalFooter
}

export type TLayoutProps = {
  navigationData: TNavigationData
  headerOptions: THeaderOptions
  headerBefore?: string | React.ReactNode
  headerVariant?: Headers
  headerComponent?: React.ReactNode
  headerAfter?: string | React.ReactNode
  footerOptions: TFooterOptions
  footerBefore?: string | React.ReactNode
  footerVariant?: Footers
  footerComponent?: React.ReactNode
  footerAfter?: string | React.ReactNode
  children?: React.ReactNode
  contents?: string
}

// EnhanceFonts removes the default o-typography--loading-* styles
// allowing the custom fonts Finacier and MetricWeb to be shown.
// An immediately invoked function expression is embedded in the DOM as a string
const EnhanceFonts = () => {
  return <script dangerouslySetInnerHTML={{ __html: loadCustomFontsJS }} />
}

export function Layout({
  navigationData,
  headerOptions,
  headerBefore,
  headerVariant,
  headerComponent,
  headerAfter,
  footerOptions,
  footerBefore,
  footerVariant,
  footerComponent,
  footerAfter,
  children,
  contents
}: TLayoutProps) {
  const HeaderVariant = Headers[headerVariant]
  const FooterVariant = Footers[footerVariant]

  return (
    <div
      className="n-layout o-typography--loading-sans o-typography--loading-sansBold o-typography--loading-display o-typography--loading-displayBold"
      data-o-component="o-typography">
      <EnhanceFonts />
      <a
        data-trackable="a11y-skip-to-help"
        className="n-layout__skip-link"
        href="https://www.ft.com/accessibility">
        Accessibility help
      </a>
      <a data-trackable="a11y-skip-to-navigation" className="n-layout__skip-link" href="#site-navigation">
        Skip to navigation
      </a>
      <a data-trackable="a11y-skip-to-content" className="n-layout__skip-link" href="#site-content">
        Skip to content
      </a>
      <a data-trackable="a11y-skip-to-footer" className="n-layout__skip-link" href="#site-footer">
        Skip to footer
      </a>

      <div className="n-layout__row n-layout__row--header">
        <Template className="n-layout__header-before">{headerBefore}</Template>
        {headerComponent || (
          <HeaderVariant {...headerOptions} data={navigationData} variant={headerVariant} />
        )}
        <Template className="n-layout__header-after">{headerAfter}</Template>
      </div>

      <div className="n-layout__row n-layout__row--content">
        <Template>{contents || children}</Template>
      </div>

      <div className="n-layout__row n-layout__row--footer">
        <Template className="n-layout__footer-before">{footerBefore}</Template>
        {footerComponent || (
          <FooterVariant {...footerOptions} data={navigationData} variant={footerVariant} />
        )}
        <Template className="n-layout__footer-after">{footerAfter}</Template>
      </div>

      {/* Always render the drawer if there is a default header being used */}
      {HeaderVariant && <Drawer {...headerOptions} data={navigationData} />}
    </div>
  )
}

Layout.defaultProps = {
  headerVariant: 'simple',
  footerVariant: 'simple',
  headerOptions: {},
  footerOptions: {}
}
