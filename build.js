#!/usr/bin/env node

const fs = require('fs')
const nunjucks = require('nunjucks')
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('.'))

const [templatePath, dataPath] = process.argv.slice(2)
const data = require('./' + dataPath)

const scaleDown = n => n / 255
const colorTemplateString = String(fs.readFileSync('color.part.plist')).replaceAll('\n', '\n\t')
const colorTemplate = nunjucks.compile(colorTemplateString)
const renderColor = ([r, g, b, a, space]) => colorTemplate.render({
	r: scaleDown(r),
	g: scaleDown(g),
	b: scaleDown(b),
	a,
	space,
})

env.addGlobal('color', ([r, g, b, a, s], { red, green, blue, alpha, space } = {}) =>
	renderColor([red ?? r, green ?? g, blue ?? b, alpha ?? a, space ?? s]))

console.log(env.render(templatePath, data).replaceAll('\n\n', '\n'))
