#!/usr/bin/env node
import { Command } from 'commander'
import genDiff from '../src/index.js'

const program = new Command()
program.exitOverride()
program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2, options) => {
    try {
      const { format } = options
      console.log(genDiff(filepath1, filepath2, format))
    }
    catch (error) {
      console.error(`Error: ${error.message}`)
      throw error
    }
  })

program.parse(process.argv)
