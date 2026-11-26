import {homeObjects, homePage} from './home'
import {objects} from './objects'
import {privacyPage} from './privacy'
import {siteSettings} from './settings'

/** The documents there is exactly one of; each one's ID is its type's name. */
export const singletons = [homePage, privacyPage, siteSettings]

export const schemaTypes = [...singletons, ...objects, ...homeObjects]
