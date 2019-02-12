import React from 'react'

const Search = ({ context }) => {
  return (
    <div
      id={`o-header-search-${context}`}
      className={`o-header__row o-header__search o-header__search--${context}`}
      data-trackable="header-search"
      data-o-header-search>
      <div className="o-header__container">
        <form
          className="o-header__search-form"
          action="/search"
          role="search"
          aria-label="Site search"
          data-n-topic-search
          data-n-topic-search-categories="concepts,equities"
          data-n-topic-search-view-all>
          <label className="o-header__visually-hidden" for={`"o-header-search-term-${context}`}>
            Search the <abbr title="Financial Times">FT</abbr>
          </label>
          <input
            className="o-header__search-term"
            id={`o-header-search-term-${context}`}
            name="q"
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            data-trackable="search-term"
            placeholder="Search the FT"
            data-n-topic-search-input
          />
          <button className="o-header__search-submit" type="submit" data-trackable="search-submit">
            Search
          </button>
          <button
            className="o-header__search-close o--if-js"
            type="button"
            aria-controls={`"o-header-search-${context}`}
            title="Close search bar"
            data-trackable="close">
            <span className="o-header__visually-hidden">Close</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export { Search }