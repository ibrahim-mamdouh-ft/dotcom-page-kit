import deepFreeze from 'deep-freeze'

const addEditionBasedProperties = (navigation, currentEdition) => {
  // Navigation data from the anvil-ft-server-navigation package is frozen
  // and must be cloned before modification
  const clonedNavigation = JSON.parse(JSON.stringify(navigation))
  clonedNavigation.navbar = currentEdition === 'international' ? 'navbar-international' : 'navbar-uk'
  clonedNavigation.drawer = currentEdition === 'international' ? 'drawer-international' : 'drawer-uk'

  return clonedNavigation
}

export const assignNavigation = (navigation, editions) => {
  const currentEdition = editions.current.id

  if (currentEdition && navigation) {
    const response = addEditionBasedProperties(navigation, editions)
    // Re-freezes the navigation data making it completely immutable
    return deepFreeze(response)
  }

  return navigation
}
