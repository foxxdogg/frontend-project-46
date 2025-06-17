import { Command } from 'commander';
import { loadParsedFiles, genDiff } from './buildDiff.js';

const program = new Command();
program.exitOverride();
program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2, options) => {
    try {
      const { format } = options;
      const [file1, file2] = loadParsedFiles(filepath1, filepath2);
      console.log(genDiff(file1, file2, format));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  });

const runApp = (argv = process.argv) => {
  const fakeArgs = ['node', 'gendiff', 'data/file1.json', 'data/file2.json'];
  const args = argv.length < 3 ? fakeArgs : argv;
  program.parse(args);
};

export default runApp;
