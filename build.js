#!/usr/bin/env node

const fs = require('fs')
const nunjucks = require('nunjucks')
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('.'))

const [templatePath, dataPath] = process.argv.slice(2)
const data = require('./' + dataPath)

const colorTemplateString = String(fs.readFileSync('color.part.plist')).replaceAll('\n', '\n\t')
const colorTemplate = nunjucks.compile(colorTemplateString)

const renderColor = ([r, g, b, a, s]) => colorTemplate.render({
	redComponent: r,
	greenComponent: g,
	blueComponent: b,
	alphaComponent: a,
	colorSpace: s,
})

const changeColor = ([r, g, b, a, s], { red, green, blue, alpha, space } = {}) =>
	[red ?? r, green ?? g, blue ?? b, alpha ?? a, space ?? s]

const mixColors = ([r1, g1, b1, a1 = 1], [r2, g2, b2, a2 = 1], weight) => {
	const w = 2 * weight - 1
	const a = a1 - a2

	const w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2
	const w2 = 1 - w1

	return [
		w1 * r1 + w2 * r2,
		w1 * g1 + w2 * g2,
		w1 * b1 + w2 * b2,
		a1 * weight + a2 * (1 - weight),
	]
}

const removeAlpha = (color, background) => background != null
	? mixColors(changeColor(color, { alpha: 1 }), changeColor(background, { alpha: 1 }), color[4] ?? 1)
	: changeColor(color, { alpha: 1})

env.addGlobal('color', (source, update) => renderColor(changeColor(source, update)))

env.addFilter('edit', changeColor)
env.addFilter('alpha', (color, alpha) => changeColor(color, { alpha }))
env.addFilter('opaque', removeAlpha)
env.addFilter('mix', mixColors)
env.addFilter('format', renderColor)

console.log(env.render(templatePath, data).replaceAll('\n\n', '\n'))
