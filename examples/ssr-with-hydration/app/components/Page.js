import React from 'react'
import { PageNavigation } from './PageNavigation'
import { placeholder, createSlotterFor } from '@financial-times/anvil-ui-slots'

Page.Body = placeholder()
Page.Header = placeholder()
Page.Footer = placeholder()

export default function Page(props) {
  const Slot = createSlotterFor(Page, props)

  return (
    <React.Fragment>
      <header>
        <Slot name="Header" />
        <PageNavigation />
      </header>
      <main id="root">
        <Slot name="Body" />
      </main>
      <footer>
        <Slot name="Footer" />
      </footer>
    </React.Fragment>
  )
}