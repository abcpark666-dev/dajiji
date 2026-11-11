// The home-screen icons a phone can switch to (Settings → Look & Home → App icon). Plain data, no
// imports: scripts/app-icons.mjs draws every icon file from this list and the settings row lists
// the same ids, so the picker can never offer an icon the native projects do not have.
//
// `name` is the English key the row passes to t(). `ios` is the AppIcon set in the asset catalog
// (null: the primary icon) and `android` the activity-alias in AndroidManifest.xml. `art` is a
// hand-made SVG the script renders instead of the glyph; `bg`/`fg` are then just its main colours.
export const APP_ICON_VARIANTS = [
  { id: 'default', name: 'Original', bg: '#211a42', fg: '#ff8a58', ios: null, android: 'IconDefault' },
  { id: 'light', name: 'Light', bg: '#fff5ef', fg: '#5c2d85', ios: 'AppIcon-Light', android: 'IconLight' },
  { id: 'mono', name: 'Mono', bg: '#211a42', fg: '#f8f4ff', ios: 'AppIcon-Mono', android: 'IconMono' },
  { id: 'neon', name: 'Coral', bg: '#ffb38f', fg: '#211a42', ios: 'AppIcon-Neon', android: 'IconNeon' },
  { id: 'sky', name: 'Blue', bg: '#4a5d9a', fg: '#ffffff', ios: 'AppIcon-Sky', android: 'IconSky' },
  { id: 'orange', name: 'Orange', bg: '#ff8a58', fg: '#211a42', ios: 'AppIcon-Orange', android: 'IconOrange' },
  { id: 'pink', name: 'Pink', bg: '#d95f89', fg: '#ffffff', ios: 'AppIcon-Pink', android: 'IconPink' },
  { id: 'violet', name: 'Purple', bg: '#7341b6', fg: '#ffffff', ios: 'AppIcon-Violet', android: 'IconViolet' },
  { id: 'halloween', name: 'Halloween', bg: '#26132e', fg: '#ff9e54', ios: 'AppIcon-Halloween', android: 'IconHalloween' },
  { id: 'christmas', name: 'Christmas', bg: '#3a214d', fg: '#ffb38f', ios: 'AppIcon-Christmas', android: 'IconChristmas' },
]

export const APP_ICON_IDS = APP_ICON_VARIANTS.map(v => v.id)
