#!/usr/bin/env node
'use strict'

const chalk = require('chalk')
const meow = require('meow')
const readline = require('readline')
const logUpdate = require('log-update')
const clipboardy = require('clipboardy')
const keycode = require('keycode')
const library = require('./package').name

const prompt = '›'
const prefixInput = `${chalk.bold.cyan(prompt)}  `
const prefixOutput = '⌨  '
const notFoundMessage = chalk.red('Keycode not found')
const copiedMessage = chalk.italic.yellow('Copied to clipboard')
const exitMessage = chalk.dim('^C to exit')

const cli = meow(`
  Usage
    $ ${library}

  Example
    $ ${library}
    ${prefixInput}$
    ${prefixOutput}36

    $ ${library} '#'
    ${prefixOutput}35

  Options
    --copy -c  Copy the keycode to the clipboard
`, {
  boolean: [
    'copy'
  ],
  alias: {
    c: 'copy'
  }
})

if (cli.input.length > 0) {
  const keyname = cli.input[0]
  const code = keycode(keyname)
  let output = code ? chalk.bold.green(code) : notFoundMessage

  if (cli.flags.copy && code) {
    clipboardy.writeSync(code.toString())
    output += `\n${copiedMessage}`
  }

  logUpdate(`${prefixInput}${keyname}\n${prefixOutput}${output}`)

  process.exit()
}

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

logUpdate(`${prefixInput}${chalk.dim('Keycodes will appear when you start typing')}\n\n${exitMessage}\n`)

process.stdin.on('keypress', (ch, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit()
  }

  const keyname = key.name || key.sequence
  const code = keycode(keyname)
  let output = code ? chalk.bold.green(code) : notFoundMessage

  if (cli.flags.copy && code) {
    clipboardy.write(code.toString())
    output += `\n${copiedMessage}`
  }

  logUpdate(`${prefixInput}${keyname}\n${prefixOutput}${output}\n${exitMessage}`)
})
