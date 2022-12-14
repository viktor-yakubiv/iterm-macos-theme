// Accessed on December 14, 2022
//
// This script is expected to be ran from browser console
// but might not work due to changes on the webpage

// window.location = 'https://developer.apple.com/design/human-interface-guidelines/foundations/color#macos'

const parseColor = text => text
	.replace(/[RGB]\s*/g, '')
	.split('\n')
	.map(s => parseInt(s, 10))
	// .map(n => n.toString(16).padStart(2, '0'))
	// .join('')

const parseEntries = (namesSelector, tablesSelector) => {
	const $names = document.querySelectorAll(namesSelector)
	const names = Array.from($names, e => e.textContent.trim()).map(s => s.toLowerCase().replace(/\s*\+\s*/g, '-'))
	const $tables = document.querySelectorAll(tablesSelector)

	return Array.from($tables, ($table, i) => {
		const name = names[i]
		const colors = Array.from($table.querySelectorAll('tr'), $tr => {
			const cells = Array.from($tr.querySelectorAll('td'), $td => $td.textContent.trim())
			const light = parseColor(cells[0])
			const dark = parseColor(cells[1])
			const name = cells[2].toLowerCase()

			return [name, { light, dark }]
		})

		return [name, colors]
	})
}

const flatten = table => Object.fromEntries(table.flatMap(([name, colors]) => {
	const light = Object.fromEntries(colors.map(([name, { light }]) => [name, light]))
	const dark = Object.fromEntries(colors.map(([name, { dark }]) => [name, dark]))
	return [[name + '-light', light], [name + '-dark', dark]]
}))

const prefix = p => ([name, value]) => [p + name, value]

const accentEntries = parseEntries(
	'#bxlabels-macos-system-color-examples a',
	'.macos-system-color-gallery tbody',
).map(prefix('accent-'))
const silverEntries = parseEntries(
	'#bxlabels-ios-system-color-gray-examples a',
	'.ios-system-color-gray-gallery tbody',
).map(prefix('gray-'))

const colors = flatten([...accentEntries, ...silverEntries])

console.log(JSON.stringify(colors))
